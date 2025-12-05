import { useState, useEffect } from 'react';

interface UseProductOptionsParams {
  colors: Array<{ code: number; name: string }>;
  storages: Array<{ code: number; name: string }>;
}

export const useProductOptions = ({ colors, storages }: UseProductOptionsParams) => {
  const defaultColorCode = colors.length > 0 ? colors[0].code : null;
  const defaultStorageCode = storages.length > 0 ? storages[0].code : null;

  const [selectedColorCode, setSelectedColorCode] = useState<number | null>(defaultColorCode);
  const [selectedStorageCode, setSelectedStorageCode] = useState<number | null>(defaultStorageCode);
  const getSelectedColorName = (code: number | null) => {
    const color = colors.find((c) => c.code === code);
    return color ? color.name : '';
  }
  const getSelectedStorageName = (code: number | null) => {
    const storage = storages.find((s) => s.code === code);
    return storage ? storage.name : '';
  }
  
  useEffect(() => {
    setSelectedColorCode(defaultColorCode);
  }, [defaultColorCode]);

  useEffect(() => {
    setSelectedStorageCode(defaultStorageCode);
  }, [defaultStorageCode]);


  return {
    selectedColorCode,
    selectedStorageCode,
    setSelectedColorCode,
    setSelectedStorageCode,
    getSelectedColorName,
    getSelectedStorageName,
  };
};
