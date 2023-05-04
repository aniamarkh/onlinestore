export interface Plant {
  num: number;
  name: string;
  count: number;
  price: number;
  size: string;
  color: string;
  dif: string;
  pet: boolean;
}

export interface ActiveFilters {
  name: string[];
  count: number[];
  price: number[];
  size: string[];
  color: string[];
  dif: string[];
  pet: boolean;
  search: string;
  sort: string[] | string;
}