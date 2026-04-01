import { v4 as uuidv4 } from 'uuid';
import { DIEM_DEN_MAC_DINH, STORAGE_KEYS } from './constant';
import type { DuLich } from './typing';

// ===========================
// ĐIỂM ĐẾN
// ===========================

/** Lấy toàn bộ điểm đến (mặc định + custom admin thêm) */
export const getDiemDenList = (): DuLich.IDiemDen[] => {
    try {
        const custom: DuLich.IDiemDen[] = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.DIEM_DEN_CUSTOM) ?? '[]',
        );
        return [...DIEM_DEN_MAC_DINH, ...custom];
    } catch {
        return [...DIEM_DEN_MAC_DINH];
    }
};

/** Lưu điểm đến mới (chỉ lưu vào custom list) */
export const saveDiemDen = (data: Omit<DuLich.IDiemDen, 'id' | 'isCustom'>): DuLich.IDiemDen => {
    const custom: DuLich.IDiemDen[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.DIEM_DEN_CUSTOM) ?? '[]',
    );
    const newItem: DuLich.IDiemDen = { ...data, id: uuidv4(), isCustom: true };
    custom.push(newItem);
    localStorage.setItem(STORAGE_KEYS.DIEM_DEN_CUSTOM, JSON.stringify(custom));
    return newItem;
};

/** Cập nhật điểm đến (chỉ với điểm đến do admin thêm) */
export const updateDiemDen = (id: string, data: Partial<DuLich.IDiemDen>): DuLich.IDiemDen | null => {
    const custom: DuLich.IDiemDen[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.DIEM_DEN_CUSTOM) ?? '[]',
    );
    const idx = custom.findIndex((d) => d.id === id);
    if (idx === -1) {
        // Cập nhật điểm đến mặc định → tạo bản sao trong custom
        const original = DIEM_DEN_MAC_DINH.find((d) => d.id === id);
        if (!original) return null;
        const updated: DuLich.IDiemDen = { ...original, ...data, isCustom: true };
        custom.push(updated);
        // Đánh dấu xóa trong default (lưu id bị override)
        const overrideIds: string[] = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.DIEM_DEN_CUSTOM + '_OVERRIDE') ?? '[]',
        );
        overrideIds.push(id);
        localStorage.setItem(STORAGE_KEYS.DIEM_DEN_CUSTOM + '_OVERRIDE', JSON.stringify(overrideIds));
        localStorage.setItem(STORAGE_KEYS.DIEM_DEN_CUSTOM, JSON.stringify(custom));
        return updated;
    }
    custom[idx] = { ...custom[idx], ...data };
    localStorage.setItem(STORAGE_KEYS.DIEM_DEN_CUSTOM, JSON.stringify(custom));
    return custom[idx];
};

/** Xóa điểm đến */
export const deleteDiemDen = (id: string): void => {
    const custom: DuLich.IDiemDen[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.DIEM_DEN_CUSTOM) ?? '[]',
    );
    const filtered = custom.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DIEM_DEN_CUSTOM, JSON.stringify(filtered));

    // Nếu xóa điểm đến mặc định → thêm vào override list
    const isDefault = DIEM_DEN_MAC_DINH.some((d) => d.id === id);
    if (isDefault) {
        const overrideIds: string[] = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.DIEM_DEN_CUSTOM + '_OVERRIDE') ?? '[]',
        );
        if (!overrideIds.includes(id)) {
            overrideIds.push(id);
            localStorage.setItem(STORAGE_KEYS.DIEM_DEN_CUSTOM + '_OVERRIDE', JSON.stringify(overrideIds));
        }
    }
};

// ===========================
// LỊCH TRÌNH
// ===========================

/** Lấy toàn bộ lịch trình */
export const getLichTrinhList = (): DuLich.ILichTrinh[] => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.LICH_TRINH) ?? '[]');
    } catch {
        return [];
    }
};

/** Lưu lịch trình mới */
export const saveLichTrinh = (
    data: Omit<DuLich.ILichTrinh, 'id' | 'createdAt' | 'updatedAt'>,
): DuLich.ILichTrinh => {
    const list = getLichTrinhList();
    const now = new Date().toISOString();
    const newItem: DuLich.ILichTrinh = { ...data, id: uuidv4(), createdAt: now, updatedAt: now };
    list.push(newItem);
    localStorage.setItem(STORAGE_KEYS.LICH_TRINH, JSON.stringify(list));
    return newItem;
};

/** Cập nhật lịch trình */
export const updateLichTrinh = (
    id: string,
    data: Partial<DuLich.ILichTrinh>,
): DuLich.ILichTrinh | null => {
    const list = getLichTrinhList();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.LICH_TRINH, JSON.stringify(list));
    return list[idx];
};

/** Xóa lịch trình */
export const deleteLichTrinh = (id: string): void => {
    const list = getLichTrinhList().filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LICH_TRINH, JSON.stringify(list));
};

// ===========================
// THỐNG KÊ
// ===========================

