import React, { useEffect, useRef } from 'react';
import styles from './InfiniteScrollTrigger.module.css';

export interface InfiniteScrollTriggerProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
  threshold?: number;
}

export const InfiniteScrollTrigger: React.FC<InfiniteScrollTriggerProps> = ({
  onLoadMore,
  hasMore,
  isLoading = false,
  loadingMessage = 'Cargando más...',
  threshold = 0.5,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentTrigger = triggerRef.current;
    if (!currentTrigger || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin: '100px',
      }
    );

    observer.observe(currentTrigger);

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [onLoadMore, hasMore, isLoading, threshold]);

  if (!hasMore) {
    return null;
  }

  return (
    <div ref={triggerRef} className={styles.trigger}>
      {isLoading && (
        <div className={styles.loading}>
          <span className={styles.spinner}></span>
          <p>{loadingMessage}</p>
        </div>
      )}
    </div>
  );
};
