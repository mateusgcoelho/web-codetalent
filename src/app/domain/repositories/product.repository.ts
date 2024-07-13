import { FilterFindProducts } from '../dtos/filter-find-products.dto';
import { InputAssignSalePriceProduct } from '../dtos/input-assign-sale-price.dto';
import { InputCreateProduct } from '../dtos/input-create-product.dto';
import { InputUpdateProduct } from '../dtos/input-update-product.dto';
import OutputFindProducts from '../dtos/output-find-products.dto';
import OutputGetProduct from '../dtos/output-get-product.dto';
import Product from '../entities/product';

export default interface ProductRepository {
  find(filter: FilterFindProducts): Promise<OutputFindProducts>;
  create(input: InputCreateProduct): Promise<Product>;
  deleteSalePrice(productId: number, supermarketId: number): Promise<void>;
  assignSalePrice(input: InputAssignSalePriceProduct): Promise<void>;
  getProduct(productId: number): Promise<OutputGetProduct>;
  delete(productId: number): Promise<void>;
  update(input: InputUpdateProduct): Promise<void>;
}
