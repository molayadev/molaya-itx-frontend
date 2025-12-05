import React, { useState } from 'react';
import { Input } from '@shared/ui/components';
import { validateSearchQuery } from '../../validators/searchValidator';
import styles from './SearchBar.module.css';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isSearching?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by brand and model...',
  isSearching = false,
}) => {
  const [error, setError] = useState<string | undefined>();

  const handleChange = (newValue: string) => {
    const validation = validateSearchQuery(newValue);
    
    if (!validation.isValid) {
      setError(validation.error);
    } else {
      setError(undefined);
    }
    
    onChange(newValue);
  };

  return (
    <div className={styles.container}>
      <Input
        id="product-search"
        name="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        error={error}
        fullWidth
        type="text"
      />
      {isSearching && (
        <span className={styles.searchingIndicator}>Buscando...</span>
      )}
    </div>
  );
};
