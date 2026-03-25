import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, message, Tooltip, Card, Typography } from 'antd';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/lib/table'; 
import { RegistrationItem, RegistrationStatus } from './data';
import RegistrationForm from './components/RegistrationForm';
import HistoryModal from './components/HistoryModal';

const { Text } = Typography;

const RegistrationPage: React.FC = () => {
  const { registrations, setRegistrations, updateStatus } = useModel('registration' as any);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RegistrationItem | undefined>();
  const [historyData, setHistoryData] = useState<RegistrationItem | undefined>();
  const [form] = Form.useForm();

  const handleBulkStatusChange = (status: RegistrationStatus) => {
    if (status === 'Rejected') {
      setIsRejectModalOpen(true);
    } else {
      updateStatus(selectedRowKeys as string[], 'Approved');
      message.success(`Đã duyệt ${selectedRowKeys.length} đơn thành công`);
      setSelectedRowKeys([]);
    }
  };

  const handleConfirmReject = (values: { note: string }) => {
    updateStatus(selectedRowKeys as string[], 'Rejected', values.note);
    message.success(`Đã từ chối ${selectedRowKeys.length} đơn`);
    setIsRejectModalOpen(false);
    setSelectedRowKeys([]);
    form.resetFields();
  };

  const handleSaveForm = (values: any) => {
    if (editingItem) {
      const newData = (registrations as RegistrationItem[]).map((item: RegistrationItem) => 
      item.id === editingItem?.id ? { ...item, ...values } : item
    );
      setRegistrations(newData);
      message.success('Cập nhật thông tin thành công');
    } else {
      const newItem: RegistrationItem = {
        ...values,
        id: Date.now().toString(),
        status: 'Pending',
        history: [],
        clubName: values.clubId === 'c1' ? 'CLB Âm Nhạc' : 'CLB Bóng Đá',
      };
      setRegistrations([...registrations, newItem]);
      message.success('Thêm đơn đăng ký mới thành công');
    }
    setIsFormOpen(false);
  };

  const columns: ColumnsType<RegistrationItem> = [
    { title: 'Họ tên', dataIndex: 'fullName', sorter: (a, b) => a.fullName.localeCompare(b.fullName), fixed: 'left' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    { 
      title: 'Câu lạc bộ', 
      dataIndex: 'clubName',
      filters: [{ text: 'CLB Âm Nhạc', value: 'CLB Âm Nhạc' }, { text: 'CLB Bóng Đá', value: 'CLB Bóng Đá' }],
      onFilter: (value: any, record) => record.clubName === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: any, record) => {
        const color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'gold';
        return (
          <Tooltip title="Click để xem lịch sử">
            <Tag color={color} style={{ cursor: 'pointer' }} onClick={() => setHistoryData(record)}>
              {status.toUpperCase()}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Space split={<Text type="secondary">|</Text>}>
          <Button type="link" size="small" onClick={() => { setEditingItem(record); setIsFormOpen(true); }}>Sửa</Button>
          {record.status === 'Pending' && (
            <>
              <Button type="link" size="small" onClick={() => updateStatus([record.id], 'Approved')}>Duyệt</Button>
              <Button type="link" size="small" danger onClick={() => { setSelectedRowKeys([record.id]); setIsRejectModalOpen(true); }}>Từ chối</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card title="QUẢN LÝ ĐƠN ĐĂNG KÝ" extra={<Button type="primary" onClick={() => { setEditingItem(undefined); setIsFormOpen(true); }}>+ Thêm đơn mới</Button>}>
      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16, padding: '10px', background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 4 }}>
          <Space>
            <Text strong>Đã chọn {selectedRowKeys.length} mục:</Text>
            <Button type="primary" size="small" onClick={() => handleBulkStatusChange('Approved')}>Duyệt hàng loạt</Button>
            <Button danger size="small" onClick={() => handleBulkStatusChange('Rejected')}>Từ chối hàng loạt</Button>
            <Button type="text" size="small" onClick={() => setSelectedRowKeys([])}>Hủy</Button>
          </Space>
        </div>
      )}
      <Table
        rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
        columns={columns}
        dataSource={registrations}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: 1000 }}
      />
      
      {/* Fix lỗi open -> visible */}
      <RegistrationForm visible={isFormOpen} onCancel={() => setIsFormOpen(false)} onFinish={handleSaveForm} initialValues={editingItem} />
      <HistoryModal visible={!!historyData} onCancel={() => setHistoryData(undefined)} data={historyData} />
      
      <Modal
        title="Xác nhận từ chối"
        visible={isRejectModalOpen}
        onOk={() => form.submit()}
        onCancel={() => { setIsRejectModalOpen(false); form.resetFields(); }}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true }}
        destroyOnClose
      >
        <Form form={form} onFinish={handleConfirmReject} layout="vertical">
          <p>Bạn đang thực hiện từ chối <b>{selectedRowKeys.length}</b> đơn đăng ký.</p>
          <Form.Item name="note" label="Lý do từ chối" rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}>
            <Input.TextArea rows={4} placeholder="Nhập lý do..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default RegistrationPage;