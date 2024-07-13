import { Inject, Injectable } from '@angular/core';
import ApplicationError from '../../core/application/errors/application.error';
import { Either, left, right } from '../../core/either/either';
import { InfraError } from '../../core/infra/errors/infra.error';
import ProductRepository from '../../domain/repositories/product.repository';

type InputDeleteSalePrice = {
  productId: number;
  supermarketId: number;
};

@Injectable()
export default class DeleteSalePriceUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    input: InputDeleteSalePrice,
  ): Promise<Either<ApplicationError, null>> {
    try {
      await this.productRepository.deleteSalePrice(
        input.productId,
        input.supermarketId,
      );

      return right(null);
    } catch (error) {
      if (error instanceof InfraError) {
        return left(new ApplicationError(error.message));
      }

      return left(
        new ApplicationError(
          'Não foi possível excluir preço de venda de loja.',
        ),
      );
    }
  }
}
