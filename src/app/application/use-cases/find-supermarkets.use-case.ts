import { Inject, Injectable } from '@angular/core';
import ApplicationError from '../../core/application/errors/application.error';
import { Either, left, right } from '../../core/either/either';
import { InfraError } from '../../core/infra/errors/infra.error';
import Supermarket from '../../domain/entities/supermarket';
import SupermarketRepository from '../../domain/repositories/supermarket.repository';

type OutputFindSupermarkets = {
  supermarkets: Supermarket[];
};

@Injectable()
export default class FindSupermarketsUseCase {
  constructor(
    @Inject('SupermarketRepository')
    private readonly supermarketRepository: SupermarketRepository,
  ) {}

  async execute(): Promise<Either<ApplicationError, OutputFindSupermarkets>> {
    try {
      const supermarkets = await this.supermarketRepository.findAll();

      return right({
        supermarkets,
      });
    } catch (error) {
      if (error instanceof InfraError) {
        return left(new ApplicationError(error.message));
      }

      return left(new ApplicationError('Não foi possível buscar lojas.'));
    }
  }
}
