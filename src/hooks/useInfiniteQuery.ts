import { useEffect } from 'react';

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  triggerRef,
  rootRef
}: {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  rootRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
}) => {
  useEffect(() => {
    if (!triggerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: rootRef?.current ?? null, threshold: 0.9 }
    );

    observer.observe(triggerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
};
