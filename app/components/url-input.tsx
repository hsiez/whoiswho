'use client';

import { ChangeEvent, useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import styles from './url-input.module.css';

type UrlInputProps = {
  site: string;
  placeholder: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function UrlInput({ site, placeholder, onChange, error }: UrlInputProps) {
  const [url, setUrl] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setUrl(event.target.value);
    onChange(event.target.value);
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          type="url"
          value={url}
          onChange={handleChange}
          placeholder={placeholder}
          className={styles.input}
        />
        <div className={styles.iconContainer}>
          {error && (
            <ExclamationTriangleIcon className={styles.errorIcon} />
          )}
        </div>
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
