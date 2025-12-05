import { useState } from 'react';

export interface UseCartModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export const useCartModal = (): UseCartModalReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};
