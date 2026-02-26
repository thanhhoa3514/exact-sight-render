import { useState, useEffect, useCallback } from 'react';

export function useDetailPanel<T>(items: T[]) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const openPanel = useCallback((item: T, index: number) => {
    setSelectedItem(item);
    setSelectedIndex(index);
    setIsOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedItem(null);
      setSelectedIndex(-1);
    }, 300);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        closePanel();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = Math.min(selectedIndex + 1, items.length - 1);
        setSelectedIndex(next);
        setSelectedItem(items[next]);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = Math.max(selectedIndex - 1, 0);
        setSelectedIndex(prev);
        setSelectedItem(items[prev]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, selectedIndex, items, closePanel]);

  return { selectedItem, selectedIndex, isOpen, openPanel, closePanel };
}
