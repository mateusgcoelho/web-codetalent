import SalePrice from '../../../../domain/entities/sale-price';
import { SelectOptionModel } from '../../../components/select-input/view-models/select-option.model';

export type DialogCreateSalePriceModel = {
  productId: number;
  supermarketOptions: SelectOptionModel<number>[];
  salePrice: SalePrice | undefined;
};
