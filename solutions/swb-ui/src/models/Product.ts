export interface ProductsTableFilter {
  paginationToken?: string;
  paginationTokens: Map<number, string>;
  hasOpenEndPagination: boolean;
  pageCount: number;
  currentPageIndex: number;
}
