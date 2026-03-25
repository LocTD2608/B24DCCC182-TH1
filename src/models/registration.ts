import { useState, useCallback } from 'react';
import { RegistrationItem, RegistrationStatus } from '@/pages/Registration/data';

export default () => {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Hàm cập nhật trạng thái đơn (Duyệt/Từ chối)
  const updateStatus = useCallback((ids: string[], status: RegistrationStatus, reason?: string) => {
    setRegistrations((prev) =>
      prev.map((item) => {
        if (ids.includes(item.id)) {
          const newLog = {
            adminName: 'Admin', // Lấy từ auth nếu có
            action: status,
            time: new Date().toLocaleString('vi-VN'),
            reason,
          };
          return { ...item, status, history: [...item.history, newLog], note: reason };
        }
        return item;
      }),
    );
  }, []);

  return { registrations, setRegistrations, loading, setLoading, updateStatus };
};
