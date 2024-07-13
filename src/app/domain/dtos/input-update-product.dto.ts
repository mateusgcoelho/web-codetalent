export type InputUpdateProduct = {
  productId: number;
  description?: string | undefined | null;
  cost?: number | undefined | null;
  image?: File | undefined | null;
};
