import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postUrl = searchParams.get('url');
  const code = searchParams.get('code');
  console.log("code", code)

  if (!postUrl || !code) {
    return NextResponse.json(
      { success: false, error: 'Missing url or code parameter' },
      { status: 400 }
    );
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();
    
    // Enhanced browser configuration
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
    await page.setJavaScriptEnabled(true); // Enable JavaScript as X requires it
    
    // Add viewport to appear more like a real browser
    await page.setViewport({
      width: 1280,
      height: 800
    });

    await page.goto(postUrl, {
      waitUntil: 'networkidle0',
      timeout: 10000, // Increased timeout
    });

    // Wait for content to load with timeout
    try {
      await page.waitForSelector('[data-testid="tweetText"], article[data-testid="tweet"]', {
        timeout: 5000
      });
    } catch (error) {
      console.log("Selector wait timeout:", error);
    }

    // Enhanced tweet text extraction
    const tweetText = await page.evaluate(() => {
      // Try multiple possible selectors
      const selectors = [
        '[data-testid="tweetText"]',
        'article[data-testid="tweet"] div[lang]', // Tweet content often has lang attribute
        'article[data-testid="tweet"]'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element?.textContent) {
          return element.textContent.trim();
        }
      }
      return '';
    });

    console.log("tweetText", tweetText);

    const containsCode = tweetText.includes(code);
    return NextResponse.json({ success: true, verified: containsCode });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
