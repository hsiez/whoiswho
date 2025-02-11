'use client';

import { useState } from 'react';
import formStyles from './form.module.css';
import CopyCode from '../copy-code';
import Form from '../form';

export default function LinkAccountsFlow({ initialPoem }: { initialPoem: string }) {
    const [isCopied, setIsCopied] = useState(false);

    return (
        <>  
            {!isCopied ? 
                <div className={`${formStyles.codeTitle} ${isCopied ? formStyles.hidden : ''}`}>
                    <h2>Copy and post this poem from your Bluesky and X account</h2>
                    <p>Posting this poem proves you have access to the accounts. You can delete the post after the linking process is complete.</p>
                </div>
            :
                null
            }
            <div className={formStyles.topContainer}>
                <CopyCode 
                    setIsCopied={setIsCopied} 
                    isCopied={isCopied} 
                    poem={initialPoem} 
                />
                <Form isCopied={isCopied} setIsCopied={setIsCopied} poem={initialPoem} />
            </div>
        </>
    );
}
