import { Inject, Injectable } from '@angular/core';
import ApplicationError from '../../core/application/errors/application.error';
import { Either, left, right } from '../../core/either/either';
import { InfraError } from '../../core/infra/errors/infra.error';
import ProductRepository from '../../domain/repositories/product.repository';

export type InputUpdateSalePrice = {
  productId: number;
  supermarketId: number;
  salePrice: number;
};

@Injectable()
export default class UpdateSalePriceUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    input: InputUpdateSalePrice,
  ): Promise<Either<ApplicationError, null>> {
    try {
      await this.productRepository.updateSalePrice(input);

      return right(null);
    } catch (error) {
      if (error instanceof InfraError) {
        return left(new ApplicationError(error.message));
      }

      return left(
        new ApplicationError('Não foi possível editar preço de venda.'),
      );
    }
  }
}
