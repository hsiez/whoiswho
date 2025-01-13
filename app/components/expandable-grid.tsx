'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Image from 'next/image';
import styles from './expandable-grid.module.css';

interface ExpandableGridContextValue {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  externalTitle?: string;
}

const ExpandableGridContext = createContext<ExpandableGridContextValue | undefined>(undefined);

interface ExpandableGridProps {
  children: ReactNode;
  onCopy?: () => void;
  externalTitle?: string;
}

export default function ExpandableGrid({ children, externalTitle }: ExpandableGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ExpandableGridContext.Provider value={{ isExpanded, setIsExpanded }}>
        <div className={styles.gridTitleContainer}>
          <p className={styles.gridTitle}>
            {isExpanded ? '' : externalTitle}
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
