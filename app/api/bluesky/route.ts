import { NextResponse } from 'next/server';
import { BskyAgent } from '@atproto/api';

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

  try {
    // Create a Bluesky Agent
    const agent = new BskyAgent({
      service: 'https://bsky.social'
    });

    // Login
    await agent.login({
      identifier: process.env.BLUESKY_USERNAME!,
      password: process.env.BLUESKY_PASSWORD!
    });

    // Extract post ID from URL
    const postId = postUrl.split('/post/').pop();

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Invalid Bluesky post URL' },
        { status: 400 }
      );
    }

    // Get the post using the agent
    const post = await agent.getPost({ rkey: postId, repo: process.env.BLUESKY_USERNAME! });
    const postText = post.value.text;
    const containsCode = postText.includes(code);

    return NextResponse.json({ success: true, verified: containsCode });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