/** Tính toán thống kê từ localStorage */
export const getThongKe = (): DuLich.IThongKe => {
    const lichTrinhList = getLichTrinhList();
    const diemDenList = getDiemDenList();

    // Đếm số lịch trình theo tháng (tháng 1-12 năm hiện tại + mock thêm)
    const thangMap: Record<string, { soLuong: number; soTien: number }> = {};
    lichTrinhList.forEach((lt) => {
        const d = new Date(lt.createdAt);
        const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
        if (!thangMap[key]) thangMap[key] = { soLuong: 0, soTien: 0 };
        thangMap[key].soLuong += 1;
        thangMap[key].soTien += lt.nganSachTong;
    });

    // Mock thêm dữ liệu các tháng nếu ít
    const currentYear = new Date().getFullYear();
    const mockThang = [
        { soLuong: 12, soTien: 48000000 },
        { soLuong: 8, soTien: 32000000 },
        { soLuong: 15, soTien: 60000000 },
        { soLuong: 20, soTien: 80000000 },
        { soLuong: 18, soTien: 72000000 },
        { soLuong: 25, soTien: 100000000 },
        { soLuong: 30, soTien: 120000000 },
        { soLuong: 22, soTien: 88000000 },
        { soLuong: 28, soTien: 112000000 },
        { soLuong: 35, soTien: 140000000 },
        { soLuong: 40, soTien: 160000000 },
        { soLuong: 45, soTien: 180000000 },
    ];

    const lichTrinhTheoThang = mockThang.map((m, i) => {
        const key = `${i + 1}/${currentYear}`;
        return {
            thang: `Th.${i + 1}`,
            soLuong: (thangMap[key]?.soLuong ?? 0) + m.soLuong,
            soTien: (thangMap[key]?.soTien ?? 0) + m.soTien,
        };
    });

    // Top điểm đến
    const diemDenCounter: Record<string, number> = {};
    lichTrinhList.forEach((lt) => {
        lt.danhSachNgay.forEach((ngay) => {
            ngay.danhSachDiem.forEach((d) => {
                diemDenCounter[d.diemDen.ten] = (diemDenCounter[d.diemDen.ten] ?? 0) + 1;
            });
        });
    });

    // Mock top điểm đến
    const mockTopDiemDen = diemDenList.slice(0, 5).map((d) => ({
        ten: d.ten,
        soLuot: d.luotXem + Math.floor(Math.random() * 100),
    }));
    Object.entries(diemDenCounter).forEach(([ten, soLuot]) => {
        const existing = mockTopDiemDen.find((d) => d.ten === ten);
        if (existing) existing.soLuot += soLuot;
    });
    const topDiemDen = mockTopDiemDen.sort((a, b) => b.soLuot - a.soLuot).slice(0, 5);

    // Mock chi tiêu theo hạng mục
    const chiTieuTheoHanMuc = [
        { hanMuc: '🍜 Ăn uống', tong: 85000000 },
        { hanMuc: '🏨 Lưu trú', tong: 120000000 },
        { hanMuc: '🚗 Di chuyển', tong: 95000000 },
        { hanMuc: '🎡 Vui chơi', tong: 45000000 },
        { hanMuc: '💼 Khác', tong: 25000000 },
    ];

    const tongTien = lichTrinhTheoThang.reduce((acc, t) => acc + t.soTien, 0);
    const diemDenPhoNhat = topDiemDen[0]?.ten ?? 'Hội An';

    return {
        tongLichTrinh: lichTrinhList.length + 298,
        tongTien: tongTien,
        diemDenPhoNhat,
        lichTrinhTheoThang,
        topDiemDen,
        chiTieuTheoHanMuc,
    };
};

// ===========================
// TÍNH TOÁN NGÂN SÁCH
// ===========================

/** Tính ngân sách chi tiết từ lịch trình */
export const tinhNganSach = (lichTrinh: DuLich.ILichTrinh): DuLich.INganSachChiTiet => {
    let tongAn = 0;
    let tongLuuTru = 0;
    let tongDiChuyen = 0;

    lichTrinh.danhSachNgay.forEach((ngay) => {
        ngay.danhSachDiem.forEach((item) => {
            tongAn += item.diemDen.chiPhiAn;
            tongLuuTru += item.diemDen.chiPhiLuuTru;
            tongDiChuyen += item.diemDen.chiPhiDiChuyen;
        });
    });

    const vuiChoi = Math.round((tongAn + tongLuuTru + tongDiChuyen) * 0.15);
    const khac = Math.round((tongAn + tongLuuTru + tongDiChuyen) * 0.05);

    const chiTieu: DuLich.IHanMucNganSach = {
        an: tongAn,
        luuTru: tongLuuTru,
        diChuyen: tongDiChuyen,
        vuiChoi,
        khac,
    };

    const tongChiTieu = Object.values(chiTieu).reduce((a, b) => a + b, 0);

    return {
        lichTrinhId: lichTrinh.id,
        nganSachTong: lichTrinh.nganSachTong,
        chiTieu,
        tongChiTieu,
        conLai: lichTrinh.nganSachTong - tongChiTieu,
        vietQuaNganSach: tongChiTieu > lichTrinh.nganSachTong,
    };
};
