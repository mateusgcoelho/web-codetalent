import { Buffer } from 'buffer';

export default class Product {
  constructor(
    readonly id: number,
    readonly description: string,
    readonly cost: number,
    readonly image?: Buffer,
  ) {}

  get formattedId(): string {
    return this.id.toString().padStart(6, '0');
  }

  get formattedDescription(): string {
    return this.description.toUpperCase();
  }

  get formattedCost(): string {
    return Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.cost);
  }

  static fromJson(json: any): Product {
    return new Product(
      parseInt(json['id']),
      json['description'],
      parseFloat(json['cost']),
      json['image'],
    );
  }
}
