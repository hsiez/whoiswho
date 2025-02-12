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
                    <h1 style={{textAlign: 'center'}}> Link your Bluesky and X account</h1>
                    <p style={{fontSize: "16px", marginTop: "8px", textAlign: 'center'}}>Post this poem from the profiles you want to map together in the whoiswho registry.</p>
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
