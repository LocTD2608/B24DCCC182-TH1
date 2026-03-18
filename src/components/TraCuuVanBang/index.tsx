import React, { useState } from 'react';

// Khai báo kiểu dữ liệu ngay trong file để tránh lỗi đường dẫn
interface SearchParams {
  soHieuVanBang: string;
  soVaoSo: string;
  msv: string;
  hoTen: string;
  ngaySinh: string;
}

interface DiplomaResult {
  id: string;
  soHieuVanBang: string;
  hoTen: string;
  quyetDinhTotNghiep: string;
  luotTraCuu: number;
}

export default function TraCuuVanBang() {
  const [formData, setFormData] = useState<SearchParams>({
    soHieuVanBang: '',
    soVaoSo: '',
    msv: '',
    hoTen: '',
    ngaySinh: '',
  });
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<DiplomaResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const filledFieldsCount = Object.values(formData).filter((val) => val.trim() !== '').length;
    if (filledFieldsCount < 2) {
      setError('Vui lòng nhập ít nhất 2 tham số để tra cứu.');
      return;
    }

    setLoading(true);
    try {
      // Giả lập gọi API (delay 1s)
      const response = await new Promise<DiplomaResult>((resolve) => {
        setTimeout(() => {
          resolve({
            id: '1',
            soHieuVanBang: formData.soHieuVanBang || 'VB123456',
            hoTen: formData.hoTen || 'Hoàng Ngọc Liên',
            quyetDinhTotNghiep: 'QĐ-123/2026',
            luotTraCuu: 42,
          });
        }, 1000);
      });
      setResult(response);
    } catch (err) {
      setError('Không tìm thấy thông tin hoặc có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '20px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        Tra cứu văn bằng
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Số hiệu văn bằng</label>
            <input type="text" name="soHieuVanBang" value={formData.soHieuVanBang} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }} placeholder="VD: VB123456" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Số vào sổ</label>
            <input type="text" name="soVaoSo" value={formData.soVaoSo} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }} placeholder="VD: SVS789" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Mã sinh viên (MSV)</label>
            <input type="text" name="msv" value={formData.msv} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }} placeholder="VD: B24DCCC182" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Họ và tên</label>
            <input type="text" name="hoTen" value={formData.hoTen} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }} placeholder="VD: Hoàng Ngọc Liên" />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Ngày sinh</label>
            <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }} />
          </div>
        </div>

        {error && <p style={{ color: '#ff4d4f', fontSize: '14px', margin: 0 }}>{error}</p>}
        
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Đang tra cứu...' : 'Tra cứu'}
        </button>
      </form>

      {result && (
        <div style={{ mt: '20px', padding: '15px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px', marginTop: '20px' }}>
          <h3 style={{ color: '#52c41a', marginBottom: '10px' }}>Kết quả tra cứu</h3>
          <p><strong>Họ và tên:</strong> {result.hoTen}</p>
          <p><strong>Số hiệu:</strong> {result.soHieuVanBang}</p>
          <p><strong>Quyết định:</strong> {result.quyetDinhTotNghiep}</p>
          <p style={{ fontSize: '12px', fontStyle: 'italic', marginTop: '10px', borderTop: '1px solid #b7eb8f', paddingTop: '5px' }}>
            * Tổng lượt tra cứu: {result.luotTraCuu}
          </p>
        </div>
      )}
    </div>
  );
}