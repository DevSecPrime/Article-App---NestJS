import { IPaginationMeta } from 'nestjs-typeorm-paginate';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

export const generateMeta = (data: Partial<IPaginationMeta>) => {
  const totalItems = Number(data.totalItems);
  return {
    totalItems: totalItems,
    itemsPerPage: Number(data.itemsPerPage),
    totalPages: Math.ceil(totalItems / data.itemsPerPage),
    currentPage: data.currentPage,
  };
};

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
}
