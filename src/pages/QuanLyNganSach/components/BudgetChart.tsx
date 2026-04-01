import React from 'react';
import Chart from 'react-apexcharts';
import { Card, Typography } from 'antd';
import { useModel } from 'umi';

const { Title } = Typography;

const BudgetChart: React.FC = () => {
  const { getExpensesByCategory } = useModel('quanlyngansach');
  const expensesByCategory = getExpensesByCategory();

  const categories = Object.keys(expensesByCategory).map(key => {
    switch(key) {
      case 'AnUong': return 'Ăn uống';
      case 'DiChuyen': return 'Di chuyển';
      case 'LuuTru': return 'Lưu trú';
      case 'ThamQuan': return 'Tham quan';
      case 'Khac': return 'Khác';
      default: return key;
    }
  });

  const series = Object.values(expensesByCategory);

  const options: ApexCharts.ApexOptions = {
    labels: categories,
    colors: ['#ffc658', '#8884d8', '#82ca9d', '#ff7300', '#0088fe'],
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif',
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + '%';
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
              formatter: function (val: string) {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));
              }
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Tổng chi',
              formatter: function (w: any) {
                const total = w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b
                }, 0);
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
              }
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(val: number) {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
        }
      }
    },
    legend: {
      position: 'bottom',
    }
  };

  return (
    <Card bordered={false} style={{ height: '100%', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Title level={4} style={{ marginBottom: 24, textAlign: 'center' }}>Phân bổ ngân sách</Title>
      {series.reduce((a, b) => a + b, 0) > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Chart options={options} series={series} type="donut" width="100%" height={320} />
          </div>
      ) : (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
              Chưa có dữ liệu chi tiêu
          </div>
      )}
    </Card>
  );
};

export default BudgetChart;
