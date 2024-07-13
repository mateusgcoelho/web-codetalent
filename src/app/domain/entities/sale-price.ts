import Supermarket from './supermarket';

export default class SalePrice {
  constructor(
    readonly supermarket: Supermarket,
    readonly productId: number,
    readonly salePrice: number,
  ) {}

  static create(
    supermarket: Supermarket,
    productId: number,
    salePrice: number,
  ) {
    return new SalePrice(supermarket, productId, salePrice);
  }

  get formattedSalePrice(): string {
    return Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.salePrice);
  }
}
