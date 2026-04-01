export namespace DuLich {
    export type ELoaiDiemDen = 'BIEN' | 'NUI' | 'THANH_PHO';

    export interface IDiemDen {
        id: string;
        ten: string;
        loai: ELoaiDiemDen;
        moTa: string;
        hinhAnh: string;
        diaChi: string;
        rating: number;
        thoiGianThamQuan: number; // giờ
        chiPhiAn: number; // VND/ngày
        chiPhiLuuTru: number; // VND/đêm
        chiPhiDiChuyen: number; // VND/người
        luotXem: number;
        isCustom?: boolean; // true nếu do admin thêm
    }

    export interface IDiemDenTrongNgay {
        diemDen: IDiemDen;
        ghiChu?: string;
    }

    export interface INgay {
        soNgay: number; // 1-indexed
        danhSachDiem: IDiemDenTrongNgay[];
    }

    export interface ILichTrinh {
        id: string;
        tenLichTrinh: string;
        ngayBatDau: string; // ISO date string
        soNgay: number;
        nganSachTong: number; // VND
        danhSachNgay: INgay[];
        createdAt: string;
        updatedAt: string;
    }

    export interface IHanMucNganSach {
        an: number;
        luuTru: number;
        diChuyen: number;
        vuiChoi: number;
        khac: number;
    }

    export interface INganSachChiTiet {
        lichTrinhId: string;
        nganSachTong: number;
        chiTieu: IHanMucNganSach;
        tongChiTieu: number;
        conLai: number;
        vietQuaNganSach: boolean;
    }

    export interface IThongKe {
        tongLichTrinh: number;
        tongTien: number;
        diemDenPhoNhat: string;
        lichTrinhTheoThang: { thang: string; soLuong: number; soTien: number }[];
        topDiemDen: { ten: string; soLuot: number }[];
        chiTieuTheoHanMuc: { hanMuc: string; tong: number }[];
    }
}
