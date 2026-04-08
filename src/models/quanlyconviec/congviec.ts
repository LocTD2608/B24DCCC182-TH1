/**
 * Model: Quản lý danh sách Công việc
 * =========================================================
 * Lưu trữ: localStorage (khóa: 'qlcv_congviec')
 *
 * Cách dùng cho các thành viên khác:
 *   import { useModel } from 'umi';
 *   const {
 *     danhSachDaLoc,   // danh sách sau khi lọc/tìm kiếm
 *     tatCaCongViec,   // toàn bộ danh sách gốc
 *     boLoc,           // bộ lọc hiện tại
 *     setBoLoc,        // cập nhật bộ lọc
 *     themCongViec,    // thêm mới
 *     suaCongViec,     // sửa
 *     xoaCongViec,     // xóa
 *     danhSachNguoiDuocGiao, // danh sách người duy nhất (dùng cho dropdown lọc)
 *   } = useModel('quanlyconviec.congviec');
 */

import { useMemo, useState } from 'react';
import type { IBoLoc, ICongViec, IMucDoUuTien, ITrangThai } from './types';

const LOCAL_STORAGE_KEY = 'qlcv_congviec';

// ─── Dữ liệu mẫu để demo ────────────────────────────────
const MOCK_DATA: ICongViec[] = [
  {
    id: '1',
    ten: 'Thiết kế giao diện trang Đăng nhập',
    nguoiDuocGiao: 'Nguyễn Văn A',
    mucDoUuTien: 'cao',
    deadline: '2025-05-10',
    trangThai: 'da_xong',
    taoLuc: new Date().toISOString(),
    capNhatLuc: new Date().toISOString(),
  },
  {
    id: '2',
    ten: 'Xây dựng API danh sách công việc',
    nguoiDuocGiao: 'Trần Thị B',
    mucDoUuTien: 'cao',
    deadline: '2025-05-15',
    trangThai: 'dang_lam',
    taoLuc: new Date().toISOString(),
    capNhatLuc: new Date().toISOString(),
  },
  {
    id: '3',
    ten: 'Tích hợp Calendar hiển thị deadline',
    nguoiDuocGiao: 'Lê Văn C',
    mucDoUuTien: 'trung_binh',
    deadline: '2025-05-20',
    trangThai: 'chua_lam',
    taoLuc: new Date().toISOString(),
    capNhatLuc: new Date().toISOString(),
  },
  {
    id: '4',
    ten: 'Viết tài liệu hướng dẫn sử dụng',
    nguoiDuocGiao: 'Phạm Thị D',
    mucDoUuTien: 'thap',
    deadline: '2025-06-01',
    trangThai: 'chua_lam',
    taoLuc: new Date().toISOString(),
    capNhatLuc: new Date().toISOString(),
  },
  {
    id: '5',
    ten: 'Kiểm thử chức năng phân công công việc',
    nguoiDuocGiao: 'Trần Thị B',
    mucDoUuTien: 'trung_binh',
    deadline: '2025-05-18',
    trangThai: 'dang_lam',
    taoLuc: new Date().toISOString(),
    capNhatLuc: new Date().toISOString(),
  },
  {
    id: '6',
    ten: 'Làm tính năng thống kê tổng quan',
    nguoiDuocGiao: 'Nguyễn Văn A',
    mucDoUuTien: 'trung_binh',
    deadline: '2025-05-25',
    trangThai: 'chua_lam',
    taoLuc: new Date().toISOString(),
    capNhatLuc: new Date().toISOString(),
  },
];

// ─── Helpers ─────────────────────────────────────────────
const loadFromStorage = (): ICongViec[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ICongViec[];
    // Lần đầu: nạp dữ liệu mẫu
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_DATA));
    return MOCK_DATA;
  } catch {
    return MOCK_DATA;
  }
};

const saveToStorage = (data: ICongViec[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

const genId = () => `cv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ─── Model ───────────────────────────────────────────────
export default function useCongViecModel() {
  const [tatCaCongViec, setTatCaCongViec] = useState<ICongViec[]>(loadFromStorage);

  const [boLoc, setBoLoc] = useState<IBoLoc>({
    tuKhoa: '',
    trangThai: '',
    nguoiDuocGiao: '',
  });

  /** Danh sách công việc sau khi áp dụng bộ lọc */
  const danhSachDaLoc = useMemo(() => {
    return tatCaCongViec.filter((cv) => {
      // Lọc theo từ khóa (không phân biệt hoa/thường, bỏ dấu đơn giản)
      if (boLoc.tuKhoa?.trim()) {
        const keyword = boLoc.tuKhoa.trim().toLowerCase();
        if (!cv.ten.toLowerCase().includes(keyword)) return false;
      }

      // Lọc theo trạng thái
      if (boLoc.trangThai) {
        if (cv.trangThai !== boLoc.trangThai) return false;
      }

      // Lọc theo người được giao
      if (boLoc.nguoiDuocGiao?.trim()) {
        if (cv.nguoiDuocGiao !== boLoc.nguoiDuocGiao) return false;
      }

      return true;
    });
  }, [tatCaCongViec, boLoc]);

  /** Danh sách tên người duy nhất — dùng cho dropdown */
  const danhSachNguoiDuocGiao = useMemo(() => {
    const set = new Set(tatCaCongViec.map((cv) => cv.nguoiDuocGiao));
    return Array.from(set).sort();
  }, [tatCaCongViec]);

  /** Thêm công việc mới */
  const themCongViec = (data: {
    ten: string;
    nguoiDuocGiao: string;
    mucDoUuTien: IMucDoUuTien;
    deadline: string;
    trangThai: ITrangThai;
  }): ICongViec => {
    const now = new Date().toISOString();
    const moi: ICongViec = {
      id: genId(),
      ...data,
      taoLuc: now,
      capNhatLuc: now,
    };
    const updated = [...tatCaCongViec, moi];
    saveToStorage(updated);
    setTatCaCongViec(updated);
    return moi;
  };

  /** Cập nhật công việc */
  const suaCongViec = (id: string, data: Partial<Omit<ICongViec, 'id' | 'taoLuc'>>) => {
    const updated = tatCaCongViec.map((cv) =>
      cv.id === id ? { ...cv, ...data, capNhatLuc: new Date().toISOString() } : cv,
    );
    saveToStorage(updated);
    setTatCaCongViec(updated);
  };

  /** Xóa công việc */
  const xoaCongViec = (id: string) => {
    const updated = tatCaCongViec.filter((cv) => cv.id !== id);
    saveToStorage(updated);
    setTatCaCongViec(updated);
  };

  /** Reset bộ lọc về mặc định */
  const resetBoLoc = () => setBoLoc({ tuKhoa: '', trangThai: '', nguoiDuocGiao: '' });

  /** Thống kê nhanh */
  const thongKe = useMemo(
    () => ({
      total: tatCaCongViec.length,
      chuaLam: tatCaCongViec.filter((c) => c.trangThai === 'chua_lam').length,
      dangLam: tatCaCongViec.filter((c) => c.trangThai === 'dang_lam').length,
      daXong: tatCaCongViec.filter((c) => c.trangThai === 'da_xong').length,
    }),
    [tatCaCongViec],
  );

  return {
    tatCaCongViec,
    danhSachDaLoc,
    danhSachNguoiDuocGiao,
    boLoc,
    setBoLoc,
    resetBoLoc,
    themCongViec,
    suaCongViec,
    xoaCongViec,
    thongKe,
  };
}
