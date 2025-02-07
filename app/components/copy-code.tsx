'use client';
import { useState, useEffect } from 'react';
import styles from './copy-code.module.css';

interface CopyCodeProps {
    code?: string;
    setIsCopied: (isCopied: boolean) => void;
    isCopied: boolean;
}

export default function CopyCode({ code = '550e8400-e29b-41d4-a716-446655440000', setIsCopied, isCopied }: CopyCodeProps) {
    const [copyMessage, setCopyMessage] = useState(false);
    const [poem, setPoem] = useState('');

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

    useEffect(() => {
        const fetchPoem = async () => {
            const response = await fetch(
                '/api/poem'
            );
            const data = await response.json();
            setPoem(data.poem);
        };
        fetchPoem();
    }, []);

    return (
        <div onClick={handleCopy}>
            { !isCopied ? 
            <div className={styles.codeContainer}>
                <p className={styles.code}>{poem}</p>
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