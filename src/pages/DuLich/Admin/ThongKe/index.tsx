import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Tag } from 'antd';
import {
    TrophyOutlined,
    DollarOutlined,
    CalendarOutlined,
    FireOutlined,
} from '@ant-design/icons';
import { Column, Pie, Bar } from '@ant-design/charts';
import { getThongKe } from '@/services/DuLich';
import type { DuLich } from '@/services/DuLich/typing';
import './style.less';

const { Title, Text } = Typography;

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const AdminThongKe: React.FC = () => {
    const [thongKe, setThongKe] = useState<DuLich.IThongKe | null>(null);

    useEffect(() => {
        setThongKe(getThongKe());
    }, []);

    if (!thongKe) return null;

    return (
        <div className="admin-thong-ke-page">
            <Title level={4} style={{ marginBottom: 20 }}>
                📊 Thống kê tổng quan
            </Title>

            {/* KPI Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card className="kpi-card kpi-blue">
                        <Statistic
                            title="Tổng lịch trình"
                            value={thongKe.tongLichTrinh}
                            prefix={<CalendarOutlined />}
                            suffix="lịch trình"
                            valueStyle={{ color: '#1890ff', fontSize: 22 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card className="kpi-card kpi-green">
                        <Statistic
                            title="Tổng doanh thu"
                            value={thongKe.tongTien}
                            formatter={(v) => formatCurrency(Number(v))}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#52c41a', fontSize: 18 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card className="kpi-card kpi-orange">
                        <Statistic
                            title="Điểm đến phổ biến nhất"
                            value={thongKe.diemDenPhoNhat}
                            prefix={<TrophyOutlined />}
                            valueStyle={{ color: '#fa8c16', fontSize: 16 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card className="kpi-card kpi-purple">
                        <Statistic
                            title="Tháng cao điểm"
                            value="Tháng 12"
                            prefix={<FireOutlined />}
                            valueStyle={{ color: '#722ed1', fontSize: 18 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts Row 1 */}
            <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
                {/* Bar chart: lịch trình theo tháng */}
                <Col xs={24} lg={14}>
                    <Card
                        className="chart-card"
                        title={
                            <span>
                                <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                Số lịch trình tạo theo tháng
                            </span>
                        }
                    >
                        <Column
                            data={thongKe.lichTrinhTheoThang}
                            xField="thang"
                            yField="soLuong"
                            color="#1890ff"
                            label={{
                                position: 'top',
                                style: { fontSize: 11, fill: '#555' },
                            }}
                            columnStyle={{ radius: [6, 6, 0, 0] }}
                            tooltip={{
                                formatter: (datum) => ({
                                    name: 'Lịch trình',
                                    value: `${datum.soLuong} lịch trình`,
                                }),
                            }}
                            height={260}
                            yAxis={{ label: { formatter: (v: string) => `${v}` } }}
                        />
                    </Card>
                </Col>

                {/* Pie: top điểm đến */}
                <Col xs={24} lg={10}>
                    <Card
                        className="chart-card"
                        title={
                            <span>
                                <TrophyOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                                Top 5 điểm đến phổ biến
                            </span>
                        }
                    >
                        <Pie
                            data={thongKe.topDiemDen.map((d) => ({ type: d.ten, value: d.soLuot }))}
                            angleField="value"
                            colorField="type"
                            radius={0.75}
                            innerRadius={0.45}
                            label={{
                                type: 'inner',
                                offset: '-30%',
                                content: '{percentage}',
                                style: { fontSize: 12, textAlign: 'center', fill: '#fff' },
                            }}
                            legend={{ position: 'bottom', layout: 'horizontal' }}
                            tooltip={{
                                formatter: (datum) => ({
                                    name: datum.type,
                                    value: `${datum.value} lượt`,
                                }),
                            }}
                            height={260}
                            statistic={{
                                title: { content: 'Tổng lượt', style: { fontSize: 12 } },
                                content: {
                                    content: `${thongKe.topDiemDen.reduce((a, b) => a + b.soLuot, 0)}`,
                                    style: { fontSize: 18 },
                                },
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts Row 2 */}
            <Row gutter={[20, 20]}>
                {/* Bar: doanh thu theo tháng */}
                <Col xs={24} lg={14}>
                    <Card
                        className="chart-card"
                        title={
                            <span>
                                <DollarOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                                Doanh thu theo tháng (VNĐ)
                            </span>
                        }
                    >
                        <Column
                            data={thongKe.lichTrinhTheoThang}
                            xField="thang"
                            yField="soTien"
                            color="#52c41a"
                            label={false}
                            columnStyle={{ radius: [6, 6, 0, 0] }}
                            tooltip={{
                                formatter: (datum) => ({
                                    name: 'Doanh thu',
                                    value: formatCurrency(datum.soTien),
                                }),
                            }}
                            yAxis={{
                                label: {
                                    formatter: (v: string) => `${(Number(v) / 1000000).toFixed(0)}tr`,
                                },
                            }}
                            height={240}
                        />
                    </Card>
                </Col>

                {/* Bar: chi tiêu theo hạng mục */}
                <Col xs={24} lg={10}>
                    <Card
                        className="chart-card"
                        title={
                            <span>💰 Tổng chi tiêu theo hạng mục</span>
                        }
                    >
                        <Bar
                            data={thongKe.chiTieuTheoHanMuc}
                            xField="tong"
                            yField="hanMuc"
                            color={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']}
                            label={{
                                position: 'right',
                                formatter: (d) => `${(d.tong / 1000000).toFixed(0)}tr`,
                                style: { fontSize: 12 },
                            }}
                            tooltip={{
                                formatter: (datum) => ({
                                    name: datum.hanMuc,
                                    value: formatCurrency(datum.tong),
                                }),
                            }}
                            barStyle={{ radius: [0, 6, 6, 0] }}
                            height={240}
                            xAxis={{
                                label: {
                                    formatter: (v: string) => `${(Number(v) / 1000000).toFixed(0)}tr`,
                                },
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Top địa điểm table */}
            <Card className="chart-card" style={{ marginTop: 20 }} title="🏆 Bảng xếp hạng điểm đến">
                <Row gutter={[12, 12]}>
                    {thongKe.topDiemDen.map((d, i) => (
                        <Col key={d.ten} xs={24} sm={12} md={8} lg={4}>
                            <div className="rank-item">
                                <div className="rank-badge">
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                </div>
                                <Text strong style={{ fontSize: 14 }}>{d.ten}</Text>
                                <Tag color="blue" style={{ marginTop: 4 }}>{d.soLuot.toLocaleString()} lượt</Tag>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Card>
        </div>
    );
};

export default AdminThongKe;
