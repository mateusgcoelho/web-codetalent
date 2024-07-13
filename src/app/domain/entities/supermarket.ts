export default class Supermarket {
  constructor(
    readonly id: number,
    readonly description: string,
  ) {}

  get fullDescription(): string {
    return `${this.id.toString().padStart(6, '0')} - ${this.description}`;
  }
}
