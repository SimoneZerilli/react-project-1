import { useState, useCallback, useRef } from 'react';

interface UseRovingTabindexOptions {
  itemCount: number;
  initialIndex?: number;
  loop?: boolean;
  onSelectCurrent?: (index: number) => void;
}

export function useRovingTabindex({
  itemCount,
  initialIndex = 0,
  loop = true,
  onSelectCurrent,
}: UseRovingTabindexOptions) {
  const [focusedIndex, setFocusedIndex] = useState<number>(initialIndex);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // Registra il riferimento DOM di ciascun elemento per spostare il focus esplicitamente
  const setItemRef = useCallback((index: number) => (el: HTMLElement | null) => {
    itemRefs.current[index] = el;
  }, []);

  const focusItem = useCallback((index: number) => {
    if (itemCount === 0) return;
    let targetIndex = index;
    if (loop) {
      targetIndex = (index + itemCount) % itemCount;
    } else {
      targetIndex = Math.max(0, Math.min(index, itemCount - 1));
    }
    setFocusedIndex(targetIndex);
    // Sposta il focus sul nodo DOM corrispondente
    const targetEl = itemRefs.current[targetIndex];
    if (targetEl) {
      targetEl.focus();
    }
  }, [itemCount, loop]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (itemCount === 0) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        e.preventDefault();
        focusItem(focusedIndex + 1);
        break;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        e.preventDefault();
        focusItem(focusedIndex - 1);
        break;
      }
      case 'Home': {
        e.preventDefault();
        focusItem(0);
        break;
      }
      case 'End': {
        e.preventDefault();
        focusItem(itemCount - 1);
        break;
      }
      case ' ': {
        // Selezione con Spazio
        e.preventDefault();
        onSelectCurrent?.(focusedIndex);
        break;
      }
      default:
        break;
    }
  }, [focusedIndex, focusItem, itemCount, onSelectCurrent]);

  return {
    focusedIndex,
    setFocusedIndex,
    focusItem,
    setItemRef,
    handleKeyDown,
  };
}

