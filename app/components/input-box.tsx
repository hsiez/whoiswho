import { ChangeEvent } from 'react';
import styles from './input-box.module.css';

interface InputBoxProps {
  input: string;
  setInput: (value: string) => void;
  error?: string;
  platform: 'bluesky' | 'x';
}

const InputBox = ({ input, setInput, error, platform }: InputBoxProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.inputBackdrop} ${error ? styles.hasError : ''}`}>
        <input
          type="url"
          value={input}
          onChange={handleChange}
          placeholder={platform === 'bluesky' ? 'https://bsky.app/...' : 'https://x.com/...'}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
        />
      </div>
      <div className={styles.errorMessage}>{error || '\u00A0'}</div>
    </div>
  );
};

export default InputBox;