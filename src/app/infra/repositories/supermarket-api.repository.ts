import { Inject, Injectable } from '@angular/core';
import Supermarket from '../../domain/entities/supermarket';
import SupermarketRepository from '../../domain/repositories/supermarket.repository';
import { IHttpClient } from '../gateway/interfaces/http-client.interface';

@Injectable()
export default class SupermarketRepositoryApi implements SupermarketRepository {
  constructor(
    @Inject('HttpClient')
    private readonly httpClient: IHttpClient,
  ) {}

  async findAll(): Promise<Supermarket[]> {
    const response = await this.httpClient.get(`/supermarkets`);

    return response.data['supermarkets'].map(
      (json: any) => new Supermarket(json['id'], json['description']),
    );
  }
}
