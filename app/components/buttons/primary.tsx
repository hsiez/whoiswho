'use client';

import { useState } from 'react';
import styles from './primary.module.css';

interface PrimaryButtonProps {
  text?: string;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const PrimaryButton = ({
  text = 'Link',
  onClick,
  isLoading = false,
  disabled = false,
  className = '',
}: PrimaryButtonProps) => {
  const [loading, setLoading] = useState(isLoading);

  const handleClick = async () => {
    try {
      setLoading(true);
      if (onClick) {
        await onClick();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`${styles.button} ${loading ? styles.loading : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className={styles.loadingWrapper}>
          <svg
            className={styles.spinner}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className={styles.spinnerCircle}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className={styles.spinnerPath}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        text
      )}
    </button>
  );
};

export default PrimaryButton;
