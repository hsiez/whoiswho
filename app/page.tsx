'use client';

import styles from "./page.module.css";
import CopyCode from "./components/copy-code";
import { useState } from "react";
import ExpandableGrid from './components/expandable-grid';
import PostForm from './components/post-form';



export default function Home() {
  const [verificationCode, setVerificationCode] = useState('');

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        
        <ExpandableGrid>
          <div className={styles.copyCodeContainer}>
            <CopyCode setVerificationCode={setVerificationCode} verificationCode={verificationCode} />
          </div>
          <PostForm
            verificationCode={verificationCode}
          />
        </ExpandableGrid>
      </main>
    </div>
  );
}
