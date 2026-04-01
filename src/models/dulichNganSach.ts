import { getLichTrinhList, tinhNganSach } from '@/services/DuLich';
import { DIEM_DEN_MAC_DINH } from '@/services/DuLich/constant';
import type { DuLich } from '@/services/DuLich/typing';
import { useState } from 'react';

// ──────────────────────────────────────────────────────────
// Mock lịch trình mẫu — hiển thị ngay cả khi chưa tạo lịch trình
// ──────────────────────────────────────────────────────────
const [phuQuoc, haNoi, hoiAn, hue, dalat, , haLong] = DIEM_DEN_MAC_DINH;

const MOCK_LICH_TRINH: DuLich.ILichTrinh[] = [
    {
        id: 'mock-001',
        tenLichTrinh: '🏖️ Phú Quốc 4 ngày 3 đêm',
        ngayBatDau: '2026-04-10T00:00:00.000Z',
        soNgay: 4,
        nganSachTong: 8000000,
        createdAt: '2026-03-01T00:00:00.000Z',
        updatedAt: '2026-03-01T00:00:00.000Z',
        danhSachNgay: [
            {
                soNgay: 1,
                danhSachDiem: [{ diemDen: phuQuoc, ghiChu: 'Di chuyển & nhận phòng' }],
            },
            {
                soNgay: 2,
                danhSachDiem: [
                    { diemDen: phuQuoc, ghiChu: 'Tham quan bãi Sao' },
                    { diemDen: hoiAn, ghiChu: 'Khám phá phố cổ buổi chiều' },
                ],
            },
            { soNgay: 3, danhSachDiem: [{ diemDen: phuQuoc }] },
            { soNgay: 4, danhSachDiem: [{ diemDen: phuQuoc, ghiChu: 'Trả phòng, về nhà' }] },
        ],
    },
    {
        id: 'mock-002',
        tenLichTrinh: '🏙️ Hà Nội – Hạ Long 5 ngày',
        ngayBatDau: '2026-05-01T00:00:00.000Z',
        soNgay: 5,
        nganSachTong: 12000000,
        createdAt: '2026-03-15T00:00:00.000Z',
        updatedAt: '2026-03-15T00:00:00.000Z',
        danhSachNgay: [
            { soNgay: 1, danhSachDiem: [{ diemDen: haNoi, ghiChu: 'Nhận phòng, dạo phố cổ' }] },
            { soNgay: 2, danhSachDiem: [{ diemDen: haNoi }, { diemDen: haLong }] },
            { soNgay: 3, danhSachDiem: [{ diemDen: haLong, ghiChu: 'Du thuyền vịnh Hạ Long' }] },
            { soNgay: 4, danhSachDiem: [{ diemDen: haLong }] },
            { soNgay: 5, danhSachDiem: [{ diemDen: haNoi, ghiChu: 'Về Hà Nội, bay về' }] },
        ],
    },
    {
        id: 'mock-003',
        tenLichTrinh: '🌿 Đà Lạt – Huế – Hội An 7 ngày',
        ngayBatDau: '2026-06-15T00:00:00.000Z',
        soNgay: 7,
        nganSachTong: 15000000,
        createdAt: '2026-04-01T00:00:00.000Z',
        updatedAt: '2026-04-01T00:00:00.000Z',
        danhSachNgay: [
            { soNgay: 1, danhSachDiem: [{ diemDen: dalat, ghiChu: 'Bay đến Đà Lạt' }] },
            { soNgay: 2, danhSachDiem: [{ diemDen: dalat }] },
            { soNgay: 3, danhSachDiem: [{ diemDen: dalat }, { diemDen: hue }] },
            { soNgay: 4, danhSachDiem: [{ diemDen: hue, ghiChu: 'Thăm Đại Nội, lăng tẩm' }] },
            { soNgay: 5, danhSachDiem: [{ diemDen: hue }, { diemDen: hoiAn }] },
            { soNgay: 6, danhSachDiem: [{ diemDen: hoiAn, ghiChu: 'Phố cổ ban đêm, đèn lồng' }] },
            { soNgay: 7, danhSachDiem: [{ diemDen: hoiAn, ghiChu: 'Mua sắm, trở về' }] },
        ],
    },
];

export default () => {
    const [danhSachLichTrinh, setDanhSachLichTrinh] = useState<DuLich.ILichTrinh[]>([]);
    const [lichTrinhDangXem, setLichTrinhDangXem] = useState<DuLich.ILichTrinh | undefined>();
    const [nganSachChiTiet, setNganSachChiTiet] = useState<DuLich.INganSachChiTiet | undefined>();
    const [hanMucTuChinh, setHanMucTuChinh] = useState<DuLich.IHanMucNganSach>({
        an: 0, luuTru: 0, diChuyen: 0, vuiChoi: 0, khac: 0,
    });

    const chonLichTrinh = (lichTrinh: DuLich.ILichTrinh) => {
        setLichTrinhDangXem(lichTrinh);
        const chiTiet = tinhNganSach(lichTrinh);
        setNganSachChiTiet(chiTiet);
        setHanMucTuChinh(chiTiet.chiTieu);
    };

    const loadDanhSachLichTrinh = () => {
        const saved = getLichTrinhList();
        // Lịch trình người dùng tạo ở trên, mock data ở dưới
        const combined = [...saved, ...MOCK_LICH_TRINH];
        setDanhSachLichTrinh(combined);
        if (combined.length > 0) {
            chonLichTrinh(combined[0]);
        }
    };

    const capNhatHanMuc = (key: keyof DuLich.IHanMucNganSach, value: number) => {
        setHanMucTuChinh((prev) => {
            const updated = { ...prev, [key]: value };
            const tong = Object.values(updated).reduce((a, b) => a + b, 0);
            if (nganSachChiTiet && lichTrinhDangXem) {
                setNganSachChiTiet({
                    ...nganSachChiTiet,
                    chiTieu: updated,
                    tongChiTieu: tong,
                    conLai: lichTrinhDangXem.nganSachTong - tong,
                    vietQuaNganSach: tong > lichTrinhDangXem.nganSachTong,
                });
            }
            return updated;
        });
    };

    return {
        danhSachLichTrinh,
        lichTrinhDangXem,
        nganSachChiTiet,
        hanMucTuChinh,
        loadDanhSachLichTrinh,
        chonLichTrinh,
        capNhatHanMuc,
    };
};
