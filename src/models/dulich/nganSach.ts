import { getLichTrinhList, tinhNganSach } from '@/services/DuLich';
import type { DuLich } from '@/services/DuLich/typing';
import { useState } from 'react';

export default () => {
    const [danhSachLichTrinh, setDanhSachLichTrinh] = useState<DuLich.ILichTrinh[]>([]);
    const [lichTrinhDangXem, setLichTrinhDangXem] = useState<DuLich.ILichTrinh | undefined>();
    const [nganSachChiTiet, setNganSachChiTiet] = useState<DuLich.INganSachChiTiet | undefined>();
    const [hanMucTuChinh, setHanMucTuChinh] = useState<DuLich.IHanMucNganSach>({
        an: 0,
        luuTru: 0,
        diChuyen: 0,
        vuiChoi: 0,
        khac: 0,
    });

    const loadDanhSachLichTrinh = () => {
        const list = getLichTrinhList();
        setDanhSachLichTrinh(list);
        if (list.length > 0 && !lichTrinhDangXem) {
            chonLichTrinh(list[0]);
        }
    };

    const chonLichTrinh = (lichTrinh: DuLich.ILichTrinh) => {
        setLichTrinhDangXem(lichTrinh);
        const chiTiet = tinhNganSach(lichTrinh);
        setNganSachChiTiet(chiTiet);
        setHanMucTuChinh(chiTiet.chiTieu);
    };

    /** Cập nhật hạn mức tự chỉnh */
    const capNhatHanMuc = (key: keyof DuLich.IHanMucNganSach, value: number) => {
        setHanMucTuChinh((prev) => {
            const updated = { ...prev, [key]: value };
            // Cập nhật lại tổng
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
