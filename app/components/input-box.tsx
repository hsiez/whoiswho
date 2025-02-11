import { ChangeEvent } from 'react';
import styles from './input-box.module.css';
import Image from 'next/image';

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
      <div className={styles.inputContainer}>
        <div className={`${styles.iconContainer} ${platform === 'bluesky' ? styles.blueskyIconContainer : styles.xIconContainer}`}>
          <Image 
            src={platform === 'bluesky' ? "/bluesky.svg" : "/x.svg"} 
            alt={platform === 'bluesky' ? "Bluesky" : "X"} 
            width={20} 
            height={20} 
            className={`${styles.inputIcon} ${platform === 'bluesky' ? styles.blueskyInputIcon : styles.xInputIcon}`}
          />
        </div>
        <input
          type="url"
          value={input}
          onChange={handleChange}
          placeholder={platform === 'bluesky' ? 'https://bsky/post/url' : 'https://x/post/url'}
          className={`${styles.input} ${platform === 'bluesky' ? styles.blueskyInput : styles.xInput}`}
        />
      </div>
      <div className={styles.errorMessage}>{error || '\u00A0'}</div>
    </div>
  );
};

export default InputBox;