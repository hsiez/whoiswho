'use client';

import { useState } from 'react';
import formStyles from './form.module.css';
import CopyCode from '../copy-code';
import Form from '../form';
export default function LinkAccountsFlow() {
    const [code, setCode] = useState('960827f9-ae11-44f2-bfc4-fc6b0cdbd490');
    const [isCopied, setIsCopied] = useState(false);

    return (
        <>  
            {!isCopied ? 
                <div className={`${formStyles.codeTitle} ${isCopied ? formStyles.hidden : ''}`}>
                    <h4>Copy and post this code to your Bluesky and X accounts</h4>
                </div>
            :
                null
            }
            <div className={formStyles.topContainer}>
                <CopyCode code={code} setIsCopied={setIsCopied} isCopied={isCopied}/>
                <Form isCopied={isCopied} setIsCopied={setIsCopied} code={code} />
            </div>
        </>
    );
}
