import React, { useState } from 'react';
import {
    Card, Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message, Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { MonHoc } from './types';

const { Title } = Typography;

const INITIAL_DATA: MonHoc[] = [
    { id: '1', maMon: 'CNTT101', tenMon: 'Nhập môn Công nghệ Thông tin', soTinChi: 3 },
    { id: '2', maMon: 'CTDL201', tenMon: 'Cấu trúc Dữ liệu & Giải thuật', soTinChi: 4 },
    { id: '3', maMon: 'CSDL301', tenMon: 'Cơ sở Dữ liệu', soTinChi: 3 },
    { id: '4', maMon: 'LT401', tenMon: 'Lập trình Hướng Đối tượng', soTinChi: 4 },
];

interface Props {
    monHocList: MonHoc[];
    setMonHocList: React.Dispatch<React.SetStateAction<MonHoc[]>>;
}

const MonHocTab: React.FC<Props> = ({ monHocList, setMonHocList }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MonHoc | null>(null);
    const [form] = Form.useForm();

    const openAdd = () => {
        setEditingItem(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (item: MonHoc) => {
        setEditingItem(item);
        form.setFieldsValue(item);
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingItem) {
                setMonHocList(prev =>
                    prev.map(m => m.id === editingItem.id ? { ...m, ...values } : m)
                );
                message.success('Đã cập nhật môn học!');
            } else {
                if (monHocList.some(m => m.maMon === values.maMon)) {
                    message.error('Mã môn đã tồn tại!');
                    return;
                }
                const newItem: MonHoc = { id: Date.now().toString(), ...values };
                setMonHocList(prev => [...prev, newItem]);
                message.success('Đã thêm môn học mới!');
            }
            setModalOpen(false);
        } catch {
            // validation error
        }
    };

    const handleDelete = (id: string) => {
        setMonHocList(prev => prev.filter(m => m.id !== id));
        message.success('Đã xóa môn học!');
    };

    const columns = [
        {
            title: 'Mã môn',
            dataIndex: 'maMon',
            key: 'maMon',
            width: 130,
        },
        {
            title: 'Tên môn học',
            dataIndex: 'tenMon',
            key: 'tenMon',
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'soTinChi',
            key: 'soTinChi',
            width: 110,
            align: 'center' as const,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 140,
            render: (_: any, record: MonHoc) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa" cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card>
                <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Title level={4} style={{ margin: 0 }}>Danh mục Môn Học</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Thêm môn học
                    </Button>
                </Space>
                <Table
                    dataSource={monHocList}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingItem ? 'Chỉnh sửa Môn Học' : 'Thêm Môn Học'}
                visible={modalOpen}
                onOk={handleSave}
                onCancel={() => setModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="maMon" label="Mã môn" rules={[{ required: true, message: 'Vui lòng nhập mã môn!' }]}>
                        <Input placeholder="VD: CNTT101" disabled={!!editingItem} />
                    </Form.Item>
                    <Form.Item name="tenMon" label="Tên môn học" rules={[{ required: true, message: 'Vui lòng nhập tên môn!' }]}>
                        <Input placeholder="VD: Nhập môn Công nghệ Thông tin" />
                    </Form.Item>
                    <Form.Item name="soTinChi" label="Số tín chỉ" rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}>
                        <InputNumber min={1} max={10} style={{ width: '100%' }} placeholder="3" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export { INITIAL_DATA as INITIAL_MON_HOC };
export default MonHocTab;
