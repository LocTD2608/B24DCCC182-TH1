import { RegistrationItem } from '@/pages/Registration/data';

// Giả lập danh sách đơn đăng ký ban đầu
const mockData: RegistrationItem[] = [
  {
    id: '1',
    fullName: 'Nguyễn Văn A',
    email: 'vana@gmail.com',
    phone: '0901234567',
    gender: 'Male',
    address: 'Hà Nội',
    talent: 'Hát, Nhảy',
    clubId: 'c1',
    clubName: 'CLB Âm Nhạc',
    reason: 'Em muốn giao lưu',
    status: 'Pending',
    history: [],
  },
];

export async function getRegistrations() {
  return { data: mockData, success: true };
}

export async function updateRegistrationStatus(id: string, status: string, note?: string) {
  // Logic gọi API PUT/PATCH ở đây
  return { success: true };
}