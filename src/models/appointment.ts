import { useState } from 'react';

export default () => {
  const [items, setItems] = useState<any[]>([
    { id: '1', customerName: 'Trần Khách Test', staffId: 'NV02', time: '2026-03-12 10:00', status: 'Chờ duyệt' }
  ]);

  const fetchItems = () => {};

  const checkDuplicate = (staffId: string, time: string) => {
    return (items || []).some((item: any) => item.staffId === staffId && item.time === time);
  };

  const addAppointment = (newItem: any) => {
    setItems([...items, { ...newItem, id: Date.now().toString(), status: 'Chờ duyệt' }]);
  };

  // 1. THÊM HÀM NÀY ĐỂ CẬP NHẬT TRẠNG THÁI
  const updateStatus = (id: string, newStatus: string) => {
    const newItems = items.map((item) => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setItems(newItems);
  };

  // 2. NHỚ RETURN NÓ RA Ở ĐÂY NHÉ
  return { items, fetchItems, checkDuplicate, addAppointment, updateStatus };
};