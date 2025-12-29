export interface IPaginationDto {
  limit: number;
  offset: number;
}

export enum ELimitSettings {
  DEFAULT = 10,
  MAX = 100,
}
