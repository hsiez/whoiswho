'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import styles from './copy-code.module.css';

interface CopyCodeProps {
  setVerificationCode: (code: string) => void;
  verificationCode: string;
}

export default function CopyCode({ setVerificationCode, verificationCode }: CopyCodeProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setVerificationCode(crypto.randomUUID());
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(verificationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={styles.container}>
      <code className={styles.code}>{verificationCode}</code>
      <button
        onClick={copyToClipboard}
        className={styles.button}
        title="Copy to clipboard"
      >
        {copied ? (
          <CheckIcon className={styles.iconSuccess} />
        ) : (
          <ClipboardIcon className={styles.icon} />
        )}
      </button>
    </div>
  );
}
