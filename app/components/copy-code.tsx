'use client';

import { useState, useEffect } from 'react';
import styles from './copy-code.module.css';
import { useExpandableGrid } from './expandable-grid';

interface CopyCodeProps {
  setVerificationCode: (code: string) => void;
  verificationCode: string;
}

export default function CopyCode({ 
  setVerificationCode, 
  verificationCode,
}: CopyCodeProps) {
  const [copied, setCopied] = useState(false);
  const { isExpanded } = useExpandableGrid();

  useEffect(() => {
    setVerificationCode(crypto.randomUUID());
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(verificationCode);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (isExpanded) return null;

  return (
    <div className={styles.container}>
      <button 
        onClick={copyToClipboard}
        className={styles.code}
        data-copied={copied ? '' : undefined}
      >
        <span>{verificationCode}</span>
      </button>
    </div>
  );
}
