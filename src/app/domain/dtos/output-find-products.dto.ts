import Product from '../entities/product';

export default class OutputFindProducts {
  constructor(
    readonly products: Product[],
    readonly maxPage: number,
    readonly total: number
  ) {}

  static fromJson(json: any): OutputFindProducts {
    const products: Product[] = json['products'].map(
      (productJson: any) =>
        new Product(
          productJson['id'],
          productJson['description'],
          productJson['cost']
        )
    );

    return new OutputFindProducts(
      products,
      Number(json['maxPage']),
      Number(json['total'])
    );
  }
}
