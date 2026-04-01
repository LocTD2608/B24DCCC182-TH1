import React, { useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Rate,
    Popconfirm,
    Space,
    Tag,
    Typography,
    Card,
    Row,
    Col,
    message,
    Tooltip,
    Image,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import { LOAI_DIA_DIEM_LABEL } from '@/services/DuLich/constant';
import type { DuLich } from '@/services/DuLich/typing';
import './style.less';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const AdminDiemDen: React.FC = () => {
    const {
        danhSach,
        loading,
        visibleForm,
        setVisibleForm,
        record,
        setRecord,
        searchText,
        setSearchText,
        loadDanhSach,
        themDiemDen,
        suaDiemDen,
        xoaDiemDen,
        handleAdd,
        handleEdit,
    } = useModel('dulichDiemDen');

    const [form] = Form.useForm();

    useEffect(() => {
        loadDanhSach();
    }, []);

    useEffect(() => {
        if (visibleForm && record) {
            form.setFieldsValue(record);
        } else if (visibleForm && !record) {
            form.resetFields();
        }
    }, [visibleForm, record]);

    const handleSubmit = async () => {
        try {
            const vals = await form.validateFields();
            if (record) {
                suaDiemDen(record.id, vals);
                message.success('Đã cập nhật điểm đến!');
            } else {
                themDiemDen({ ...vals, luotXem: 0 });
                message.success('Đã thêm điểm đến mới!');
            }
            form.resetFields();
        } catch {
            // form validation error
        }
    };

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'hinhAnh',
            width: 80,
            render: (src: string, row: DuLich.IDiemDen) => (
                <Image
                    src={src}
                    width={60}
                    height={50}
                    style={{ borderRadius: 8, objectFit: 'cover' }}
                    fallback="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100"
                    preview={{ src }}
                />
            ),
        },
        {
            title: 'Tên điểm đến',
            dataIndex: 'ten',
            sorter: (a: DuLich.IDiemDen, b: DuLich.IDiemDen) => a.ten.localeCompare(b.ten),
            render: (ten: string, row: DuLich.IDiemDen) => (
                <div>
                    <Text strong>{ten}</Text>
                    <div style={{ fontSize: 12, color: '#888' }}>{row.diaChi}</div>
                </div>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'loai',
            filters: [
                { text: '🏖️ Biển', value: 'BIEN' },
                { text: '⛰️ Núi', value: 'NUI' },
                { text: '🏙️ Thành phố', value: 'THANH_PHO' },
            ],
            onFilter: (value: any, record: DuLich.IDiemDen) => record.loai === value,
            render: (loai: DuLich.ELoaiDiemDen) => (
                <Tag color={loai === 'BIEN' ? 'blue' : loai === 'NUI' ? 'green' : 'purple'}>
                    {LOAI_DIA_DIEM_LABEL[loai]}
                </Tag>
            ),
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a: DuLich.IDiemDen, b: DuLich.IDiemDen) => a.rating - b.rating,
            render: (r: number) => <Rate disabled value={r} allowHalf style={{ fontSize: 14 }} />,
        },
        {
            title: 'Lưu trú (đêm)',
            dataIndex: 'chiPhiLuuTru',
            sorter: (a: DuLich.IDiemDen, b: DuLich.IDiemDen) => a.chiPhiLuuTru - b.chiPhiLuuTru,
            render: (v: number) => <Text style={{ color: '#1890ff' }}>{formatCurrency(v)}</Text>,
        },
        {
            title: 'Ăn uống (ngày)',
            dataIndex: 'chiPhiAn',
            render: (v: number) => <Text style={{ color: '#52c41a' }}>{formatCurrency(v)}</Text>,
        },
        {
            title: 'Di chuyển',
            dataIndex: 'chiPhiDiChuyen',
            render: (v: number) => formatCurrency(v),
        },
        {
            title: 'Thời gian (h)',
            dataIndex: 'thoiGianThamQuan',
            render: (v: number) => `${v} giờ`,
        },
        {
            title: 'Thao tác',
            width: 100,
            fixed: 'right' as const,
            render: (_: any, row: DuLich.IDiemDen) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(row)} />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa điểm đến này?"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => {
                            xoaDiemDen(row.id);
                            message.success('Đã xóa điểm đến!');
                        }}
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="admin-diem-den-page">
            <Card className="admin-card">
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Col>
                        <Title level={4} style={{ marginBottom: 0 }}>
                            🗺️ Quản lý điểm đến
                        </Title>
                        <Text type="secondary">Tổng: {danhSach.length} địa điểm</Text>
                    </Col>
                    <Col>
                        <Space>
                            <Input.Search
                                placeholder="Tìm theo tên, địa chỉ..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onSearch={loadDanhSach}
                                allowClear
                                style={{ width: 240 }}
                            />
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                                Thêm điểm đến
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={danhSach}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1000 }}
                    pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (t) => `Tổng ${t} điểm đến` }}
                    rowClassName={(_, i) => (i % 2 === 0 ? 'row-even' : '')}
                />
            </Card>

            {/* Modal Thêm/Sửa */}
            <Modal
                title={record ? '✏️ Chỉnh sửa điểm đến' : '➕ Thêm điểm đến mới'}
                visible={visibleForm}
                onCancel={() => { setVisibleForm(false); form.resetFields(); setRecord(undefined); }}
                onOk={handleSubmit}
                okText={record ? 'Lưu thay đổi' : 'Thêm mới'}
                cancelText="Hủy"
                width={700}
                destroyOnClose
            >
                <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
                    <Row gutter={16}>
                        <Col xs={24} sm={14}>
                            <Form.Item
                                name="ten"
                                label="Tên điểm đến"
                                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                            >
                                <Input placeholder="VD: Đà Nẵng, Hội An..." />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={10}>
                            <Form.Item
                                name="loai"
                                label="Loại hình"
                                rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
                            >
                                <Select placeholder="Chọn loại">
                                    <Option value="BIEN">🏖️ Biển</Option>
                                    <Option value="NUI">⛰️ Núi</Option>
                                    <Option value="THANH_PHO">🏙️ Thành phố</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="diaChi" label="Địa chỉ" rules={[{ required: true }]}>
                        <Input placeholder="VD: Quảng Nam, Việt Nam" />
                    </Form.Item>

                    <Form.Item name="hinhAnh" label="URL hình ảnh" rules={[{ required: true }]}>
                        <Input placeholder="https://images.unsplash.com/..." />
                    </Form.Item>

                    <Form.Item name="moTa" label="Mô tả">
                        <TextArea rows={3} placeholder="Mô tả ngắn về điểm đến..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={12} sm={8}>
                            <Form.Item name="rating" label="Đánh giá" rules={[{ required: true }]}>
                                <InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={12} sm={8}>
                            <Form.Item name="thoiGianThamQuan" label="Thời gian tham quan (giờ)" rules={[{ required: true }]}>
                                <InputNumber min={1} max={720} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={8}>
                            <Form.Item name="chiPhiAn" label="Chi phí ăn uống (VNĐ/ngày)" rules={[{ required: true }]}>
                                <InputNumber min={0} step={50000} style={{ width: '100%' }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item name="chiPhiLuuTru" label="Chi phí lưu trú (VNĐ/đêm)" rules={[{ required: true }]}>
                                <InputNumber min={0} step={100000} style={{ width: '100%' }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item name="chiPhiDiChuyen" label="Chi phí di chuyển (VNĐ)" rules={[{ required: true }]}>
                                <InputNumber min={0} step={100000} style={{ width: '100%' }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminDiemDen;
