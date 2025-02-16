'use client';
import { useState } from 'react';
import styles from './copy-code.module.css';

interface CopyCodeProps {
    poem: string;
}

export default function CopyCode({ poem }: CopyCodeProps) {
    const [copyMessage, setCopyMessage] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(poem);
            setCopyMessage(true);
            setTimeout(() => setCopyMessage(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className={styles.copyCodeContainer} onClick={handleCopy}>
            <div className={styles.codeContainer}>
                <p className={styles.code}>{poem}</p>
                <div className={styles.overlay}>
                    <span>{copyMessage ? 'Copied!' : 'Copy'}</span>
                </div>
            </div>
        </div>
    );
}