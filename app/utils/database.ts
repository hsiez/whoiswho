/**
 * Links two social media accounts together
 */
export async function createLink(xId: string, bsId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'x-id': xId,
        'bs-id': bsId,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error creating link:', error);
    return false;
  }
}

/**
 * Finds the linked account for a given username
 * Returns the linked ID if found, null if not found
 */
export async function findLinkedAccount(username: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/links?username=${encodeURIComponent(username)}`);
    const data = await response.json();

    if (data.success) {
      return data.linkedId;
    }
    return null;
  } catch (error) {
    console.error('Error finding linked account:', error);
    return null;
  }
}
