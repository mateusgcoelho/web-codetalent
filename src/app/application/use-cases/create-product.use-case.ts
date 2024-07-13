import { Inject, Injectable } from '@angular/core';
import ApplicationError from '../../core/application/errors/application.error';
import { Either, left, right } from '../../core/either/either';
import { InfraError } from '../../core/infra/errors/infra.error';
import Product from '../../domain/entities/product';
import ProductRepository from '../../domain/repositories/product.repository';

type InputCreateProduct = {
  description: string;
  cost?: number | undefined | null;
  image?: File | undefined | null;
};

type OutputCreateProduct = {
  product: Product;
};

@Injectable()
export default class CreateProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    input: InputCreateProduct,
  ): Promise<Either<ApplicationError, OutputCreateProduct>> {
    try {
      const product = await this.productRepository.create(input);

      return right({ product });
    } catch (error) {
      if (error instanceof InfraError) {
        return left(new ApplicationError(error.message));
      }

      return left(new ApplicationError('Não foi possível cadastrar produto.'));
    }
  }
}
