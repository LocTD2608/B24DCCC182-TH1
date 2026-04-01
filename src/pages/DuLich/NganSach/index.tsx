import React, { useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    Select,
    Alert,
    Progress,
    Statistic,
    Empty,
    Typography,
    Space,
    Tag,
} from 'antd';
import {
    DollarOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    RiseOutlined,
} from '@ant-design/icons';
import { Pie, Column } from '@ant-design/charts';
import { useModel } from 'umi';
import { HAN_MUC_COLOR, HAN_MUC_LABEL } from '@/services/DuLich/constant';
import './style.less';

const { Text } = Typography;
const { Option } = Select;

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const NganSach: React.FC = () => {
    const { danhSachLichTrinh, lichTrinhDangXem, nganSachChiTiet, loadDanhSachLichTrinh, chonLichTrinh } =
        useModel('dulichNganSach');

    useEffect(() => {
        loadDanhSachLichTrinh();
    }, []);

    const pieData = nganSachChiTiet
        ? Object.entries(nganSachChiTiet.chiTieu).map(([key, value]) => ({
            type: HAN_MUC_LABEL[key] ?? key,
            value,
            color: HAN_MUC_COLOR[key],
        }))
        : [];

    const barData = nganSachChiTiet
        ? Object.entries(nganSachChiTiet.chiTieu).map(([key, value]) => ({
            hanMuc: HAN_MUC_LABEL[key] ?? key,
            chiPhi: value,
        }))
        : [];

    const phanTramSuDung = nganSachChiTiet
        ? Math.min(
            100,
            Math.round((nganSachChiTiet.tongChiTieu / nganSachChiTiet.nganSachTong) * 100),
        )
        : 0;

    if (danhSachLichTrinh.length === 0) {
        return (
            <div className="ngan-sach-page">
                <Card className="ngan-sach-card">
                    <Empty
                        description={
                            <span>
                                Chưa có lịch trình nào. Hãy{' '}
                                <a href="/du-lich/lich-trinh">tạo lịch trình</a> trước!
                            </span>
                        }
                    />
                </Card>
            </div>
        );
    }

    return (
        <div className="ngan-sach-page">
            {/* Selector */}
            <Card className="ngan-sach-card" style={{ marginBottom: 20 }}>
                <Row align="middle" gutter={16}>
                    <Col>
                        <Text strong>Chọn lịch trình:</Text>
                    </Col>
                    <Col flex="auto">
                        <Select
                            style={{ width: '100%', maxWidth: 380 }}
                            placeholder="Chọn lịch trình để xem ngân sách..."
                            value={lichTrinhDangXem?.id}
                            onChange={(id) => {
                                const lt = danhSachLichTrinh.find((l) => l.id === id);
                                if (lt) chonLichTrinh(lt);
                            }}
                        >
                            {danhSachLichTrinh.map((lt) => (
                                <Option key={lt.id} value={lt.id}>
                                    {lt.tenLichTrinh} — {lt.soNgay} ngày
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Card>

            {nganSachChiTiet && (
                <>
                    {/* Warning / Success Banner */}
                    {nganSachChiTiet.vietQuaNganSach ? (
                        <Alert
                            type="error"
                            icon={<WarningOutlined />}
                            message={
                                <strong>
                                    ⚠️ Vượt ngân sách {formatCurrency(Math.abs(nganSachChiTiet.conLai))}!
                                </strong>
                            }
                            description="Chi phí ước tính đã vượt quá ngân sách bạn đặt ra. Hãy cân nhắc giảm bớt điểm đến."
                            showIcon
                            style={{ marginBottom: 20 }}
                        />
                    ) : (
                        <Alert
                            type="success"
                            icon={<CheckCircleOutlined />}
                            message={
                                <strong>Ngân sách OK — Còn lại {formatCurrency(nganSachChiTiet.conLai)}</strong>
                            }
                            showIcon
                            style={{ marginBottom: 20 }}
                        />
                    )}

                    {/* Summary Statistics */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                        <Col xs={12} sm={6}>
                            <Card className="stat-card stat-blue">
                                <Statistic
                                    title="Ngân sách tổng"
                                    value={nganSachChiTiet.nganSachTong}
                                    formatter={(v) => formatCurrency(Number(v))}
                                    prefix={<DollarOutlined />}
                                    valueStyle={{ fontSize: 16 }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card className="stat-card stat-orange">
                                <Statistic
                                    title="Chi phí ước tính"
                                    value={nganSachChiTiet.tongChiTieu}
                                    formatter={(v) => formatCurrency(Number(v))}
                                    prefix={<RiseOutlined />}
                                    valueStyle={{ fontSize: 16, color: nganSachChiTiet.vietQuaNganSach ? '#ff4d4f' : '#fa8c16' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card className="stat-card stat-green">
                                <Statistic
                                    title="Còn lại"
                                    value={nganSachChiTiet.conLai}
                                    formatter={(v) => formatCurrency(Number(v))}
                                    valueStyle={{ fontSize: 16, color: nganSachChiTiet.vietQuaNganSach ? '#ff4d4f' : '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card className="stat-card stat-purple">
                                <Statistic
                                    title="Mức sử dụng"
                                    value={phanTramSuDung}
                                    suffix="%"
                                    valueStyle={{
                                        fontSize: 16,
                                        color: phanTramSuDung >= 100 ? '#ff4d4f' : phanTramSuDung >= 80 ? '#fa8c16' : '#52c41a',
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Overall Progress */}
                    <Card className="ngan-sach-card" style={{ marginBottom: 20 }}>
                        <Text strong>📊 Tiến độ sử dụng ngân sách</Text>
                        <Progress
                            percent={phanTramSuDung}
                            status={phanTramSuDung >= 100 ? 'exception' : phanTramSuDung >= 80 ? 'active' : 'success'}
                            strokeWidth={16}
                            style={{ marginTop: 12 }}
                        />
                        <Row justify="space-between" style={{ marginTop: 4 }}>
                            <Text type="secondary">0</Text>
                            <Text type="secondary">{formatCurrency(nganSachChiTiet.nganSachTong)}</Text>
                        </Row>
                    </Card>

                    {/* Charts */}
                    <Row gutter={[20, 20]}>
                        {/* Pie Chart */}
                        <Col xs={24} md={12}>
                            <Card className="ngan-sach-card chart-card" title="🥧 Phân bổ chi phí">
                                {pieData.length > 0 && pieData.some((d) => d.value > 0) ? (
                                    <Pie
                                        data={pieData}
                                        angleField="value"
                                        colorField="type"
                                        radius={0.8}
                                        label={{
                                            type: 'outer',
                                            content: '{name}: {percentage}',
                                            style: { fontSize: 12 },
                                        }}
                                        legend={{ position: 'bottom' }}
                                        tooltip={{
                                            formatter: (datum) => ({
                                                name: datum.type,
                                                value: formatCurrency(datum.value),
                                            }),
                                        }}
                                        height={280}
                                        color={pieData.map((d) => d.color)}
                                    />
                                ) : (
                                    <Empty description="Chưa có dữ liệu" />
                                )}
                            </Card>
                        </Col>

                        {/* Bar Chart */}
                        <Col xs={24} md={12}>
                            <Card className="ngan-sach-card chart-card" title="📊 Chi phí theo hạng mục">
                                {barData.length > 0 ? (
                                    <Column
                                        data={barData}
                                        xField="hanMuc"
                                        yField="chiPhi"
                                        color="#1890ff"
                                        label={{
                                            position: 'top',
                                            formatter: (d) => `${(d.chiPhi / 1000000).toFixed(1)}tr`,
                                            style: { fontSize: 11 },
                                        }}
                                        tooltip={{
                                            formatter: (datum) => ({
                                                name: 'Chi phí',
                                                value: formatCurrency(datum.chiPhi),
                                            }),
                                        }}
                                        columnStyle={{ radius: [6, 6, 0, 0] }}
                                        height={280}
                                        xAxis={{ label: { style: { fontSize: 11 } } }}
                                        yAxis={false}
                                    />
                                ) : (
                                    <Empty description="Chưa có dữ liệu" />
                                )}
                            </Card>
                        </Col>
                    </Row>

                    {/* Detail Progress Bars */}
                    <Card className="ngan-sach-card" style={{ marginTop: 20 }} title="📋 Chi tiết từng hạng mục">
                        <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            {Object.entries(nganSachChiTiet.chiTieu).map(([key, value]) => {
                                const pct = nganSachChiTiet.nganSachTong > 0
                                    ? Math.round((value / nganSachChiTiet.nganSachTong) * 100)
                                    : 0;
                                return (
                                    <div key={key}>
                                        <Row justify="space-between" style={{ marginBottom: 4 }}>
                                            <Text strong>{HAN_MUC_LABEL[key]}</Text>
                                            <Space>
                                                <Tag color="blue">{pct}% ngân sách</Tag>
                                                <Text>{formatCurrency(value)}</Text>
                                            </Space>
                                        </Row>
                                        <Progress
                                            percent={Math.min(100, pct)}
                                            strokeColor={HAN_MUC_COLOR[key]}
                                            showInfo={false}
                                            strokeWidth={10}
                                        />
                                    </div>
                                );
                            })}
                        </Space>
                    </Card>
                </>
            )}
        </div>
    );
};

export default NganSach;
