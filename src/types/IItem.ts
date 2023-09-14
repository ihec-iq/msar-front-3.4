import type { ICategoryItem } from "./ICategoryItem";

export interface IItem {
  id: number;
  name: string;
  code: String;
  description: string;
  Category: ICategoryItem;
  measuringUnit: string;
  itemCategoryId?: number;
}
export interface IItemFilter {
  name: string;
  code?: string;
  description?: string;
  measuringUnit?: string;
  itemCategoryId?: number;
  itemCategoryName?: string;
  limit: number;
}
export interface IItemCategory {
  id: number;
  name: string;
  description?: string;
}
export interface IItemCategoryFilter {
  name: string;
  limit: number;
  description?: string;
}
