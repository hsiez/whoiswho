'use client';

import { useState } from 'react';
import { useExpandableGrid } from './expandable-grid';
import PostForm from './post-form';
import CopyCode from './copy-code';
import styles from './expandable-grid.module.css';
import ExpandableGrid from './expandable-grid';

export default function LinkAccountFlow() {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLinkSuccess, setIsLinkSuccess] = useState(false);

  // Success message when link is created
  if (isLinkSuccess) {
    return (
        <div className={styles.gridContent}>
          <div className={styles.successMessage}>
            Accounts successfully linked
          </div>
        </div>
    );
  }

  return (
    <ExpandableGrid externalTitle='Copy and post the code below on both X and Bluesky'>
      {!isLinkSuccess ? (
        <>
          <div className={styles.copyCodeContainer}>
            <CopyCode 
              setVerificationCode={setVerificationCode} 
              verificationCode={verificationCode} 
            />
          </div>

          <PostForm 
            verificationCode={verificationCode}
            onLinkSuccess={() => setIsLinkSuccess(true)}
          />
        </>
      ) : (
        <div className={styles.successMessage}>
          Accounts successfully linked
        </div>
      )}
    </ExpandableGrid>
  );
}
