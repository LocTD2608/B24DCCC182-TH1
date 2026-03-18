// src/types/diploma.ts

export interface SearchParams {
  soHieuVanBang: string;
  soVaoSo: string;
  msv: string;
  hoTen: string;
  ngaySinh: string;
}

export interface DiplomaResult {
  id: string;
  soHieuVanBang: string;
  hoTen: string;
  quyetDinhTotNghiep: string;
  luotTraCuu: number;
}