'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Image from 'next/image';
import styles from './expandable-grid.module.css';

interface ExpandableGridContextValue {
  isExpanded: boolean;
}

const ExpandableGridContext = createContext<ExpandableGridContextValue | undefined>(undefined);

interface ExpandableGridProps {
  children: ReactNode;
  onCopy?: () => void;
}

export default function ExpandableGrid({ children }: ExpandableGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ExpandableGridContext.Provider value={{ isExpanded }}>
      <div className={styles.gridTitleContainer}>
        <p className={styles.gridTitle}>
          {isExpanded ? '' : 'Post the code below from both X and Bluesky'}
        </p>
      </div>
      <div className={`${styles.gridContainer} ${isExpanded ? styles.expanded : ''}`}>
        <div 
          className={styles.gridContent}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          {children}
        </div>
        {isExpanded && (
        <>
          <button 
            className={styles.minimizeButton}
            onClick={() => setIsExpanded(false)}
            aria-label="Minimize grid"
          >
            <Image
              src="/arrow-left.svg"
              alt="Minimize"
              width={24}
              height={24}
            />
          </button>
          <div className={styles.gridTitleExpandedContainer}>
            <p className={styles.gridTitle}>
              Provide the urls of the posts
            </p>
          </div>
        </>
        )}
      </div>
    </ExpandableGridContext.Provider>
  );
}

// Custom hook to use the ExpandableGrid context
export const useExpandableGrid = () => {
  const context = useContext(ExpandableGridContext);
  if (!context) {
    throw new Error('useExpandableGrid must be used within an ExpandableGrid');
  }
  return context;
};
