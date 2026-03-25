/**
 * 📚 GIẢI THÍCH — TYPINGS (Định nghĩa kiểu dữ liệu)
 *
 * Trong TypeScript, ta cần khai báo "hình dáng" của dữ liệu trước khi dùng.
 * - `declare module` tạo một namespace để gom các type lại
 * - `interface` định nghĩa cấu trúc của 1 object (gồm những trường nào, kiểu gì)
 *
 * Lợi ích: IDE sẽ gợi ý đúng tên trường & báo lỗi nếu viết sai kiểu.
 */
declare module VanBang {
    /** Sổ Văn Bằng — mỗi năm có 1 sổ */
    export interface SoVanBang {
        id: string;
        /** Năm của sổ, ví dụ: 2026 */
        nam: number;
        /** Ngày tạo sổ */
        ngayTao: string;
    }

    /** Thông tin 1 Văn Bằng trong sổ */
    export interface VanBangRecord {
        id: string;
        /** Số thứ tự trong sổ (tự động tăng, reset khi mở sổ mới) */
        soVaoSo: number;
        /** Mã định danh duy nhất của văn bằng, VD: VB-2026-001 */
        soHieuVanBang: string;
        /** ID của sổ văn bằng chứa văn bằng này */
        soVanBangId: string;

        // ---- Thông tin sinh viên ----
        hoTen: string;
        ngaySinh: string;
        noiSinh: string;
        gioiTinh: 'Nam' | 'Nữ';
        danToc: string;

        // ---- Thông tin tốt nghiệp ----
        xepLoai: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình';
        heDaoTao: 'Chính quy' | 'Vừa làm vừa học' | 'Từ xa';
        namTotNghiep: number;
        ngayCap: string;
    }
}
