import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col, Card, Statistic, Alert, Progress, Typography, Button, Modal, InputNumber } from 'antd';
import { ExclamationCircleOutlined, WalletOutlined, ShoppingCartOutlined, EditOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import BudgetChart from './components/BudgetChart';
import ExpenseList from './components/ExpenseList';

const { Text } = Typography;

const QuanLyNganSach: React.FC = () => {
  const { budget, totalExpense, remainingBudget, overBudget, isWarning, updateBudget } = useModel('quanlyngansach');
  const [isEditBudgetVisible, setIsEditBudgetVisible] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);

  const percentUsed = budget > 0 ? Math.min(100, Math.round((totalExpense / budget) * 100)) : 0;

  const handleUpdateBudget = () => {
    updateBudget(newBudget);
    setIsEditBudgetVisible(false);
  };

  return (
    <PageContainer
      header={{
        title: 'Quản lý ngân sách',
        ghost: true,
      }}
    >
      <div>
        {overBudget > 0 && (
          <Alert
            message="Cảnh báo vượt ngân sách!"
            description={`Bạn đã chi tiêu vượt quá ngân sách ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(overBudget)}.`}
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            style={{ marginBottom: 24, borderRadius: 8 }}
          />
        )}

        {isWarning && overBudget <= 0 && (
          <Alert
            message="Cảnh báo sắp vượt ngân sách!"
            description={`Bạn đã sử dụng ${percentUsed}% ngân sách. Hãy chú ý chi tiêu!`}
            type="warning"
            showIcon
            style={{ marginBottom: 24, borderRadius: 8 }}
          />
        )}

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} lg={8}>
            <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Statistic
                  title="Tổng ngân sách dự kiến"
                  value={budget}
                  prefix={<WalletOutlined style={{ color: '#1890ff' }} />}
                  formatter={value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value))}
                />
                <Button type="text" icon={<EditOutlined />} onClick={() => { setNewBudget(budget); setIsEditBudgetVisible(true); }} />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Statistic
                title="Đã chi tiêu"
                value={totalExpense}
                prefix={<ShoppingCartOutlined style={{ color: overBudget > 0 ? '#ff4d4f' : '#faad14' }} />}
                formatter={value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value))}
                valueStyle={{ color: overBudget > 0 ? '#ff4d4f' : 'inherit' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Statistic
                title="Ngân sách còn lại"
                value={remainingBudget}
                formatter={value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value))}
                valueStyle={{ color: remainingBudget > 0 ? '#52c41a' : '#ff4d4f' }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Mức độ sử dụng</Text>
                <Progress
                  percent={percentUsed}
                  status={overBudget > 0 ? 'exception' : 'active'}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': overBudget > 0 ? '#ff4d4f' : '#87d068',
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={10}>
            <BudgetChart />
          </Col>
          <Col xs={24} lg={14}>
            <ExpenseList />
          </Col>
        </Row>

        <Modal
          title="Cập nhật ngân sách"
          visible={isEditBudgetVisible}
          onOk={handleUpdateBudget}
          onCancel={() => setIsEditBudgetVisible(false)}
          okText="Cập nhật"
          cancelText="Huỷ"
        >
          <div style={{ padding: '20px 0' }}>
            <Text>Nhập tổng ngân sách mới (VNĐ):</Text>
            <InputNumber
              style={{ width: '100%', marginTop: 8 }}
              value={newBudget}
              onChange={val => setNewBudget(Number(val) || 0)}
              formatter={(value: string | number | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
            />
          </div>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default QuanLyNganSach;
