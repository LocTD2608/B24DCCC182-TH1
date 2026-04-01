import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Card,
    Button,
    Input,
    InputNumber,
    DatePicker,
    Collapse,
    List,
    Tag,
    Modal,
    Empty,
    Typography,
    Space,
    Divider,
    Popconfirm,
    message,
    Statistic,
    Form,
    Badge,
    Alert,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    SaveOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    EditOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import { getDiemDenList } from '@/services/DuLich';
import type { DuLich } from '@/services/DuLich/typing';
import { LOAI_DIA_DIEM_LABEL } from '@/services/DuLich/constant';
import './style.less';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const LichTrinh: React.FC = () => {
    const {
        danhSachLichTrinh,
        lichTrinhHienTai,
        setLichTrinhHienTai,
        loadDanhSachLichTrinh,
        khoiTaoLichTrinhMoi,
        capNhatSoNgay,
        themDiemDenVaoNgay,
        xoaDiemDenKhoiNgay,
        sapXepDiemDen,
        luuLichTrinh,
        suaLichTrinh,
        xoaLichTrinh,
        chonDiemDenVisible,
        setChonDiemDenVisible,
        ngayDangChon,
        setNgayDangChon,
    } = useModel('dulichLichTrinh');

    const [allDiemDen, setAllDiemDen] = useState<DuLich.IDiemDen[]>([]);
    const [searchModal, setSearchModal] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        loadDanhSachLichTrinh();
        khoiTaoLichTrinhMoi();
        setAllDiemDen(getDiemDenList());
    }, []);

    const tongChiPhi = () => {
        if (!lichTrinhHienTai.danhSachNgay) return 0;
        return lichTrinhHienTai.danhSachNgay.reduce((acc, ngay) => {
            return (
                acc +
                ngay.danhSachDiem.reduce((a, d) => {
                    return a + d.diemDen.chiPhiAn + d.diemDen.chiPhiLuuTru + d.diemDen.chiPhiDiChuyen;
                }, 0)
            );
        }, 0);
    };

    const tongThoiGian = () => {
        if (!lichTrinhHienTai.danhSachNgay) return 0;
        return lichTrinhHienTai.danhSachNgay.reduce((acc, ngay) => {
            return acc + ngay.danhSachDiem.reduce((a, d) => a + d.diemDen.thoiGianThamQuan, 0);
        }, 0);
    };

    const handleMoDanhSachDiemDen = (soNgay: number) => {
        setNgayDangChon(soNgay);
        setChonDiemDenVisible(true);
    };

    const handleLuuLichTrinh = () => {
        if (!lichTrinhHienTai.tenLichTrinh) {
            message.warning('Vui lòng nhập tên lịch trình!');
            return;
        }
        luuLichTrinh();
        message.success('Đã lưu lịch trình thành công!');
    };

    const filteredDiemDen = allDiemDen.filter(
        (d) =>
            d.ten.toLowerCase().includes(searchModal.toLowerCase()) ||
            d.diaChi.toLowerCase().includes(searchModal.toLowerCase()),
    );

    const chiPhiUocTinh = tongChiPhi();
    const vuotNganSach =
        lichTrinhHienTai.nganSachTong !== undefined && chiPhiUocTinh > lichTrinhHienTai.nganSachTong;

    return (
        <div className="lich-trinh-page">
            <Row gutter={[20, 20]}>
                {/* Left: Danh sách lịch trình đã lưu */}
                <Col xs={24} md={7} lg={6}>
                    <Card
                        title={
                            <Space>
                                <CalendarOutlined />
                                <span>Lịch trình đã lưu</span>
                                <Badge count={danhSachLichTrinh.length} style={{ backgroundColor: '#1890ff' }} />
                            </Space>
                        }
                        className="saved-list-card"
                        extra={
                            <Button size="small" onClick={() => { khoiTaoLichTrinhMoi(); form.resetFields(); }}>
                                Tạo mới
                            </Button>
                        }
                    >
                        {danhSachLichTrinh.length === 0 ? (
                            <Empty description="Chưa có lịch trình nào" imageStyle={{ height: 60 }} />
                        ) : (
                            <List
                                dataSource={danhSachLichTrinh}
                                renderItem={(lt) => (
                                    <List.Item
                                        key={lt.id}
                                        actions={[
                                            <Button
                                                key="edit"
                                                size="small"
                                                icon={<EditOutlined />}
                                                onClick={() => suaLichTrinh(lt)}
                                                type="link"
                                            />,
                                            <Popconfirm
                                                key="del"
                                                title="Xóa lịch trình này?"
                                                onConfirm={() => xoaLichTrinh(lt.id)}
                                            >
                                                <Button size="small" icon={<DeleteOutlined />} type="link" danger />
                                            </Popconfirm>,
                                        ]}
                                        style={{ padding: '8px 0' }}
                                    >
                                        <List.Item.Meta
                                            title={<Text strong style={{ fontSize: 13 }}>{lt.tenLichTrinh}</Text>}
                                            description={
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {lt.soNgay} ngày · {formatCurrency(lt.nganSachTong)}
                                                </Text>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </Col>

                {/* Right: Builder lịch trình */}
                <Col xs={24} md={17} lg={18}>
                    <Card className="builder-card">
                        {/* Header Form */}
                        <div className="builder-header">
                            <Title level={4} style={{ marginBottom: 16 }}>
                                🗺️ Xây dựng lịch trình
                            </Title>
                            <Row gutter={[16, 12]}>
                                <Col xs={24} sm={12} md={8}>
                                    <Text strong>Tên lịch trình</Text>
                                    <Input
                                        placeholder="VD: Du lịch Đà Nẵng 3 ngày"
                                        value={lichTrinhHienTai.tenLichTrinh}
                                        onChange={(e) =>
                                            setLichTrinhHienTai((prev) => ({ ...prev, tenLichTrinh: e.target.value }))
                                        }
                                        style={{ marginTop: 4 }}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={4}>
                                    <Text strong>Số ngày</Text>
                                    <InputNumber
                                        min={1}
                                        max={30}
                                        value={lichTrinhHienTai.soNgay}
                                        onChange={(v) => capNhatSoNgay(v ?? 1)}
                                        style={{ width: '100%', marginTop: 4 }}
                                    />
                                </Col>
                                <Col xs={12} sm={6} md={5}>
                                    <Text strong>Ngày bắt đầu</Text>
                                    <DatePicker
                                        style={{ width: '100%', marginTop: 4 }}
                                        placeholder="Chọn ngày"
                                        onChange={(d) =>
                                            setLichTrinhHienTai((prev) => ({
                                                ...prev,
                                                ngayBatDau: d?.toISOString() ?? '',
                                            }))
                                        }
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={7}>
                                    <Text strong>Ngân sách tổng (VNĐ)</Text>
                                    <InputNumber
                                        min={0}
                                        step={500000}
                                        value={lichTrinhHienTai.nganSachTong}
                                        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        onChange={(v) =>
                                            setLichTrinhHienTai((prev) => ({ ...prev, nganSachTong: v ?? 0 }))
                                        }
                                        style={{ width: '100%', marginTop: 4 }}
                                    />
                                </Col>
                            </Row>
                        </div>

                        <Divider />

                        {/* Thống kê nhanh */}
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col xs={8}>
                                <Statistic
                                    title="Chi phí ước tính"
                                    value={chiPhiUocTinh}
                                    formatter={(v) => formatCurrency(Number(v))}
                                    valueStyle={{ fontSize: 15, color: vuotNganSach ? '#ff4d4f' : '#1890ff' }}
                                />
                            </Col>
                            <Col xs={8}>
                                <Statistic
                                    title="Còn lại"
                                    value={(lichTrinhHienTai.nganSachTong ?? 0) - chiPhiUocTinh}
                                    formatter={(v) => formatCurrency(Number(v))}
                                    valueStyle={{ fontSize: 15, color: vuotNganSach ? '#ff4d4f' : '#52c41a' }}
                                />
                            </Col>
                            <Col xs={8}>
                                <Statistic
                                    title="Thời gian"
                                    value={tongThoiGian()}
                                    suffix="giờ"
                                    valueStyle={{ fontSize: 15 }}
                                    prefix={<ClockCircleOutlined />}
                                />
                            </Col>
                        </Row>

                        {vuotNganSach && (
                            <Alert
                                type="warning"
                                message={`⚠️ Chi phí ước tính vượt ngân sách ${formatCurrency(chiPhiUocTinh - (lichTrinhHienTai.nganSachTong ?? 0))}!`}
                                style={{ marginBottom: 16 }}
                                showIcon
                            />
                        )}

                        {/* Danh sách ngày */}
                        <Collapse defaultActiveKey={['1']} accordion>
                            {lichTrinhHienTai.danhSachNgay?.map((ngay) => (
                                <Panel
                                    key={String(ngay.soNgay)}
                                    header={
                                        <Space>
                                            <strong>Ngày {ngay.soNgay}</strong>
                                            <Tag color="blue">{ngay.danhSachDiem.length} địa điểm</Tag>
                                            {ngay.danhSachDiem.length > 0 && (
                                                <Tag color="green">
                                                    {formatCurrency(
                                                        ngay.danhSachDiem.reduce(
                                                            (a, d) =>
                                                                a +
                                                                d.diemDen.chiPhiAn +
                                                                d.diemDen.chiPhiLuuTru +
                                                                d.diemDen.chiPhiDiChuyen,
                                                            0,
                                                        ),
                                                    )}
                                                </Tag>
                                            )}
                                        </Space>
                                    }
                                    extra={
                                        <Button
                                            size="small"
                                            icon={<PlusOutlined />}
                                            onClick={(e) => { e.stopPropagation(); handleMoDanhSachDiemDen(ngay.soNgay); }}
                                            type="dashed"
                                        >
                                            Thêm điểm đến
                                        </Button>
                                    }
                                >
                                    {ngay.danhSachDiem.length === 0 ? (
                                        <Empty description="Chưa có địa điểm nào" imageStyle={{ height: 40 }} />
                                    ) : (
                                        <List
                                            dataSource={ngay.danhSachDiem}
                                            renderItem={(item, idx) => (
                                                <List.Item
                                                    key={item.diemDen.id}
                                                    actions={[
                                                        <Button
                                                            key="up"
                                                            icon={<ArrowUpOutlined />}
                                                            size="small"
                                                            disabled={idx === 0}
                                                            onClick={() => sapXepDiemDen(ngay.soNgay, idx, idx - 1)}
                                                        />,
                                                        <Button
                                                            key="down"
                                                            icon={<ArrowDownOutlined />}
                                                            size="small"
                                                            disabled={idx === ngay.danhSachDiem.length - 1}
                                                            onClick={() => sapXepDiemDen(ngay.soNgay, idx, idx + 1)}
                                                        />,
                                                        <Popconfirm
                                                            key="del"
                                                            title="Xóa điểm đến này?"
                                                            onConfirm={() => xoaDiemDenKhoiNgay(ngay.soNgay, item.diemDen.id)}
                                                        >
                                                            <Button icon={<DeleteOutlined />} size="small" danger />
                                                        </Popconfirm>,
                                                    ]}
                                                    className="diem-den-item"
                                                >
                                                    <List.Item.Meta
                                                        avatar={
                                                            <img
                                                                src={item.diemDen.hinhAnh}
                                                                style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }}
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src =
                                                                        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100';
                                                                }}
                                                            />
                                                        }
                                                        title={
                                                            <Space>
                                                                <Text strong>{item.diemDen.ten}</Text>
                                                                <Tag color={item.diemDen.loai === 'BIEN' ? 'blue' : item.diemDen.loai === 'NUI' ? 'green' : 'purple'} style={{ fontSize: 11 }}>
                                                                    {LOAI_DIA_DIEM_LABEL[item.diemDen.loai]}
                                                                </Tag>
                                                            </Space>
                                                        }
                                                        description={
                                                            <Space size={16}>
                                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                                    <ClockCircleOutlined /> {item.diemDen.thoiGianThamQuan}h
                                                                </Text>
                                                                <Text style={{ fontSize: 12, color: '#1890ff' }}>
                                                                    🏨 {formatCurrency(item.diemDen.chiPhiLuuTru)}
                                                                </Text>
                                                                <Text style={{ fontSize: 12, color: '#52c41a' }}>
                                                                    🍜 {formatCurrency(item.diemDen.chiPhiAn)}
                                                                </Text>
                                                            </Space>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    )}
                                </Panel>
                            ))}
                        </Collapse>

                        <div style={{ marginTop: 20, textAlign: 'right' }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={<SaveOutlined />}
                                onClick={handleLuuLichTrinh}
                            >
                                Lưu lịch trình
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Modal chọn điểm đến */}
            <Modal
                title={`Chọn điểm đến cho Ngày ${ngayDangChon}`}
                visible={chonDiemDenVisible}
                onCancel={() => setChonDiemDenVisible(false)}
                footer={null}
                width={700}
            >
                <Input
                    placeholder="Tìm kiếm địa điểm..."
                    prefix={<CalendarOutlined />}
                    value={searchModal}
                    onChange={(e) => setSearchModal(e.target.value)}
                    style={{ marginBottom: 16 }}
                    allowClear
                />
                <List
                    style={{ maxHeight: 420, overflowY: 'auto' }}
                    dataSource={filteredDiemDen}
                    renderItem={(dd) => {
                        const isAdded = lichTrinhHienTai.danhSachNgay
                            ?.find((n) => n.soNgay === ngayDangChon)
                            ?.danhSachDiem.some((d) => d.diemDen.id === dd.id);
                        return (
                            <List.Item
                                key={dd.id}
                                actions={[
                                    <Button
                                        key="add"
                                        size="small"
                                        type={isAdded ? 'default' : 'primary'}
                                        disabled={isAdded}
                                        onClick={() => {
                                            themDiemDenVaoNgay(ngayDangChon, dd);
                                            message.success(`Đã thêm ${dd.ten}`);
                                        }}
                                    >
                                        {isAdded ? '✓ Đã thêm' : '+ Thêm'}
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <img
                                            src={dd.hinhAnh}
                                            style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100';
                                            }}
                                        />
                                    }
                                    title={
                                        <Space>
                                            {dd.ten}
                                            <Tag color={dd.loai === 'BIEN' ? 'blue' : dd.loai === 'NUI' ? 'green' : 'purple'} style={{ fontSize: 11 }}>
                                                {LOAI_DIA_DIEM_LABEL[dd.loai]}
                                            </Tag>
                                        </Space>
                                    }
                                    description={
                                        <Space>
                                            <Text type="secondary" style={{ fontSize: 12 }}>{dd.diaChi}</Text>
                                            <Text style={{ fontSize: 12, color: '#1890ff' }}>🏨 {formatCurrency(dd.chiPhiLuuTru)}</Text>
                                        </Space>
                                    }
                                />
                            </List.Item>
                        );
                    }}
                />
            </Modal>
        </div>
    );
};

export default LichTrinh;
