import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postUrl = searchParams.get('url');
  const code = searchParams.get('code');

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
    
    // Set a more realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
    await page.setJavaScriptEnabled(false);
    
    await page.goto(postUrl, {
      waitUntil: 'networkidle0',
      timeout: 10000,
    });

    // Wait for either the new or old tweet selectors
    const tweetText = await page.evaluate(() => {
      const tweetElement = 
        document.querySelector('[data-testid="tweetText"]') || 
        document.querySelector('article[data-testid="tweet"]');
      return tweetElement?.textContent || '';
    });

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
