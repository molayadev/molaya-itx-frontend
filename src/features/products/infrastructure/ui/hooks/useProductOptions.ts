import { useState, useMemo } from 'react';

interface UseProductOptionsParams {
  colors: Array<{ code: number; name: string }>;
  storages: Array<{ code: number; name: string }>;
}

export const useProductOptions = ({ colors, storages }: UseProductOptionsParams) => {
  const defaultColorCode = useMemo(() => {
    return colors.length === 1 ? colors[0].code : null;
  }, [colors]);

  const defaultStorageCode = useMemo(() => {
    return storages.length === 1 ? storages[0].code : null;
  }, [storages]);

  const [selectedColorCode, setSelectedColorCode] = useState<number | null>(defaultColorCode);
  const [selectedStorageCode, setSelectedStorageCode] = useState<number | null>(defaultStorageCode);

  const isSelectionComplete = selectedColorCode !== null && selectedStorageCode !== null;

  return {
    selectedColorCode,
    selectedStorageCode,
    setSelectedColorCode,
    setSelectedStorageCode,
    isSelectionComplete,
  };
};
