import { getDiemDenList, deleteDiemDen, saveDiemDen, updateDiemDen } from '@/services/DuLich';
import type { DuLich } from '@/services/DuLich/typing';
import { useState } from 'react';

export default () => {
    const [danhSach, setDanhSach] = useState<DuLich.IDiemDen[]>([]);
    const [loading, setLoading] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [record, setRecord] = useState<DuLich.IDiemDen | undefined>();
    const [filterLoai, setFilterLoai] = useState<DuLich.ELoaiDiemDen[]>([]);
    const [filterRating, setFilterRating] = useState<number>(0);
    const [filterGiaMin, setFilterGiaMin] = useState<number>(0);
    const [filterGiaMax, setFilterGiaMax] = useState<number>(10000000);
    const [sortBy, setSortBy] = useState<'rating' | 'giaTang' | 'giaGiam' | 'ten'>('rating');
    const [searchText, setSearchText] = useState<string>('');

    /** Tải danh sách và áp dụng filter/sort */
    const loadDanhSach = () => {
        setLoading(true);
        try {
            let data = getDiemDenList();

            // Filter theo loại
            if (filterLoai.length > 0) {
                data = data.filter((d) => filterLoai.includes(d.loai));
            }

            // Filter theo rating tối thiểu
            if (filterRating > 0) {
                data = data.filter((d) => d.rating >= filterRating);
            }

            // Filter theo giá lưu trú
            data = data.filter(
                (d) => d.chiPhiLuuTru >= filterGiaMin && d.chiPhiLuuTru <= filterGiaMax,
            );

            // Filter theo text search
            if (searchText) {
                data = data.filter(
                    (d) =>
                        d.ten.toLowerCase().includes(searchText.toLowerCase()) ||
                        d.diaChi.toLowerCase().includes(searchText.toLowerCase()),
                );
            }

            // Sort
            if (sortBy === 'rating') data = [...data].sort((a, b) => b.rating - a.rating);
            else if (sortBy === 'giaTang') data = [...data].sort((a, b) => a.chiPhiLuuTru - b.chiPhiLuuTru);
            else if (sortBy === 'giaGiam') data = [...data].sort((a, b) => b.chiPhiLuuTru - a.chiPhiLuuTru);
            else if (sortBy === 'ten') data = [...data].sort((a, b) => a.ten.localeCompare(b.ten));

            setDanhSach(data);
        } finally {
            setLoading(false);
        }
    };

    const themDiemDen = (data: Omit<DuLich.IDiemDen, 'id' | 'isCustom'>) => {
        saveDiemDen(data);
        loadDanhSach();
        setVisibleForm(false);
    };

    const suaDiemDen = (id: string, data: Partial<DuLich.IDiemDen>) => {
        updateDiemDen(id, data);
        loadDanhSach();
        setVisibleForm(false);
    };

    const xoaDiemDen = (id: string) => {
        deleteDiemDen(id);
        loadDanhSach();
    };

    const handleAdd = () => {
        setRecord(undefined);
        setVisibleForm(true);
    };

    const handleEdit = (rec: DuLich.IDiemDen) => {
        setRecord(rec);
        setVisibleForm(true);
    };

    return {
        danhSach,
        setDanhSach,
        loading,
        visibleForm,
        setVisibleForm,
        record,
        setRecord,
        filterLoai,
        setFilterLoai,
        filterRating,
        setFilterRating,
        filterGiaMin,
        setFilterGiaMin,
        filterGiaMax,
        setFilterGiaMax,
        sortBy,
        setSortBy,
        searchText,
        setSearchText,
        loadDanhSach,
        themDiemDen,
        suaDiemDen,
        xoaDiemDen,
        handleAdd,
        handleEdit,
    };
};
