/**
 * 📚 GIẢI THÍCH — MODEL (Quản lý State)
 *
 * Trong UmiJS, "model" là nơi chứa DỮ LIỆU (state) và LOGIC xử lý.
 * - `useState` tạo ra biến state + hàm cập nhật
 * - Các hàm bên trong model chứa logic nghiệp vụ (CRUD)
 * - `useModel('vanBang')` ở bất kỳ component nào đều truy cập được data này
 *
 * Pattern: Model export 1 function trả về { state, actions }
 * → Component dùng useModel('tênFile') để lấy ra.
 */
import { useState } from 'react';
import { message } from 'antd';

// Key lưu trong localStorage
const SO_VAN_BANG_KEY = 'dsSoVanBang';
const VAN_BANG_KEY = 'dsVanBang';

/**
 * Đọc dữ liệu từ localStorage.
 * JSON.parse chuyển chuỗi → object. Nếu chưa có thì trả về [].
 */
const loadFromStorage = <T>(key: string): T[] => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

/** Ghi dữ liệu vào localStorage. JSON.stringify chuyển object → chuỗi. */
const saveToStorage = <T>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
};

/** Tạo ID duy nhất đơn giản dựa trên timestamp */
const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).slice(2);

export default () => {
    // ==================== STATE ====================

    /** Danh sách tất cả Sổ Văn Bằng */
    const [dsSoVanBang, setDsSoVanBang] = useState<VanBang.SoVanBang[]>([]);

    /** Danh sách tất cả Văn Bằng (của mọi sổ) */
    const [dsVanBang, setDsVanBang] = useState<VanBang.VanBangRecord[]>([]);

    /** Sổ Văn Bằng đang được chọn để xem */
    const [selectedSoVanBangId, setSelectedSoVanBangId] = useState<string | null>(null);

    /** Hiện/ẩn Modal form thêm/sửa */
    const [visible, setVisible] = useState<boolean>(false);

    /** Đang ở chế độ Sửa hay Thêm mới? */
    const [isEdit, setIsEdit] = useState<boolean>(false);

    /** Văn bằng đang được sửa (nếu isEdit = true) */
    const [currentVanBang, setCurrentVanBang] = useState<VanBang.VanBangRecord | undefined>();

    // ==================== LOAD DATA ====================

    /** Đọc data từ localStorage khi component mount */
    const loadData = () => {
        const soList = loadFromStorage<VanBang.SoVanBang>(SO_VAN_BANG_KEY);
        const vbList = loadFromStorage<VanBang.VanBangRecord>(VAN_BANG_KEY);
        setDsSoVanBang(soList);
        setDsVanBang(vbList);

        // Tự chọn sổ đầu tiên nếu có
        if (soList.length > 0 && !selectedSoVanBangId) {
            setSelectedSoVanBangId(soList[0].id);
        }
    };

    // ==================== SỔ VĂN BẰNG ====================

    /**
     * Tạo Sổ Văn Bằng mới cho 1 năm.
     * Kiểm tra: không cho tạo trùng năm.
     */
    const taoSoVanBang = (nam: number) => {
        const exists = dsSoVanBang.find((s) => s.nam === nam);
        if (exists) {
            message.error(`Sổ văn bằng năm ${nam} đã tồn tại!`);
            return false;
        }

        const soMoi: VanBang.SoVanBang = {
            id: generateId(),
            nam,
            ngayTao: new Date().toISOString(),
        };

        const newList = [soMoi, ...dsSoVanBang];
        setDsSoVanBang(newList);
        saveToStorage(SO_VAN_BANG_KEY, newList);
        setSelectedSoVanBangId(soMoi.id);
        message.success(`Đã tạo sổ văn bằng năm ${nam}`);
        return true;
    };

    // ==================== VĂN BẰNG ====================

    /**
     * Lấy danh sách văn bằng thuộc sổ đang chọn.
     * `.filter()` lọc ra những VB có soVanBangId trùng với sổ đang chọn.
     */
    const getVanBangTheoSo = (): VanBang.VanBangRecord[] => {
        if (!selectedSoVanBangId) return [];
        return dsVanBang
            .filter((vb) => vb.soVanBangId === selectedSoVanBangId)
            .sort((a, b) => a.soVaoSo - b.soVaoSo);
    };

    /**
     * 🔑 LOGIC QUAN TRỌNG: Tính số vào sổ tiếp theo.
     * Lấy max soVaoSo trong sổ hiện tại + 1.
     * Nếu sổ mới (chưa có VB nào) → bắt đầu từ 1.
     */
    const getSoVaoSoTiepTheo = (): number => {
        const vbTrongSo = getVanBangTheoSo();
        if (vbTrongSo.length === 0) return 1;
        return Math.max(...vbTrongSo.map((vb) => vb.soVaoSo)) + 1;
    };

    /** Thêm văn bằng mới vào sổ đang chọn */
    const themVanBang = (data: Omit<VanBang.VanBangRecord, 'id' | 'soVaoSo' | 'soVanBangId'>) => {
        if (!selectedSoVanBangId) {
            message.error('Vui lòng chọn sổ văn bằng trước!');
            return;
        }

        // Kiểm tra trùng số hiệu văn bằng
        const trung = dsVanBang.find((vb) => vb.soHieuVanBang === data.soHieuVanBang);
        if (trung) {
            message.error('Số hiệu văn bằng đã tồn tại!');
            return;
        }

        const vbMoi: VanBang.VanBangRecord = {
            ...data,
            id: generateId(),
            soVaoSo: getSoVaoSoTiepTheo(),
            soVanBangId: selectedSoVanBangId,
        };

        const newList = [...dsVanBang, vbMoi];
        setDsVanBang(newList);
        saveToStorage(VAN_BANG_KEY, newList);
        message.success('Đã thêm văn bằng!');
        setVisible(false);
    };

    /** Sửa thông tin văn bằng */
    const suaVanBang = (id: string, data: Partial<VanBang.VanBangRecord>) => {
        // Kiểm tra trùng số hiệu (trừ chính nó)
        if (data.soHieuVanBang) {
            const trung = dsVanBang.find((vb) => vb.soHieuVanBang === data.soHieuVanBang && vb.id !== id);
            if (trung) {
                message.error('Số hiệu văn bằng đã tồn tại!');
                return;
            }
        }

        const newList = dsVanBang.map((vb) => (vb.id === id ? { ...vb, ...data } : vb));
        setDsVanBang(newList);
        saveToStorage(VAN_BANG_KEY, newList);
        message.success('Đã cập nhật văn bằng!');
        setVisible(false);
    };

    /** Xóa văn bằng */
    const xoaVanBang = (id: string) => {
        const newList = dsVanBang.filter((vb) => vb.id !== id);
        setDsVanBang(newList);
        saveToStorage(VAN_BANG_KEY, newList);
        message.success('Đã xóa văn bằng!');
    };

    // ==================== RETURN ====================
    // Trả về tất cả state + actions để component dùng qua useModel('vanBang')

    return {
        // State
        dsSoVanBang,
        dsVanBang,
        selectedSoVanBangId,
        setSelectedSoVanBangId,
        visible,
        setVisible,
        isEdit,
        setIsEdit,
        currentVanBang,
        setCurrentVanBang,

        // Actions
        loadData,
        taoSoVanBang,
        getVanBangTheoSo,
        getSoVaoSoTiepTheo,
        themVanBang,
        suaVanBang,
        xoaVanBang,
    };
};
