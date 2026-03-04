import React, { useState } from 'react';
import {
    Card, Table, Button, Modal, Form, Input, Space, Popconfirm, message, Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { KhoiKienThuc } from './types';

const { Title } = Typography;

const INITIAL_DATA: KhoiKienThuc[] = [
    { id: '1', maKhoi: 'TQ', tenKhoi: 'Tổng quan', moTa: 'Kiến thức tổng quan cơ bản' },
    { id: '2', maKhoi: 'CS', tenKhoi: 'Chuyên sâu', moTa: 'Kiến thức chuyên sâu nâng cao' },
    { id: '3', maKhoi: 'UNG', tenKhoi: 'Ứng dụng', moTa: 'Kiến thức ứng dụng thực tiễn' },
];

interface Props {
    khoiKienThucList: KhoiKienThuc[];
    setKhoiKienThucList: React.Dispatch<React.SetStateAction<KhoiKienThuc[]>>;
}

const KhoiKienThucTab: React.FC<Props> = ({ khoiKienThucList, setKhoiKienThucList }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<KhoiKienThuc | null>(null);
    const [form] = Form.useForm();

    const openAdd = () => {
        setEditingItem(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (item: KhoiKienThuc) => {
        setEditingItem(item);
        form.setFieldsValue(item);
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingItem) {
                setKhoiKienThucList(prev =>
                    prev.map(k => k.id === editingItem.id ? { ...k, ...values } : k)
                );
                message.success('Đã cập nhật khối kiến thức!');
            } else {
                if (khoiKienThucList.some(k => k.maKhoi === values.maKhoi)) {
                    message.error('Mã khối đã tồn tại!');
                    return;
                }
                const newItem: KhoiKienThuc = { id: Date.now().toString(), ...values };
                setKhoiKienThucList(prev => [...prev, newItem]);
                message.success('Đã thêm khối kiến thức mới!');
            }
            setModalOpen(false);
        } catch {
            // validation error
        }
    };

    const handleDelete = (id: string) => {
        setKhoiKienThucList(prev => prev.filter(k => k.id !== id));
        message.success('Đã xóa khối kiến thức!');
    };

    const columns = [
        {
            title: 'Mã khối',
            dataIndex: 'maKhoi',
            key: 'maKhoi',
            width: 120,
        },
        {
            title: 'Tên khối kiến thức',
            dataIndex: 'tenKhoi',
            key: 'tenKhoi',
        },
        {
            title: 'Mô tả',
            dataIndex: 'moTa',
            key: 'moTa',
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 140,
            render: (_: any, record: KhoiKienThuc) => (
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
                    <Title level={4} style={{ margin: 0 }}>Danh mục Khối Kiến Thức</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Thêm khối
                    </Button>
                </Space>
                <Table
                    dataSource={khoiKienThucList}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingItem ? 'Chỉnh sửa Khối Kiến Thức' : 'Thêm Khối Kiến Thức'}
                visible={modalOpen}
                onOk={handleSave}
                onCancel={() => setModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="maKhoi" label="Mã khối" rules={[{ required: true, message: 'Vui lòng nhập mã khối!' }]}>
                        <Input placeholder="VD: TQ" disabled={!!editingItem} />
                    </Form.Item>
                    <Form.Item name="tenKhoi" label="Tên khối kiến thức" rules={[{ required: true, message: 'Vui lòng nhập tên khối!' }]}>
                        <Input placeholder="VD: Tổng quan" />
                    </Form.Item>
                    <Form.Item name="moTa" label="Mô tả">
                        <Input.TextArea rows={3} placeholder="Mô tả về khối kiến thức..." />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export { INITIAL_DATA as INITIAL_KHOI_KIEN_THUC };
export default KhoiKienThucTab;
