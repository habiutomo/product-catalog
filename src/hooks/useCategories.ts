import { useAppSelector } from '../redux/hooks';
import { useMemo } from 'react';

export const useCategories = () => {
  const { categories, selectedCategory } = useAppSelector(
    (state) => state.products,
  );

  // Add 'all' category and ensure it's at the beginning of the array
  const allCategories = useMemo(() => {
    return ['all', ...categories];
  }, [categories]);

  return {
    categories: allCategories,
    selectedCategory,
  };
};