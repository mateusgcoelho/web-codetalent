import { Inject, Injectable } from '@angular/core';
import ApplicationError from '../../core/application/errors/application.error';
import { Either, left, right } from '../../core/either/either';
import { InfraError } from '../../core/infra/errors/infra.error';
import Product from '../../domain/entities/product';
import SalePrice from '../../domain/entities/sale-price';
import ProductRepository from '../../domain/repositories/product.repository';

export type InputGetProduct = {
  productId: number;
};

type OutputGetProduct = {
  product: Product;
  salesPrices: SalePrice[];
};

@Injectable()
export default class GetProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    input: InputGetProduct,
  ): Promise<Either<ApplicationError, OutputGetProduct>> {
    try {
      const response = await this.productRepository.getProduct(input.productId);

      return right(response);
    } catch (error) {
      if (error instanceof InfraError) {
        return left(new ApplicationError(error.message));
      }

      return left(new ApplicationError('Não foi possível encontrar produto.'));
    }
  }
}
