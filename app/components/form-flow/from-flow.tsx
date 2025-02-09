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
                    <h4>Copy and post this poem to your Bluesky and X accounts</h4>
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
