'use client';

import { useState } from 'react';
import formStyles from './form-flow-bento.module.css';
import CopyCode from '../copy-code';
import InputBox from '../input-box';
import { checkPostBluesky } from '../../utils/bluesky-search';
import { checkPostX } from '../../utils/x-search';
import { createLink } from '../../utils/database';

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

export default function LinkAccountsFlow({ initialPoem }: { initialPoem: string }) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [blueskyUrl, setBlueskyUrl] = useState('');
    const [xUrl, setXUrl] = useState('');
    const [blueskyUrlError, setBlueskyUrlError] = useState('');
    const [xUrlError, setXUrlError] = useState('');

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
        setXUrlError('');
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
        if (!isValidUrl(xUrl)) {
            setXUrlError('Please enter a valid URL');
            hasError = true;
        } else if (!isCorrectPlatform(xUrl, 'x')) {
            setXUrlError('Please enter an X URL');
            hasError = true;
        }

        if (hasError) return;

        // Set loading state
        setLoading(true);

        try {
            // Check for code in posts
            const [blueskyVerified, xVerified] = await Promise.all([
                checkPostBluesky(blueskyUrl, initialPoem),
                checkPostX(xUrl, initialPoem)
            ]);
            
            if (!blueskyVerified) {
                setBlueskyUrlError('Code not found in post');
                hasError = true;
            }
            if (!xVerified) {
                setXUrlError('Code not found in post');
                hasError = true;
            }

            if (!hasError) {
                try {
                    const bsId = getBlueskyId(blueskyUrl);
                    const xId = getXId(xUrl);
                    await createLink(bsId, xId);
                } catch (error) {
                    console.error('Error creating link:', error);
                }
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Error verifying posts:', error);
            setBlueskyUrlError('Error verifying post');
            setXUrlError('Error verifying post');
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div className={`${formStyles.topContainer}`}>
            <header className={formStyles.header}>
                <h1>
                    Link your Bluesky and X accounts
                </h1>

                <p>
                    Prove your identity by posting a unique poem to each platform. Once posted, your Bluesky and X account will be linked in the whoiswho registry.
                </p>
            </header>

            <div className={`${formStyles.bentoGrid} ${submitted ? formStyles.submitted : ''}`}>
                {submitted ? 
                    <div className={formStyles.submitted}>
                        <h2>Accounts linked! 🫡 </h2>
                    </div>
                :
                    <>
                        <section className={formStyles.poem}>
                                    <div className={formStyles.ItemTitle}>
                                        <p>1</p>
                                <p>Copy Poem</p>
                            </div>
                            <CopyCode 
                                poem={initialPoem} 
                            />
                        </section>
                                
                        <section className={formStyles.formBluesky}>
                            <div className={formStyles.ItemTitle}>
                                <p>2</p>
                                <p>Post poem to Bluesky</p>
                            </div>

                            <div className={formStyles.inputContainer}>
                                <InputBox input={blueskyUrl} setInput={setBlueskyUrl} error={blueskyUrlError} platform='bluesky'/>
                            </div>
                        </section>

                        <section className={formStyles.formX}>
                            <div className={formStyles.ItemTitle}>
                                <p>3</p>
                                <p>Post poem to X</p>
                            </div>

                            <div className={formStyles.inputContainer}>
                                <InputBox input={xUrl} setInput={setXUrl} error={xUrlError} platform='x'/>
                            </div>
                        </section>

                        <section className={formStyles.submitButtonContainer}>
                            {loading ? 
                                <div className={formStyles.loading}>
                                    <p>Gimme a sec, not paying for x api</p>
                                    <div className={formStyles.spinner}></div>
                                </div>
                            :
                                <button className={formStyles.submitButton} onClick={handleSubmit}>
                                    Submit
                                </button>
                            }
                        </section>
                    </>
}
            </div>
            
        </div>
    );
}