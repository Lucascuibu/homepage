import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export function useInfiniteScroll(items: string[], pageSize = 10) {
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const { ref, inView } = useInView({
    triggerOnce: false,
  });

  useEffect(() => {
    setVisibleItems(items.slice(0, page * pageSize));
  }, [items, page, pageSize]);

  useEffect(() => {
    if (inView && items.length > visibleItems.length) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, items.length, visibleItems.length]);

  return { visibleItems, ref };
}