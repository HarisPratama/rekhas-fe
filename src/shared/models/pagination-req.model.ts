export interface PaginationReq {
  page: number;
  limit: number;
  orderBy: string;
  order: string;
  search: string;
  type?: string;
  role?: string;
}
