'use client';
import { useState } from 'react';
import styles from './copy-code.module.css';

interface CopyCodeProps {
    code?: string;
    setIsCopied: (isCopied: boolean) => void;
    isCopied: boolean;
}

export default function CopyCode({ code = '550e8400-e29b-41d4-a716-446655440000', setIsCopied, isCopied }: CopyCodeProps) {
    const [copyMessage, setCopyMessage] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            setCopyMessage(true);
            setTimeout(() => setCopyMessage(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div onClick={handleCopy}>
            { !isCopied ? 
            <div className={styles.codeContainer}>
                <code className={styles.code}>{code}</code>
                <div className={styles.overlay}>
                    <span>{copyMessage ? 'Copied!' : 'Copy'}</span>
                </div>
            </div>
            :
            null
            }
        </div>
    );
}