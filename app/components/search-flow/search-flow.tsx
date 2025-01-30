'use client'

import { useState } from 'react'
import styles from './search-flow.module.css'
import Image from 'next/image'
import { findLinkedAccount } from '@/app/utils/database'

interface SearchResult {
  bluesky: string
  x: string
}

export default function SearchFlow() {
  const [blueskyQuery, setBlueskyQuery] = useState('')
  const [xQuery, setXQuery] = useState('')
  const [result, setResult] = useState<SearchResult | null>(null)
  const [isEditingBluesky, setIsEditingBluesky] = useState(false)
  const [isEditingX, setIsEditingX] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState<{platform: string, query: string} | null>(null)
  
  const handleBlueskySearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setNotFound(null)
    
    try {
      const linkedXUsername = await findLinkedAccount(blueskyQuery, 'bs')
      
      if (linkedXUsername) {
        setResult({
          bluesky: blueskyQuery,
          x: linkedXUsername
        })
        setBlueskyQuery('')
        setIsEditingBluesky(false)
        setIsEditingX(false)
      } else {
        setNotFound({ platform: 'X', query: blueskyQuery })
      }
    } catch (err) {
      console.error('Error searching username:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleXSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setNotFound(null)
    
    try {
      const linkedBlueskyUsername = await findLinkedAccount(xQuery, 'x')
      
      if (linkedBlueskyUsername) {
        setResult({
          bluesky: linkedBlueskyUsername,
          x: xQuery
        })
        setXQuery('')
        setIsEditingBluesky(false)
        setIsEditingX(false)
      } else {
        setNotFound({ platform: 'bluesky', query: xQuery })
      }
    } catch (err) {
      console.error('Error searching username:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlueskyFocus = () => {
    if (result) {
      setBlueskyQuery(result.bluesky)
      setIsEditingBluesky(true)
      setResult(null)
    }
    setXQuery('')
    setNotFound(null)
  }

  const handleXFocus = () => {
    if (result) {
      setXQuery(result.x)
      setIsEditingX(true)
      setResult(null)
    }
    setBlueskyQuery('')
    setNotFound(null)
  }

  const handleBlueskyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all spaces from input
    const noSpaces = e.target.value.replace(/\s/g, '')
    setBlueskyQuery(noSpaces)
    setResult(null)
    setNotFound(null)
  }

  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all spaces from input
    const noSpaces = e.target.value.replace(/\s/g, '')
    setXQuery(noSpaces)
    setResult(null)
    setNotFound(null)
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputsWrapper}>
        <div className={styles.inputWrapper}>
          <form onSubmit={handleBlueskySearch} className={styles.searchForm}>
            <div className={styles.inputContainer}>
              <Image 
                src="/bluesky.svg" 
                alt="Bluesky" 
                width={16} 
                height={16} 
                className={`${styles.inputIcon} ${isLoading ? styles.loading : ''}`} 
              />
              <input
                type="text"
                value={result?.bluesky || blueskyQuery}
                onChange={handleBlueskyChange}
                onClick={handleBlueskyFocus}
                onFocus={handleBlueskyFocus}
                placeholder="Search Bluesky username"
                className={`${styles.searchInput} ${styles.blueskyInput} ${result?.x && !isEditingBluesky ? styles.resultInput : ''}`}
                disabled={isLoading}
                readOnly={result?.x !== undefined && !isEditingBluesky}
              />
            </div>
          </form>
          <div className={styles.notFoundMessage}>
            {notFound?.platform === 'X' ? `No X username is associated with ${notFound.query}` : '\u00A0'}
          </div>
        </div>

        <div className={styles.inputWrapper}>
          <form onSubmit={handleXSearch} className={styles.searchForm}>
            <div className={styles.inputContainer}>
              <Image 
                src="/x.svg" 
                alt="X" 
                width={16} 
                height={16} 
                className={`${styles.inputIcon} ${isLoading ? styles.loading : ''}`} 
              />
              <input
                type="text"
                value={result?.x || xQuery}
                onChange={handleXChange}
                onClick={handleXFocus}
                onFocus={handleXFocus}
                placeholder="Search X username"
                className={`${styles.searchInput} ${styles.xInput} ${result?.bluesky && !isEditingX ? styles.resultInput : ''}`}
                disabled={isLoading}
                readOnly={result?.bluesky !== undefined && !isEditingX}
              />
            </div>
          </form>
          <div className={styles.notFoundMessage}>
            {notFound?.platform === 'bluesky' ? `No bluesky username is associated with ${notFound.query}` : '\u00A0'}
          </div>
        </div>
      </div>
    </div>
  )
} 