declare module QuanLyCLB {
    /** Thông tin 1 Câu lạc bộ */
    export interface Club {
        id: string;
        name: string;
        description: string;
    }

    /** Thông tin 1 thành viên CLB */
    export interface Member {
        id: string;
        hoTen: string;
        email: string;
        soDienThoai: string;
        clubId: string;
        trangThai: 'Approved' | 'Pending' | 'Rejected';
        ngayThamGia: string;
    }
}
