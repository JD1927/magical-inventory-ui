export interface IPaginationDto {
  limit: number;
  offset: number;
  term?: string;
}

export enum EOrderBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ELimitSettings {
  DEFAULT = 10,
  MAX = 100,
}
