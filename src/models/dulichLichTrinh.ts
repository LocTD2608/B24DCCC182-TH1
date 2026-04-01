import { getLichTrinhList, saveLichTrinh, updateLichTrinh, deleteLichTrinh } from '@/services/DuLich';
import type { DuLich } from '@/services/DuLich/typing';
import { useState } from 'react';

export default () => {
    const [danhSachLichTrinh, setDanhSachLichTrinh] = useState<DuLich.ILichTrinh[]>([]);
    const [lichTrinhHienTai, setLichTrinhHienTai] = useState<Partial<DuLich.ILichTrinh>>({
        tenLichTrinh: '',
        soNgay: 3,
        nganSachTong: 5000000,
        danhSachNgay: [],
    });
    const [loading, setLoading] = useState(false);
    const [chonDiemDenVisible, setChonDiemDenVisible] = useState(false);
    const [ngayDangChon, setNgayDangChon] = useState<number>(1);

    const loadDanhSachLichTrinh = () => {
        setLoading(true);
        try {
            const list = getLichTrinhList();
            setDanhSachLichTrinh(list);
        } finally {
            setLoading(false);
        }
    };

    const taoNgayRong = (soNgay: number): DuLich.INgay[] => {
        return Array.from({ length: soNgay }, (_, i) => ({
            soNgay: i + 1,
            danhSachDiem: [],
        }));
    };

    const khoiTaoLichTrinhMoi = (soNgay: number = 3) => {
        setLichTrinhHienTai({
            tenLichTrinh: '',
            soNgay,
            nganSachTong: 5000000,
            danhSachNgay: taoNgayRong(soNgay),
        });
    };

    const capNhatSoNgay = (soNgay: number) => {
        setLichTrinhHienTai((prev) => {
            const newNgay = taoNgayRong(soNgay);
            prev.danhSachNgay?.forEach((ngay) => {
                if (ngay.soNgay <= soNgay) {
                    newNgay[ngay.soNgay - 1] = ngay;
                }
            });
            return { ...prev, soNgay, danhSachNgay: newNgay };
        });
    };

    const themDiemDenVaoNgay = (soNgay: number, diemDen: DuLich.IDiemDen) => {
        setLichTrinhHienTai((prev) => {
            const newNgay = [...(prev.danhSachNgay ?? [])];
            const ngayIdx = newNgay.findIndex((n) => n.soNgay === soNgay);
            if (ngayIdx !== -1) {
                const isDuplicate = newNgay[ngayIdx].danhSachDiem.some((d) => d.diemDen.id === diemDen.id);
                if (!isDuplicate) {
                    newNgay[ngayIdx] = {
                        ...newNgay[ngayIdx],
                        danhSachDiem: [...newNgay[ngayIdx].danhSachDiem, { diemDen }],
                    };
                }
            }
            return { ...prev, danhSachNgay: newNgay };
        });
    };

    const xoaDiemDenKhoiNgay = (soNgay: number, diemDenId: string) => {
        setLichTrinhHienTai((prev) => {
            const newNgay = [...(prev.danhSachNgay ?? [])];
            const ngayIdx = newNgay.findIndex((n) => n.soNgay === soNgay);
            if (ngayIdx !== -1) {
                newNgay[ngayIdx] = {
                    ...newNgay[ngayIdx],
                    danhSachDiem: newNgay[ngayIdx].danhSachDiem.filter((d) => d.diemDen.id !== diemDenId),
                };
            }
            return { ...prev, danhSachNgay: newNgay };
        });
    };

    const sapXepDiemDen = (soNgay: number, fromIndex: number, toIndex: number) => {
        setLichTrinhHienTai((prev) => {
            const newNgay = [...(prev.danhSachNgay ?? [])];
            const ngayIdx = newNgay.findIndex((n) => n.soNgay === soNgay);
            if (ngayIdx !== -1) {
                const items = [...newNgay[ngayIdx].danhSachDiem];
                const [removed] = items.splice(fromIndex, 1);
                items.splice(toIndex, 0, removed);
                newNgay[ngayIdx] = { ...newNgay[ngayIdx], danhSachDiem: items };
            }
            return { ...prev, danhSachNgay: newNgay };
        });
    };

    const luuLichTrinh = () => {
        const { tenLichTrinh, soNgay, nganSachTong, danhSachNgay, id } = lichTrinhHienTai;
        if (!tenLichTrinh || !soNgay || !nganSachTong) return;
        const payload = {
            tenLichTrinh: tenLichTrinh!,
            ngayBatDau: new Date().toISOString(),
            soNgay: soNgay!,
            nganSachTong: nganSachTong!,
            danhSachNgay: danhSachNgay ?? [],
        };
        if (id) {
            updateLichTrinh(id, payload);
        } else {
            saveLichTrinh(payload);
        }
        loadDanhSachLichTrinh();
        khoiTaoLichTrinhMoi();
    };

    const suaLichTrinh = (lt: DuLich.ILichTrinh) => {
        setLichTrinhHienTai({ ...lt });
    };

    const xoaLichTrinh = (id: string) => {
        deleteLichTrinh(id);
        loadDanhSachLichTrinh();
    };

    return {
        danhSachLichTrinh,
        lichTrinhHienTai,
        setLichTrinhHienTai,
        loading,
        chonDiemDenVisible,
        setChonDiemDenVisible,
        ngayDangChon,
        setNgayDangChon,
        loadDanhSachLichTrinh,
        khoiTaoLichTrinhMoi,
        capNhatSoNgay,
        themDiemDenVaoNgay,
        xoaDiemDenKhoiNgay,
        sapXepDiemDen,
        luuLichTrinh,
        suaLichTrinh,
        xoaLichTrinh,
    };
};
