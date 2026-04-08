/**
 * Model: Quản lý xác thực người dùng (Đăng nhập / Đăng xuất)
 * Lưu trữ: localStorage
 * Cách dùng cho các thành viên khác:
 *   import { useModel } from 'umi';
 *   const { currentUser, dangNhap, dangXuat } = useModel('quanlyconviec.auth');
 */

import { useState } from 'react';

export const LOCAL_STORAGE_KEY = 'qlcv_user';

export interface INguoiDung {
  /** Tên hiển thị */
  ten: string;
  /** Thời điểm đăng nhập (ISO string) */
  dangNhapLuc: string;
}

const getStoredUser = (): INguoiDung | null => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as INguoiDung) : null;
  } catch {
    return null;
  }
};

export default function useAuthModel() {
  const [currentUser, setCurrentUser] = useState<INguoiDung | null>(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Đăng nhập bằng tên người dùng
   * @param ten - Tên người dùng nhập vào
   */
  const dangNhap = (ten: string): boolean => {
    const trimmed = ten.trim();
    if (!trimmed) {
      setError('Vui lòng nhập tên người dùng');
      return false;
    }

    setLoading(true);
    setError(null);

    const user: INguoiDung = {
      ten: trimmed,
      dangNhapLuc: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
    setLoading(false);
    return true;
  };

  /**
   * Đăng xuất - xóa dữ liệu người dùng khỏi localStorage
   */
  const dangXuat = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setCurrentUser(null);
    setError(null);
  };

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  const daDangNhap = !!currentUser;

  return {
    currentUser,
    loading,
    error,
    daDangNhap,
    dangNhap,
    dangXuat,
    setError,
  };
}
