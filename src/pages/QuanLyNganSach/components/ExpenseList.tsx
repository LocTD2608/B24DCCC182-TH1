import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Popconfirm, Modal, Form, Input, Select, InputNumber, DatePicker } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';

interface ExpenseRecord {
  id: string;
  name: string;
  category: 'AnUong' | 'DiChuyen' | 'LuuTru' | 'ThamQuan' | 'Khac';
  amount: number;
  date: string;
}

const { Option } = Select;

const categoryColors: Record<string, string> = {
  AnUong: 'orange',
  DiChuyen: 'blue',
  LuuTru: 'green',
  ThamQuan: 'purple',
  Khac: 'default'
};

const categoryLabels: Record<string, string> = {
  AnUong: 'Ăn uống',
  DiChuyen: 'Di chuyển',
  LuuTru: 'Lưu trú',
  ThamQuan: 'Tham quan',
  Khac: 'Khác'
};

const ExpenseList: React.FC = () => {
  const { expenses, addExpense, removeExpense } = useModel('quanlyngansach');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Tên mục chi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={categoryColors[category] || 'default'}>
          {categoryLabels[category] || category}
        </Tag>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ fontWeight: 600 }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
        </span>
      ),
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: ExpenseRecord) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá khoản chi này?"
            onConfirm={() => removeExpense(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button danger type="text" icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = (values: any) => {
    addExpense({
      name: values.name,
      category: values.category,
      amount: values.amount,
      date: values.date ? values.date.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Card 
      title="Danh sách chi tiêu" 
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Thêm khoản chi</Button>}
      bordered={false} 
      style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginTop: 24 }}
    >
      <Table 
        columns={columns} 
        dataSource={expenses} 
        rowKey="id" 
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title="Thêm khoản chi"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="name" label="Tên mục chi" rules={[{ required: true, message: 'Vui lòng nhập tên khoản chi!' }]}>
            <Input placeholder="VD: Bữa tối hải sản" />
          </Form.Item>
          
          <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
            <Select placeholder="Chọn danh mục">
              <Option value="AnUong">Ăn uống</Option>
              <Option value="DiChuyen">Di chuyển</Option>
              <Option value="LuuTru">Lưu trú</Option>
              <Option value="ThamQuan">Tham quan</Option>
              <Option value="Khac">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item name="amount" label="Số tiền (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}>
            <InputNumber 
              style={{ width: '100%' }} 
              formatter={(value: string | number | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
              placeholder="VD: 500000"
            />
          </Form.Item>

          <Form.Item name="date" label="Ngày" initialValue={moment()}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lưu khoản chi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ExpenseList;
