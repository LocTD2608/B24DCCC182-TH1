import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Select, Button, message, Space, Typography, Spin } from 'antd';
import { BarChartOutlined, DownloadOutlined, TeamOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import * as XLSX from 'xlsx';

const { Title } = Typography;

export interface IClub {
  id: string | number;
  name: string;
}

export interface IMember {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  clubId: string | number;
  status: 'Approved' | 'Pending' | 'Rejected' | string;
}

const BaoCao: React.FC = () => {
  const [selectedClubId, setSelectedClubId] = useState<string | undefined>(undefined);
  const [clubs, setClubs] = useState<IClub[]>([]);
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // TODO: Fetch dashboard data from API
    // const fetchDashboardData = async () => { ... }
    setClubs([]);
    setMembers([]);
  }, []);

  const totalClubs = clubs.length;
  const totalPending = members.filter(m => m.status === 'Pending').length;
  const totalApproved = members.filter(m => m.status === 'Approved').length;
  const totalRejected = members.filter(m => m.status === 'Rejected').length;

  const chartCategories = clubs.map(c => c.name);

  const getCountByStatus = (status: string) => {
    return clubs.map(club => {
      return members.filter(m => String(m.clubId) === String(club.id) && m.status === status).length;
    });
  };

  const chartSeries = [
    { name: 'Approved', data: getCountByStatus('Approved') },
    { name: 'Pending', data: getCountByStatus('Pending') },
    { name: 'Rejected', data: getCountByStatus('Rejected') }
  ];

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: true }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: chartCategories,
      labels: {
        style: { fontSize: '13px', fontWeight: 500 }
      }
    },
    yaxis: {
      title: {
        text: 'Số lượng (Hồ sơ)',
        style: { fontWeight: 600 }
      }
    },
    fill: { opacity: 1 },
    colors: ['#29ff15ff', '#FEB019', '#CC0D00'],
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " hồ sơ"
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  const handleExportExcel = () => {
    if (!selectedClubId) {
      message.warning('Vui lòng chọn một Câu lạc bộ để xuất dữ liệu!');
      return;
    }

    const club = clubs.find(c => String(c.id) === String(selectedClubId));
    
    const approvedMembers = members.filter(m => String(m.clubId) === String(selectedClubId) && m.status === 'Approved');

    if (approvedMembers.length === 0) {
      message.info('Câu lạc bộ này chưa có thành viên nào được duyệt (Approved).');
      return;
    }

    const excelData = approvedMembers.map((m, index) => ({
      'STT': index + 1,
      'Họ và tên': m.name,
      'Email': m.email,
      'Số điện thoại': m.phone,
      'Giới tính': m.gender,
      'Câu lạc bộ': club?.name || '',
      'Trạng thái': m.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Thành viên Approved");
    
    XLSX.writeFile(workbook, `ThanhVien_${club?.name?.replace(/ /g, '_') || 'CLB'}_Approved.xlsx`);
    message.success('Xuất file Excel thành công!');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: 24, fontSize: '24px' }}><BarChartOutlined /> Báo cáo thống kê</Title>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>TỔNG SỐ CLB</span>}
                value={totalClubs}
                valueStyle={{ color: '#1890ff', fontWeight: 'bold', fontSize: '28px' }}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>ĐƠN ĐÃ DUYỆT</span>}
                value={totalApproved}
                valueStyle={{ color: '#00E396', fontWeight: 'bold', fontSize: '28px' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>ĐƠN CHỜ DUYỆT</span>}
                value={totalPending}
                valueStyle={{ color: '#FEB019', fontWeight: 'bold', fontSize: '28px' }}
                prefix={<SyncOutlined spin />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>ĐƠN TỪ CHỐI</span>}
                value={totalRejected}
                valueStyle={{ color: '#CC0D00', fontWeight: 'bold', fontSize: '28px' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card 
              title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Số lượng đơn đăng ký theo từng CLB</span>} 
              bordered={false} 
              style={{ height: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
            >
              {clubs.length > 0 ? (
                <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
              ) : (
                <div style={{ height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#8c8c8c' }}>
                  Chấp nhận dữ liệu từ API để biểu diễn...
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card 
              title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Xuất danh sách thành viên</span>} 
              bordered={false} 
              style={{ height: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <div style={{ marginBottom: 8, fontWeight: 500 }}>Chọn Câu lạc bộ:</div>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="-- Chọn Câu lạc bộ --"
                    onChange={(value) => setSelectedClubId(value)}
                    options={clubs.map(c => ({ value: String(c.id), label: c.name }))}
                    notFoundContent="Không có dữ liệu CLB"
                  />
                </div>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />} 
                  onClick={handleExportExcel}
                  disabled={!selectedClubId || clubs.length === 0}
                  block
                  size="large"
                  style={{ borderRadius: '6px', fontWeight: 600 }}
                >
                  Xuất file Excel (Approved)
                </Button>
                <div style={{ color: '#8c8c8c', fontSize: '13px', marginTop: '16px', lineHeight: '1.6' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '4px' }} />
                  Hệ thống chỉ xuất danh sách các thành viên có trạng thái là <b style={{ color: '#52c41a' }}>Approved</b> (Đã duyệt).
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default BaoCao;
