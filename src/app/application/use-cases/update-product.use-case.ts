import { Inject, Injectable } from '@angular/core';
import ApplicationError from '../../core/application/errors/application.error';
import { Either, left, right } from '../../core/either/either';
import { InfraError } from '../../core/infra/errors/infra.error';
import ProductRepository from '../../domain/repositories/product.repository';

export type InputUpdateProduct = {
  productId: number;
  description?: string | undefined | null;
  cost?: number | undefined | null;
  image?: File | undefined | null;
};

@Injectable()
export default class UpdateProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    input: InputUpdateProduct,
  ): Promise<Either<ApplicationError, null>> {
    try {
      await this.productRepository.update(input);

      return right(null);
    } catch (error) {
      if (error instanceof InfraError) {
        return left(new ApplicationError(error.message));
      }

      return left(new ApplicationError('Não foi possível editar produto.'));
    }
  }
}
