import { Modal, Select, Typography } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const { Text } = Typography;

interface ChangeClubModalProps {
    visible: boolean;
    selectedCount: number;
    currentClubId: string;
    onCancel: () => void;
    onOk: (newClubId: string) => void;
}

const ChangeClubModal: React.FC<ChangeClubModalProps> = ({
    visible,
    selectedCount,
    currentClubId,
    onCancel,
    onOk,
}) => {
    const { clubs } = useModel('quanLyCLB');
    const [targetClubId, setTargetClubId] = useState<string>('');

    /** Danh sách CLB đích — loại trừ CLB hiện tại */
    const availableClubs = clubs.filter((c: QuanLyCLB.Club) => c.id !== currentClubId);

    const handleOk = () => {
        if (!targetClubId) return;
        onOk(targetClubId);
        setTargetClubId('');
    };

    const handleCancel = () => {
        setTargetClubId('');
        onCancel();
    };

    return (
        <Modal
            title='Chuyển Câu lạc bộ'
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText='Xác nhận'
            cancelText='Hủy'
            okButtonProps={{ disabled: !targetClubId }}
            destroyOnClose
        >
            <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 15 }}>
                    Chuyển CLB cho <Text type='danger' strong style={{ fontSize: 16 }}>{selectedCount}</Text> thành viên
                </Text>
            </div>

            <div>
                <Text style={{ display: 'block', marginBottom: 8 }}>Chọn CLB muốn chuyển đến:</Text>
                <Select
                    style={{ width: '100%' }}
                    placeholder='-- Chọn Câu lạc bộ --'
                    value={targetClubId || undefined}
                    onChange={(val) => setTargetClubId(val)}
                >
                    {availableClubs.map((club: QuanLyCLB.Club) => (
                        <Select.Option key={club.id} value={club.id}>
                            {club.name}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        </Modal>
    );
};

export default ChangeClubModal;
