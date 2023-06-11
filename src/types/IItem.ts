import type { ICategoryItem } from "./ICategoryItem";

export interface IItem {
  id: number;
  name: string;
  code: String;
  description: string;
  item_category: Array<ICategoryItem>;
  measuring_unit: string;
}
export interface IItemFilter {
  name: string;
  code?: string;
  description?: string;
  measuring_unit?: string;
  item_category_id?: number;
  item_category_name?: string;
  limit: number;
}
