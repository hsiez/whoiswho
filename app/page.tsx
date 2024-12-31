'use client';

import Image from "next/image";
import styles from "./page.module.css";
import UrlInput from "./components/url-input";
import CopyCode from "./components/copy-code";
import PrimaryButton from "./components/buttons/primary";
import { checkPostBluesky } from "./utils/bluesky-search";
import { checkPostX } from "./utils/x-search";
import { useState } from "react";
import { createLink } from './utils/database';

export default function Home() {
  const [blueskyUrl, setBlueskyUrl] = useState('');
  const [xUrl, setXUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [blueskyError, setBlueskyError] = useState('');
  const [xError, setXError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = async () => {
    try {
      // Reset errors and set loading
      setBlueskyError('');
      setXError('');
      setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.usernameBoxContainer}>
          <UrlInput 
            site="bluesky" 
            placeholder="https://bsky.app/post/url" 
            onChange={setBlueskyUrl}
            error={blueskyError}
          />
          <UrlInput 
            site="x" 
            placeholder="https://x.com/post/url" 
            onChange={setXUrl}
            error={xError}
          />
        </div>
        <div className={styles.copyCodeContainer}>
          <CopyCode setVerificationCode={setVerificationCode} verificationCode={verificationCode} />
        </div>
        <div className={styles.buttonContainer} onClick={handleButtonClick}>
          <PrimaryButton text="Link" />
        </div>
      </main>
    </div>
  );
}
