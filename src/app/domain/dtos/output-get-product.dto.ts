import Product from '../entities/product';
import SalePrice from '../entities/sale-price';
import Supermarket from '../entities/supermarket';

export default class OutputGetProduct {
  constructor(
    readonly product: Product,
    readonly salesPrices: SalePrice[],
  ) {}

  static fromJson(json: any): OutputGetProduct {
    const product: Product = new Product(
      json['product']['id'],
      json['product']['description'],
      json['product']['cost'],
      json['product']['image'],
    );

    const salesPrices: SalePrice[] = json['salesPrices'].map(
      (salePriceJson: any) => {
        const supermarket = new Supermarket(
          salePriceJson['supermarket']['id'],
          salePriceJson['supermarket']['description'],
        );
        return new SalePrice(
          supermarket,
          salePriceJson['productId'],
          parseFloat(salePriceJson['salePrice']),
        );
      },
    );
    return new OutputGetProduct(product, salesPrices);
  }
}
