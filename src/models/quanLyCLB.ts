import { changeClub, getClubs, getMembersByClub } from '@/services/QuanLyCLB';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
    const [clubs, setClubs] = useState<QuanLyCLB.Club[]>([]);
    const [members, setMembers] = useState<QuanLyCLB.Member[]>([]);
    const [selectedClubId, setSelectedClubId] = useState<string>('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [changeClubModalVisible, setChangeClubModalVisible] = useState<boolean>(false);

    /** Lấy danh sách CLB và tự động chọn CLB đầu tiên */
    const fetchClubs = () => {
        const data = getClubs();
        setClubs(data);
        if (data.length > 0 && !selectedClubId) {
            setSelectedClubId(data[0].id);
            fetchMembers(data[0].id);
        }
    };

    /** Lấy danh sách thành viên Approved theo CLB */
    const fetchMembers = (clubId?: string) => {
        const id = clubId || selectedClubId;
        if (!id) return;
        const data = getMembersByClub(id);
        setMembers(data);
        setSelectedRowKeys([]);
    };

    /** Chọn CLB khác để xem */
    const handleSelectClub = (clubId: string) => {
        setSelectedClubId(clubId);
        fetchMembers(clubId);
    };

    /** Mở modal chuyển CLB */
    const openChangeClubModal = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Vui lòng chọn ít nhất 1 thành viên');
            return;
        }
        setChangeClubModalVisible(true);
    };

    /** Xử lý chuyển CLB */
    const handleChangeClub = (newClubId: string) => {
        changeClub(selectedRowKeys, newClubId);
        setChangeClubModalVisible(false);
        message.success(`Đã chuyển ${selectedRowKeys.length} thành viên sang CLB mới`);
        fetchMembers();
    };

    return {
        clubs,
        members,
        selectedClubId,
        selectedRowKeys,
        setSelectedRowKeys,
        changeClubModalVisible,
        setChangeClubModalVisible,
        fetchClubs,
        fetchMembers,
        handleSelectClub,
        openChangeClubModal,
        handleChangeClub,
    };
};
