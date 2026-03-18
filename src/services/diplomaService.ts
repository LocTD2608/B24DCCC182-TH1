// src/services/diplomaService.ts
import { SearchParams, DiplomaResult } from '../types/diploma';

export const searchDiplomaAPI = async (params: SearchParams): Promise<DiplomaResult> => {
  // TODO: Sau này nhóm bạn có Backend thật thì dùng axios hoặc fetch ở đây
  // Ví dụ: return await axios.post('/api/van-bang/tra-cuu', params);

  // Hiện tại dùng Mock API giả lập delay 1 giây để test giao diện
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Giả lập trả về thành công
      resolve({
        id: '1',
        soHieuVanBang: params.soHieuVanBang || 'VB123456',
        hoTen: params.hoTen || 'Hoàng Ngọc Liên',
        quyetDinhTotNghiep: 'QĐ-123/2026',
        luotTraCuu: 42,
      });
      
      // Nếu muốn test trường hợp lỗi, mở comment dòng dưới:
      // reject(new Error("Không tìm thấy dữ liệu"));
    }, 1000);
  });
};