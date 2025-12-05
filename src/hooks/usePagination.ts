import { useMemo, useState } from "react";

export const usePagination = (initialPage = 1, initialPageSize = 12) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const pagination = useMemo(() => ({
    currentPage,
    pageSize,
    offset: (currentPage - 1) * pageSize,
  }), [currentPage, pageSize]);

  return { 
    ...pagination, 
    setPage: (page: number) => setCurrentPage(page),
    setPageSize 
  };
};
