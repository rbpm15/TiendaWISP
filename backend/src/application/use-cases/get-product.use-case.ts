import type { ProductRepository } from '../../domain/ports/product-repository.js';

export class GetProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string) {
    return this.productRepository.findById(id);
  }
}
