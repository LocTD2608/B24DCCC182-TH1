/**
 * 📚 GIẢI THÍCH — TRANG CHÍNH (Page Component)
 *
 * Đây là trang hiển thị khi người dùng vào menu "Quản lý Sổ Văn Bằng".
 * Cấu trúc gồm 2 phần:
 *   1) Card phía trên: Chọn/tạo Sổ Văn Bằng theo năm
 *   2) Card phía dưới: Bảng danh sách văn bằng trong sổ đang chọn
 *
 * Component này chỉ LO HIỂN THỊ, logic nằm ở model (vanBang.ts).
 */
import React, { useEffect, useState } from 'react';
import {
    Card,
    Button,
    Select,
    Table,
    Modal,
    Popconfirm,
    InputNumber,
    Space,
    Tag,
    Typography,
    Row,
    Col,
    Tooltip,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    BookOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import FormVanBang from './FormVanBang';

const { Title, Text } = Typography;
const { Option } = Select;

const QuanLySoVanBangPage: React.FC = () => {
    /**
     * useModel: Kết nối tới model 'vanBang' để lấy dữ liệu & hàm xử lý.
     * Destructuring lấy ra các biến/hàm cần dùng.
     */
    const {
        dsSoVanBang,
        selectedSoVanBangId,
        setSelectedSoVanBangId,
        visible,
        setVisible,
        isEdit,
        setIsEdit,
        setCurrentVanBang,
        loadData,
        taoSoVanBang,
        getVanBangTheoSo,
        xoaVanBang,
    } = useModel('vanBang');

    /** State local: năm nhập để tạo sổ mới */
    const [namMoi, setNamMoi] = useState<number>(new Date().getFullYear());

    /**
     * useEffect với [] (dependency rỗng) → chạy 1 lần khi component mount.
     * Gọi loadData() để đọc data từ localStorage.
     */
    useEffect(() => {
        loadData();
    }, []);

    /** Lấy tên sổ đang chọn (dùng để hiển thị) */
    const soHienTai = dsSoVanBang.find((s) => s.id === selectedSoVanBangId);

    /**
     * Định nghĩa các cột cho bảng Ant Design Table.
     * Mỗi cột cần: title, dataIndex (tên field), và tùy chọn render.
     */
    const columns = [
        {
            title: 'Số vào sổ',
            dataIndex: 'soVaoSo',
            key: 'soVaoSo',
            width: 100,
            align: 'center' as const,
            render: (val: number) => <Tag color="blue">{val}</Tag>,
        },
        {
            title: 'Số hiệu VB',
            dataIndex: 'soHieuVanBang',
            key: 'soHieuVanBang',
            width: 150,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'hoTen',
            key: 'hoTen',
            width: 180,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'ngaySinh',
            key: 'ngaySinh',
            width: 120,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gioiTinh',
            key: 'gioiTinh',
            width: 90,
        },
        {
            title: 'Nơi sinh',
            dataIndex: 'noiSinh',
            key: 'noiSinh',
            width: 150,
        },
        {
            title: 'Dân tộc',
            dataIndex: 'danToc',
            key: 'danToc',
            width: 100,
        },
        {
            title: 'Xếp loại',
            dataIndex: 'xepLoai',
            key: 'xepLoai',
            width: 110,
            render: (val: string) => {
                const colorMap: Record<string, string> = {
                    'Xuất sắc': 'gold',
                    'Giỏi': 'green',
                    'Khá': 'cyan',
                    'Trung bình': 'default',
                };
                return <Tag color={colorMap[val] || 'default'}>{val}</Tag>;
            },
        },
        {
            title: 'Hệ đào tạo',
            dataIndex: 'heDaoTao',
            key: 'heDaoTao',
            width: 140,
        },
        {
            title: 'Năm TN',
            dataIndex: 'namTotNghiep',
            key: 'namTotNghiep',
            width: 90,
            align: 'center' as const,
        },
        {
            title: 'Ngày cấp',
            dataIndex: 'ngayCap',
            key: 'ngayCap',
            width: 120,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center' as const,
            render: (_: any, record: VanBang.VanBangRecord) => (
                <Space>
                    <Tooltip title="Sửa">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setIsEdit(true);
                                setCurrentVanBang(record);
                                setVisible(true);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa văn bằng này?"
                        onConfirm={() => xoaVanBang(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Tooltip title="Xóa">
                            <Button type="link" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* ====== PHẦN 1: Quản lý Sổ Văn Bằng ====== */}
            <Card style={{ marginBottom: 24 }}>
                <Title level={4}>
                    <BookOutlined /> Quản lý Sổ Văn Bằng
                </Title>

                <Row gutter={16} align="middle">
                    {/* Dropdown chọn sổ */}
                    <Col>
                        <Text strong>Chọn sổ: </Text>
                        <Select
                            value={selectedSoVanBangId}
                            onChange={(val) => setSelectedSoVanBangId(val)}
                            style={{ width: 200 }}
                            placeholder="Chọn sổ văn bằng"
                        >
                            {dsSoVanBang
                                .sort((a, b) => b.nam - a.nam) // Sắp xếp năm mới nhất lên trên
                                .map((so) => (
                                    <Option key={so.id} value={so.id}>
                                        Sổ năm {so.nam}
                                    </Option>
                                ))}
                        </Select>
                    </Col>

                    {/* Tạo sổ mới */}
                    <Col>
                        <Text strong>Tạo sổ mới: </Text>
                        <InputNumber
                            value={namMoi}
                            onChange={(val) => setNamMoi(val || new Date().getFullYear())}
                            min={2000}
                            max={2100}
                            style={{ width: 100 }}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => taoSoVanBang(namMoi)}
                            style={{ marginLeft: 8 }}
                        >
                            Tạo sổ
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* ====== PHẦN 2: Danh sách Văn Bằng trong sổ ====== */}
            <Card>
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Col>
                        <Title level={4} style={{ margin: 0 }}>
                            <FileTextOutlined />{' '}
                            {soHienTai
                                ? `Danh sách văn bằng — Sổ năm ${soHienTai.nam}`
                                : 'Chưa chọn sổ văn bằng'}
                        </Title>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            disabled={!selectedSoVanBangId}
                            onClick={() => {
                                setIsEdit(false);
                                setCurrentVanBang(undefined);
                                setVisible(true);
                            }}
                        >
                            Thêm văn bằng
                        </Button>
                    </Col>
                </Row>

                {/* Bảng hiển thị danh sách */}
                <Table
                    dataSource={getVanBangTheoSo()}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 1400 }}
                    pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng: ${total} văn bằng` }}
                    locale={{ emptyText: selectedSoVanBangId ? 'Chưa có văn bằng nào trong sổ này' : 'Vui lòng chọn hoặc tạo sổ văn bằng' }}
                />
            </Card>

            {/* ====== MODAL FORM ====== */}
            <Modal
                title={isEdit ? '✏️ Sửa văn bằng' : '➕ Thêm văn bằng mới'}
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
                destroyOnClose
                width={700}
            >
                <FormVanBang />
            </Modal>
        </div>
    );
};

export default QuanLySoVanBangPage;
