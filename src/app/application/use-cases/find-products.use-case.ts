import { Inject, Injectable } from '@angular/core';
import ApplicationError from '../../core/application/errors/application.error';
import { Either, left, right } from '../../core/either/either';
import { InfraError } from '../../core/infra/errors/infra.error';
import Product from '../../domain/entities/product';
import ProductRepository from '../../domain/repositories/product.repository';

export type InputFindProducts = {
  productId?: number | undefined | null;
  description?: string | undefined | null;
  cost?: number | undefined | null;
  page: number;
  perPage: number;
};

type OutputFindProducts = {
  products: Product[];
  maxPage: number;
  total: number;
};

@Injectable()
export default class FindProductsUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    input: InputFindProducts,
  ): Promise<Either<ApplicationError, OutputFindProducts>> {
    try {
      const response = await this.productRepository.find(input);

      return right(response);
    } catch (error) {
      if (error instanceof InfraError) {
        return left(new ApplicationError(error.message));
      }

      return left(new ApplicationError('Não foi possível buscar produtos.'));
    }
  }
}
