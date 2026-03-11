import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic, Table } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import RevenueChart from '@/components/Statistics/RevenueChart';
import { formatCurrency } from '@/utils/format';

const StatisticsPage: React.FC = () => {
  // Giả sử đây là dữ liệu từ API trả về
  const mockData = [
    { id: 1, service: 'Cắt tóc', employee: 'Nguyễn Văn A', price: 100000, date: '2026-03-10' },
    { id: 2, service: 'Spa mặt', employee: 'Trần Thị B', price: 500000, date: '2026-03-10' },
    { id: 3, service: 'Cắt tóc', employee: 'Nguyễn Văn A', price: 100000, date: '2026-03-11' },
  ];

  // 1. Logic Thống kê số lượng theo ngày
  const dailyStats = useMemo(() => {
    const map = new Map();
    mockData.forEach(item => {
      map.set(item.date, (map.get(item.date) || 0) + 1);
    });
    return Array.from(map, ([label, value]) => ({ label, value }));
  }, [mockData]);

  // 2. Logic Thống kê doanh thu theo dịch vụ
  const serviceStats = useMemo(() => {
    const map = new Map();
    mockData.forEach(item => {
      map.set(item.service, (map.get(item.service) || 0) + item.price);
    });
    return Array.from(map, ([service, amount]) => ({ service, amount }));
  }, [mockData]);

  const columns = [
    { title: 'Tên Dịch vụ', dataIndex: 'service', key: 'service' },
    { 
      title: 'Tổng Doanh thu', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (val: number) => <b>{formatCurrency(val)}</b> 
    },
  ];

  return (
    <div style={{ background: '#f0f2f5', padding: '30px', minHeight: '100vh' }}>
      <h2>Báo cáo kinh doanh</h2>
      
      {/* Hàng 1: Thẻ tổng quát */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng lịch hẹn" value={mockData.length} prefix={<ArrowUpOutlined />} />
          </Card>
        </Col>
        <Col span={16}>
          <Card>
            <Statistic 
                title="Tổng doanh thu tháng này" 
                value={700000} 
                formatter={(val) => formatCurrency(Number(val))} 
            />
          </Card>
        </Col>
      </Row>

      {/* Hàng 2: Biểu đồ và Bảng */}
      <Row gutter={16}>
        <Col span={12}>
          <RevenueChart title="Số lượng lịch hẹn theo ngày" data={dailyStats} />
        </Col>
        <Col span={12}>
          <Card title="Chi tiết doanh thu theo dịch vụ">
            <Table 
                dataSource={serviceStats} 
                columns={columns} 
                pagination={{ pageSize: 5 }} 
                rowKey="service"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;