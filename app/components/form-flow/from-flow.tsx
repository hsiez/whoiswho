'use client';

import { useState } from 'react';
import formStyles from './form.module.css';
import CopyCode from '../copy-code';
import Form from '../form';

export default function LinkAccountsFlow({ initialPoem }: { initialPoem: string }) {
    const [submitted, setSubmitted] = useState(false);
    const [isPoemExpanded, setIsPoemExpanded] = useState(true);
    const [isFormExpanded, setIsFormExpanded] = useState(false);
    const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);

    return ( 
        <div className={`${formStyles.topContainer}`}>
            {
                submitted ?
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'}}>
                    <p style={{fontSize: '20px', fontWeight: '500'}}>Accounts linked ✅</p>
                </div>
                :
                <>
                    <section className={formStyles.poemAccordion}>
                                <h3 className={formStyles.accordionTitle}>
                                    <button className={formStyles.accordionButton} onClick={() => setIsPoemExpanded(!isPoemExpanded)}>
                                        <p className={formStyles.accordionNumber}>
                                            1
                                        </p>
                                        <p style={{flex: 1, fontSize: "1rem", fontWeight: "500"}}>
                                            Copy the poem
                                        </p>
                                    </button>
                        </h3>
                        <div className={`${formStyles.accordionContent} ${isPoemExpanded ? formStyles.expanded : ''}`}>
                            <CopyCode 
                                poem={initialPoem} 
                            />
                        </div>
                    </section>

                    <section className={formStyles.poemAccordion}>
                        <h3 className={formStyles.accordionTitle}>
                            <button className={formStyles.accordionButton} onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}>
                                <p className={formStyles.accordionNumber}>
                                    2
                                </p>
                                <p style={{flex: 1, fontSize: "1rem", fontWeight: "500"}}>
                                    Post Poem
                                </p>
                            </button>
                        </h3>
                        <div className={`${formStyles.accordionContent} ${isExplanationExpanded ? formStyles.expanded : ''}`}>
                            <div style={{overflow: "hidden", paddingLeft: "16px"}}>
                                <p style={{padding: "16px", fontSize: "20px"}}>
                                    Post the poem from both Bluesky and X accounts. <br/> <br/>
                                    This task proves that you have access to both accounts. <br/>
                                    Once access is verified, the accounts will be linked in the WhoisWho registry. <br/> <br/>
                                    You may delete the post after the verification is complete.
                                </p>
                            </div>
                        </div>
                    </section>
                    
                    <section className={formStyles.poemAccordion}>
                        <h3 className={formStyles.accordionTitle}>
                            <button className={formStyles.accordionButton} onClick={() => setIsFormExpanded(!isFormExpanded)}>
                                <p className={formStyles.accordionNumber}>
                                    3
                                </p>
                                <p style={{flex: 1, fontSize: "1rem", fontWeight: "500"}}>
                                    Submit your post links
                                </p>
                            </button>
                        </h3>
                        <div className={`${formStyles.accordionContent} ${isFormExpanded ? formStyles.expanded : ''}`}>
                            <Form submitted={submitted} setSubmitted={setSubmitted} poem={initialPoem} />
                        </div>
                    </section>
                </>
            }
        </div>

    );
}
