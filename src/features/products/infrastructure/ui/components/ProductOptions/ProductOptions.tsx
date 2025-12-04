import React from 'react';
import { RadioGroup } from '@shared/ui/components';
import type { RadioOption } from '@shared/ui/components';
import styles from './ProductOptions.module.css';

export interface ProductOptionsProps {
  colors: Array<{ code: number; name: string }>;
  storages: Array<{ code: number; name: string }>;
  selectedColorCode: number | null;
  selectedStorageCode: number | null;
  onColorChange: (code: number) => void;
  onStorageChange: (code: number) => void;
  disabled?: boolean;
}

export const ProductOptions: React.FC<ProductOptionsProps> = ({
  colors,
  storages,
  selectedColorCode,
  selectedStorageCode,
  onColorChange,
  onStorageChange,
  disabled = false,
}) => {
  const colorOptions: RadioOption[] = colors.map((color) => ({
    value: color.code,
    label: color.name,
  }));

  const storageOptions: RadioOption[] = storages.map((storage) => ({
    value: storage.code,
    label: storage.name,
  }));

  const handleColorChange = (value: string | number) => {
    onColorChange(Number(value));
  };

  const handleStorageChange = (value: string | number) => {
    onStorageChange(Number(value));
  };

  return (
    <div className={styles.container}>
      {colors.length > 1 && (
        <RadioGroup
          name="product-color"
          label="Color"
          options={colorOptions}
          value={selectedColorCode}
          onChange={handleColorChange}
          disabled={disabled}
          layout="horizontal"
        />
      )}

      {storages.length > 1 && (
        <RadioGroup
          name="product-storage"
          label="Storage"
          options={storageOptions}
          value={selectedStorageCode}
          onChange={handleStorageChange}
          disabled={disabled}
          layout="horizontal"
        />
      )}
    </div>
  );
};
