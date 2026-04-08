import React, { useState } from 'react';
import {
    Card, Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag, Typography, Row, Col
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { CauHoi, KhoiKienThuc, MonHoc, MucDoKho } from './types';
import { MUC_DO_KHO_OPTIONS, MUC_DO_KHO_COLOR } from './types';

const { Title } = Typography;
const { TextArea } = Input;

const INITIAL_DATA: CauHoi[] = [
    { id: '1', maCauHoi: 'CH001', monHocId: '1', noiDung: 'Trình bày khái niệm về hệ điều hành và các chức năng cơ bản?', mucDoKho: 'Dễ', khoiKienThucId: '1' },
    { id: '2', maCauHoi: 'CH002', monHocId: '1', noiDung: 'Phân biệt phần mềm và phần cứng, cho ví dụ minh họa?', mucDoKho: 'Dễ', khoiKienThucId: '1' },
    { id: '3', maCauHoi: 'CH003', monHocId: '2', noiDung: 'Trình bày và phân tích độ phức tạp của thuật toán sắp xếp nhanh (Quick Sort)?', mucDoKho: 'Khó', khoiKienThucId: '2' },
    { id: '4', maCauHoi: 'CH004', monHocId: '2', noiDung: 'So sánh cấu trúc dữ liệu Stack và Queue. Cho ví dụ ứng dụng?', mucDoKho: 'Trung bình', khoiKienThucId: '1' },
    { id: '5', maCauHoi: 'CH005', monHocId: '3', noiDung: 'Trình bày các dạng chuẩn hóa cơ sở dữ liệu (1NF, 2NF, 3NF)?', mucDoKho: 'Trung bình', khoiKienThucId: '2' },
    { id: '6', maCauHoi: 'CH006', monHocId: '3', noiDung: 'Phân tích và thiết kế cơ sở dữ liệu cho hệ thống quản lý sinh viên?', mucDoKho: 'Rất khó', khoiKienThucId: '3' },
    { id: '7', maCauHoi: 'CH007', monHocId: '4', noiDung: 'Trình bày khái niệm đóng gói (Encapsulation) trong lập trình hướng đối tượng?', mucDoKho: 'Dễ', khoiKienThucId: '1' },
    { id: '8', maCauHoi: 'CH008', monHocId: '4', noiDung: 'Phân tích và so sánh kế thừa đơn và kế thừa đa trong OOP?', mucDoKho: 'Khó', khoiKienThucId: '2' },
];

interface Props {
    cauHoiList: CauHoi[];
    setCauHoiList: React.Dispatch<React.SetStateAction<CauHoi[]>>;
    monHocList: MonHoc[];
    khoiKienThucList: KhoiKienThuc[];
}

const CauHoiTab: React.FC<Props> = ({ cauHoiList, setCauHoiList, monHocList, khoiKienThucList }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CauHoi | null>(null);
    const [form] = Form.useForm();
    const [filterMonHoc, setFilterMonHoc] = useState<string | undefined>(undefined);
    const [filterMucDo, setFilterMucDo] = useState<MucDoKho | undefined>(undefined);
    const [filterKhoi, setFilterKhoi] = useState<string | undefined>(undefined);

    const getMonHocName = (id: string) => monHocList.find(m => m.id === id)?.tenMon || id;
    const getKhoiName = (id: string) => khoiKienThucList.find(k => k.id === id)?.tenKhoi || id;

    const filteredData = cauHoiList.filter(c => {
        if (filterMonHoc && c.monHocId !== filterMonHoc) return false;
        if (filterMucDo && c.mucDoKho !== filterMucDo) return false;
        if (filterKhoi && c.khoiKienThucId !== filterKhoi) return false;
        return true;
    });

    const openAdd = () => {
        setEditingItem(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (item: CauHoi) => {
        setEditingItem(item);
        form.setFieldsValue(item);
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingItem) {
                setCauHoiList(prev =>
                    prev.map(c => c.id === editingItem.id ? { ...c, ...values } : c)
                );
                message.success('Đã cập nhật câu hỏi!');
            } else {
                if (cauHoiList.some(c => c.maCauHoi === values.maCauHoi)) {
                    message.error('Mã câu hỏi đã tồn tại!');
                    return;
                }
                const newItem: CauHoi = { id: Date.now().toString(), ...values };
                setCauHoiList(prev => [...prev, newItem]);
                message.success('Đã thêm câu hỏi mới!');
            }
            setModalOpen(false);
        } catch {
            // validation error
        }
    };

    const handleDelete = (id: string) => {
        setCauHoiList(prev => prev.filter(c => c.id !== id));
        message.success('Đã xóa câu hỏi!');
    };

    const columns = [
        {
            title: 'Mã CH',
            dataIndex: 'maCauHoi',
            key: 'maCauHoi',
            width: 90,
        },
        {
            title: 'Môn học',
            dataIndex: 'monHocId',
            key: 'monHocId',
            width: 180,
            render: (id: string) => getMonHocName(id),
        },
        {
            title: 'Nội dung câu hỏi',
            dataIndex: 'noiDung',
            key: 'noiDung',
            ellipsis: true,
        },
        {
            title: 'Mức độ khó',
            dataIndex: 'mucDoKho',
            key: 'mucDoKho',
            width: 120,
            render: (muc: MucDoKho) => <Tag color={MUC_DO_KHO_COLOR[muc]}>{muc}</Tag>,
        },
        {
            title: 'Khối KT',
            dataIndex: 'khoiKienThucId',
            key: 'khoiKienThucId',
            width: 120,
            render: (id: string) => getKhoiName(id),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            render: (_: any, record: CauHoi) => (
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
                    <Title level={4} style={{ margin: 0 }}>Quản lý Ngân hàng Câu Hỏi</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Thêm câu hỏi
                    </Button>
                </Space>

                {/* Bộ lọc */}
                <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
                    <Row gutter={12} align="middle">
                        <Col flex="none">
                            <SearchOutlined style={{ color: '#1677ff' }} /> <strong>Tìm kiếm:</strong>
                        </Col>
                        <Col flex={1}>
                            <Select
                                placeholder="Lọc theo môn học"
                                allowClear
                                style={{ width: '100%' }}
                                value={filterMonHoc}
                                onChange={setFilterMonHoc}
                                options={monHocList.map(m => ({ value: m.id, label: m.tenMon }))}
                            />
                        </Col>
                        <Col flex={1}>
                            <Select
                                placeholder="Lọc theo mức độ khó"
                                allowClear
                                style={{ width: '100%' }}
                                value={filterMucDo}
                                onChange={setFilterMucDo}
                                options={MUC_DO_KHO_OPTIONS.map(m => ({ value: m, label: m }))}
                            />
                        </Col>
                        <Col flex={1}>
                            <Select
                                placeholder="Lọc theo khối kiến thức"
                                allowClear
                                style={{ width: '100%' }}
                                value={filterKhoi}
                                onChange={setFilterKhoi}
                                options={khoiKienThucList.map(k => ({ value: k.id, label: k.tenKhoi }))}
                            />
                        </Col>
                    </Row>
                </Card>

                <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 8 }}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={6}>
                                <strong>Tổng: {filteredData.length} câu hỏi</strong>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Card>

            <Modal
                title={editingItem ? 'Chỉnh sửa Câu Hỏi' : 'Thêm Câu Hỏi'}
                visible={modalOpen}
                onOk={handleSave}
                onCancel={() => setModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
                width={640}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name="maCauHoi" label="Mã câu hỏi" rules={[{ required: true, message: 'Bắt buộc!' }]}>
                                <Input placeholder="VD: CH001" disabled={!!editingItem} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="monHocId" label="Môn học" rules={[{ required: true, message: 'Bắt buộc!' }]}>
                                <Select
                                    placeholder="Chọn môn học"
                                    options={monHocList.map(m => ({ value: m.id, label: m.tenMon }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="noiDung" label="Nội dung câu hỏi" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                        <TextArea rows={4} placeholder="Nhập nội dung câu hỏi tự luận..." />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name="mucDoKho" label="Mức độ khó" rules={[{ required: true, message: 'Bắt buộc!' }]}>
                                <Select
                                    placeholder="Chọn mức độ"
                                    options={MUC_DO_KHO_OPTIONS.map(m => ({ value: m, label: m }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="khoiKienThucId" label="Khối kiến thức" rules={[{ required: true, message: 'Bắt buộc!' }]}>
                                <Select
                                    placeholder="Chọn khối kiến thức"
                                    options={khoiKienThucList.map(k => ({ value: k.id, label: k.tenKhoi }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export { INITIAL_DATA as INITIAL_CAU_HOI };
export default CauHoiTab;
