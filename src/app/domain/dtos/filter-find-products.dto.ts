export type FilterFindProducts = {
  productId?: number | undefined | null;
  description?: string | undefined | null;
  cost?: number | undefined | null;
  price?: number | undefined | null;
  page: number;
  perPage: number;
};
