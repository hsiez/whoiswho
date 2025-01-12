'use client';

import { ChangeEvent, useState } from 'react';
import styles from './url-input.module.css';

type UrlInputProps = {
  placeholder: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export default function UrlInput({ placeholder, onChange, error }: UrlInputProps) {
  const [url, setUrl] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setUrl(event.target.value);
    onChange(event.target.value);
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.inputWrapper} ${error ? styles.error : ''}`}>
        <input
          type="url"
          value={url}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${styles.input} ${error ? styles.error : ''}`}
        />
      </div>
      {error && 
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
      </div>
      }
    </div>
  );
}
