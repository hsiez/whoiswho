import { useState } from 'react';
import styles from './form.module.css';
import InputBox from './input-box';
import { checkPostBluesky } from '../utils/bluesky-search';
import { checkPostX } from '../utils/x-search';
import { createLink } from '../utils/database';


function getBlueskyId(url: string): string {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // The profile part will be at index 2 after splitting '/profile/username/post/id'
    return pathParts[2];
}

function getXId(url: string): string {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // The username is at index 1 after splitting '/username/status/id'
    return pathParts[1];
}


export default function Form({setSubmitted, poem}: {setSubmitted: (submitted: boolean) => void, poem: string}) {
    const [loading, setLoading] = useState(false);
    const [blueskyUrl, setBlueskyUrl] = useState('');
    const [twitterUrl, setTwitterUrl] = useState('');
    const [blueskyUrlError, setBlueskyUrlError] = useState('');
    const [twitterUrlError, setTwitterUrlError] = useState('');

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const isCorrectPlatform = (url: string, platform: 'bluesky' | 'x'): boolean => {
        const domain = new URL(url).hostname;
        return platform === 'bluesky' ? 
            domain.includes('bsky.app') : 
            domain.includes('twitter.com') || domain.includes('x.com');
    };

    const handleSubmit = async () => {
        // Reset errors
        setBlueskyUrlError('');
        setTwitterUrlError('');
        let hasError = false;

        // Validate Bluesky URL
        if (!isValidUrl(blueskyUrl)) {
            setBlueskyUrlError('Please enter a valid URL');
            hasError = true;
        } else if (!isCorrectPlatform(blueskyUrl, 'bluesky')) {
            setBlueskyUrlError('Please enter a Bluesky URL');
            hasError = true;
        }

        // Validate X URL
        if (!isValidUrl(twitterUrl)) {
            setTwitterUrlError('Please enter a valid URL');
            hasError = true;
        } else if (!isCorrectPlatform(twitterUrl, 'x')) {
            setTwitterUrlError('Please enter an X URL');
            hasError = true;
        }

        if (hasError) return;

        // Set loading state
        setLoading(true);

        try {
            // Check for code in posts
            const [blueskyVerified, xVerified] = await Promise.all([
                checkPostBluesky(blueskyUrl, poem),
                checkPostX(twitterUrl, poem)
            ]);
            
            if (!blueskyVerified) {
                setBlueskyUrlError('Code not found in post');
                hasError = true;
            }
            if (!xVerified) {
                setTwitterUrlError('Code not found in post');
                hasError = true;
            }

            if (!hasError) {
                try {
                    const bsId = getBlueskyId(blueskyUrl);
                    const xId = getXId(twitterUrl);
                    await createLink(bsId, xId);
                } catch (error) {
                    console.error('Error creating link:', error);
                }
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Error verifying posts:', error);
            setBlueskyUrlError('Error verifying post');
            setTwitterUrlError('Error verifying post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{flex: 1, height: '100%', width: '100%', overflow: 'hidden'}}>
            <div className={styles.form}>
                { !loading ? 
                    <>
                    <div className={styles.inputs}>
                        <InputBox input={blueskyUrl} setInput={setBlueskyUrl} error={blueskyUrlError} platform='bluesky'/>
                        <InputBox input={twitterUrl} setInput={setTwitterUrl} error={twitterUrlError} platform='x'/>
                    </div>
                    <div className={styles.buttonsContainer}>
                        <button 
                            className={styles.button} 
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            Submit
                        </button>
                        </div>
                    </>
                :
                    <div className={styles.loading}>
                        <p>Gimme a sec, I&apos;m not using the X API</p>
                        <span className={styles.spinner}></span>
                    </div>
                }
            </div>
        </div>
    );
}