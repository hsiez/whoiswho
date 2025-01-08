'use client';

import { useState } from 'react';
import { useExpandableGrid } from './expandable-grid';
import UrlInput from './url-input';
import PrimaryButton from './buttons/primary';
import gridStyles from './expandable-grid.module.css';
import { checkPostBluesky } from '../utils/bluesky-search';
import { checkPostX } from '../utils/x-search';
import { createLink } from '../utils/database';

interface PostFormProps {
  verificationCode: string;
}

export default function PostForm({
  verificationCode
}: PostFormProps) {

  const [blueskyUrl, setBlueskyUrl] = useState('');
  const [xUrl, setXUrl] = useState('');
  const [blueskyError, setBlueskyError] = useState('');
  const [xError, setXError] = useState('');
  const { isExpanded } = useExpandableGrid();

  if (!isExpanded) return null;

  const handleButtonClick = async () => {
    try {
      // Reset errors and set loading
      setBlueskyError('');
      setXError('');

      const [blueskyResult, xResult] = await Promise.all([
        checkPostBluesky(blueskyUrl, verificationCode),
        checkPostX(xUrl, verificationCode)
      ]);

      if (!blueskyResult) {
        setBlueskyError('Verification code not found in post');
      }
      if (!xResult) {
        setXError('Verification code not found in post');
      }

      // If both verifications succeed, create the link
      if (blueskyResult && xResult) {
        const linkCreated = await createLink(
          xUrl.split('x.com/')[1].split('/')[0],  // Extract X username from URL
          blueskyUrl.split('/profile/')[1].split('/post/')[0]  // Extract Bluesky handle
        );
        
        if (!linkCreated) {
          console.error("Failed to create link");
        }
      }

    } catch (error) {
      console.error("Verification failed:", error);
      console.log("false");
    } finally {
    }
  };

  return (
    <div className={gridStyles.gridContent}>
        <div className={gridStyles.firstUrlInput}>
            <UrlInput 
                placeholder="https://bsky.app/post/url" 
                onChange={setBlueskyUrl}
                error={blueskyError}
            />
        </div>
        <div className={gridStyles.secondUrlInput}>
            <UrlInput 
                placeholder="https://x.com/post/url" 
                onChange={setXUrl}
                error={xError}
            />
        </div>
        <PrimaryButton 
            text="Link Posts"
            onClick={handleButtonClick}
            className={gridStyles.linkButton}
        />
    </div>
  );
} 