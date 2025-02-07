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

    // Extract post ID and repo from URL
    const urlParts = postUrl.split('/');
    const postId = urlParts.pop(); // Gets the last segment
    urlParts.pop(); // Remove the 'post' segment
    const repo = urlParts.pop(); // Gets the username segment
    console.log("postId", postId, "repo", repo);

    if (!postId || !repo) {
      return NextResponse.json(
        { success: false, error: 'Invalid Bluesky post URL' },
        { status: 400 }
      );
    }

    // Get the post using the agent
    console.log("postId", postId, "repo", repo);
    try {
      const post = await agent.getPost({ rkey: postId, repo: repo });
      const postText = post.value.text;
      const containsCode = postText.includes(code);

      return NextResponse.json({ success: true, verified: containsCode });
    } catch (error) {
      console.error("Error getting post:", error);
      return NextResponse.json(
        { success: false, error: 'Error getting post' },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
