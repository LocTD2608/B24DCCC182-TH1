export type MucDoKho = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

export interface KhoiKienThuc {
    id: string;
    maKhoi: string;
    tenKhoi: string;
    moTa?: string;
}

export interface MonHoc {
    id: string;
    maMon: string;
    tenMon: string;
    soTinChi: number;
}

export interface CauHoi {
    id: string;
    maCauHoi: string;
    monHocId: string;
    noiDung: string;
    mucDoKho: MucDoKho;
    khoiKienThucId: string;
}

export interface CoCauDeThi {
    khoiKienThucId: string;
    mucDoKho: MucDoKho;
    soLuong: number;
}

export interface CauTrucDeThi {
    id: string;
    tenCauTruc: string;
    monHocId: string;
    coCau: CoCauDeThi[];
}

export interface DeThi {
    id: string;
    maDeThi: string;
    tenDeThi: string;
    monHocId: string;
    cauTrucId?: string;
    danhSachCauHoi: string[]; // CauHoi IDs
    ngayTao: string;
    ghiChu?: string;
}

export const MUC_DO_KHO_OPTIONS: MucDoKho[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

export const MUC_DO_KHO_COLOR: Record<MucDoKho, string> = {
    'Dễ': 'green',
    'Trung bình': 'blue',
    'Khó': 'orange',
    'Rất khó': 'red',
};
