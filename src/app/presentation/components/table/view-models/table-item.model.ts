export type TableItemModel<T> = {
  itens: TableDataItemModel[];
  value: T;
};

export type TableDataItemModel = {
  label: string;
};
