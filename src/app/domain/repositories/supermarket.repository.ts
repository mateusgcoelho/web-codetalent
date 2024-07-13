import Supermarket from '../entities/supermarket';

export default interface SupermarketRepository {
  findAll(): Promise<Supermarket[]>;
}
