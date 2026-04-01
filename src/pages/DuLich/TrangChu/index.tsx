import React, { useEffect, useState } from 'react';
import {
    Card,
    Row,
    Col,
    Rate,
    Tag,
    Input,
    Slider,
    Checkbox,
    Select,
    Button,
    Badge,
    Empty,
    Spin,
    Typography,
    Space,
    message,
} from 'antd';
import {
    SearchOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    PlusOutlined,
    FilterOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import { LOAI_DIA_DIEM_LABEL } from '@/services/DuLich/constant';
import type { DuLich } from '@/services/DuLich/typing';
import './style.less';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const formatCurrency = (val: number) =>
    val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const TrangChuDuLich: React.FC = () => {
    const {
        danhSach,
        loading,
        filterLoai,
        setFilterLoai,
        filterRating,
        setFilterRating,
        filterGiaMin,
        filterGiaMax,
        setFilterGiaMax,
        sortBy,
        setSortBy,
        searchText,
        setSearchText,
        loadDanhSach,
    } = useModel('dulichDiemDen');

    const { themDiemDenVaoNgay, ngayDangChon } = useModel('dulichLichTrinh');
    const [showFilter, setShowFilter] = useState(false);
    const [addedIds, setAddedIds] = useState<string[]>([]);

    useEffect(() => {
        loadDanhSach();
    }, [filterLoai, filterRating, filterGiaMin, filterGiaMax, sortBy, searchText]);

    const handleAddToItinerary = (diemDen: DuLich.IDiemDen) => {
        themDiemDenVaoNgay(ngayDangChon, diemDen);
        setAddedIds((prev) => [...prev, diemDen.id]);
        message.success(`Đã thêm ${diemDen.ten} vào ngày ${ngayDangChon} của lịch trình`);
    };

    const loaiOptions = [
        { label: '🏖️ Biển', value: 'BIEN' },
        { label: '⛰️ Núi', value: 'NUI' },
        { label: '🏙️ Thành phố', value: 'THANH_PHO' },
    ];

    return (
        <div className="du-lich-trang-chu">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <Title level={1} className="hero-title">
                        🌏 Khám Phá Việt Nam
                    </Title>
                    <Text className="hero-subtitle">
                        Tìm kiếm điểm đến mơ ước, lên kế hoạch hành trình hoàn hảo
                    </Text>
                    <div className="hero-search">
                        <Input
                            size="large"
                            placeholder="Tìm kiếm địa điểm..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            className="search-input"
                        />
                    </div>
                </div>
            </div>

            {/* Filter & Sort Bar */}
            <div className="filter-bar">
                <Row align="middle" justify="space-between" gutter={[12, 12]}>
                    <Col>
                        <Space wrap>
                            <Button
                                icon={<FilterOutlined />}
                                onClick={() => setShowFilter(!showFilter)}
                                type={showFilter ? 'primary' : 'default'}
                            >
                                Bộ lọc {filterLoai.length > 0 && <Badge count={filterLoai.length} />}
                            </Button>
                            <Text strong style={{ color: '#666' }}>
                                {danhSach.length} địa điểm
                            </Text>
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Text>Sắp xếp:</Text>
                            <Select
                                value={sortBy}
                                onChange={setSortBy}
                                style={{ width: 160 }}
                            >
                                <Option value="rating">⭐ Đánh giá cao</Option>
                                <Option value="giaTang">💰 Giá thấp → cao</Option>
                                <Option value="giaGiam">💰 Giá cao → thấp</Option>
                                <Option value="ten">🔤 Tên A-Z</Option>
                            </Select>
                        </Space>
                    </Col>
                </Row>

                {/* Filter Panel */}
                {showFilter && (
                    <div className="filter-panel">
                        <Row gutter={[24, 16]}>
                            <Col xs={24} sm={8}>
                                <Text strong>📍 Loại hình</Text>
                                <Checkbox.Group
                                    options={loaiOptions}
                                    value={filterLoai}
                                    onChange={(vals) => setFilterLoai(vals as DuLich.ELoaiDiemDen[])}
                                    style={{ display: 'flex', flexDirection: 'column', marginTop: 8, gap: 4 }}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Text strong>⭐ Đánh giá tối thiểu</Text>
                                <div style={{ marginTop: 8 }}>
                                    <Rate
                                        allowHalf
                                        value={filterRating}
                                        onChange={setFilterRating}
                                        style={{ fontSize: 20 }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Text strong>🏨 Chi phí lưu trú (VNĐ/đêm)</Text>
                                <Slider
                                    range
                                    min={0}
                                    max={5000000}
                                    step={100000}
                                    defaultValue={[0, 5000000]}
                                    onChange={(vals: [number, number]) => {
                                        setFilterGiaMax(vals[1]);
                                    }}
                                    tipFormatter={(v?: number) => `${((v ?? 0) / 1000).toFixed(0)}k`}
                                    style={{ marginTop: 12 }}
                                />
                            </Col>
                        </Row>
                    </div>
                )}
            </div>

            {/* Destination Grid */}
            <div className="destination-grid">
                <Spin spinning={loading}>
                    {danhSach.length === 0 ? (
                        <Empty description="Không tìm thấy địa điểm phù hợp" />
                    ) : (
                        <Row gutter={[20, 20]}>
                            {danhSach.map((dd) => (
                                <Col key={dd.id} xs={24} sm={12} md={8} lg={6}>
                                    <Card
                                        hoverable
                                        className="destination-card"
                                        cover={
                                            <div className="card-image-wrapper">
                                                <img
                                                    alt={dd.ten}
                                                    src={dd.hinhAnh}
                                                    className="card-image"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';
                                                    }}
                                                />
                                                <Tag
                                                    className="loai-tag"
                                                    color={
                                                        dd.loai === 'BIEN'
                                                            ? 'blue'
                                                            : dd.loai === 'NUI'
                                                                ? 'green'
                                                                : 'purple'
                                                    }
                                                >
                                                    {LOAI_DIA_DIEM_LABEL[dd.loai]}
                                                </Tag>
                                            </div>
                                        }
                                        actions={[
                                            <Button
                                                key="add"
                                                type={addedIds.includes(dd.id) ? 'default' : 'primary'}
                                                icon={<PlusOutlined />}
                                                onClick={() => handleAddToItinerary(dd)}
                                                disabled={addedIds.includes(dd.id)}
                                                size="small"
                                            >
                                                {addedIds.includes(dd.id) ? 'Đã thêm' : 'Thêm vào lịch trình'}
                                            </Button>,
                                        ]}
                                    >
                                        <Card.Meta
                                            title={
                                                <div className="card-title-row">
                                                    <span className="card-title">{dd.ten}</span>
                                                    <Rate disabled value={dd.rating} allowHalf style={{ fontSize: 12 }} />
                                                </div>
                                            }
                                            description={
                                                <div className="card-desc">
                                                    <div className="card-location">
                                                        <EnvironmentOutlined /> {dd.diaChi}
                                                    </div>
                                                    <Paragraph
                                                        ellipsis={{ rows: 2 }}
                                                        style={{ color: '#666', fontSize: 13, marginBottom: 8 }}
                                                    >
                                                        {dd.moTa}
                                                    </Paragraph>
                                                    <div className="card-info">
                                                        <Space direction="vertical" size={2} style={{ width: '100%' }}>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                                <ClockCircleOutlined /> {dd.thoiGianThamQuan}h tham quan
                                                            </Text>
                                                            <Text style={{ color: '#1890ff', fontWeight: 600, fontSize: 13 }}>
                                                                🏨 {formatCurrency(dd.chiPhiLuuTru)}/đêm
                                                            </Text>
                                                            <Text style={{ color: '#52c41a', fontSize: 12 }}>
                                                                🍜 {formatCurrency(dd.chiPhiAn)}/ngày
                                                            </Text>
                                                        </Space>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Spin>
            </div>
        </div>
    );
};

export default TrangChuDuLich;
