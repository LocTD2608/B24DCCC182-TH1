import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, message, Modal, Form, Select, DatePicker, Input } from 'antd';
import { useModel } from 'umi';

const AppointmentPage = () => {
  // Lấy data và hàm xử lý từ Model bạn vừa tạo
  const { items, fetchItems, checkDuplicate, addAppointment, updateStatus } = useModel('appointment');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Gọi API lấy danh sách khi vừa vào trang
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // --- Cấu hình Cột cho Bảng (Table) ---
  const columns = [
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Mã Nhân viên', dataIndex: 'staffId', key: 'staffId' },
    { title: 'Thời gian', dataIndex: 'time', key: 'time' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        // Clean code: Dùng object map màu thay vì viết nhiều if/else
        const colorMap: Record<string, string> = { 
          'Chờ duyệt': 'blue', 
          'Xác nhận': 'green', 
          'Hoàn thành': 'gold', 
          'Hủy': 'red' 
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record: any) => (
        <Space size="middle">
          {/* Nút Duyệt: Chỉ hiện khi trạng thái đang là 'Chờ duyệt' */}
          {record.status === 'Chờ duyệt' && (
            <Button 
              type="primary" 
              size="small" 
              onClick={() => updateStatus(record.id, 'Xác nhận')}
            >
              Duyệt
            </Button>
          )}

          {/* Nút Hủy: Chỉ hiện khi trạng thái chưa bị Hủy hoặc Hoàn thành */}
          {record.status !== 'Hủy' && record.status !== 'Hoàn thành' && (
            <Button 
              danger 
              size="small" 
              onClick={() => updateStatus(record.id, 'Hủy')}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // --- Xử lý khi bấm "Xác nhận" trong Form Đặt lịch ---
 const onFinish = (values: any) => {
    try {
      // Ép kiểu thời gian cho chuẩn, tránh lỗi format
      const timeString = typeof values.time === 'string' ? values.time : values.time.format('YYYY-MM-DD HH:mm');
      
      // Kiểm tra trùng lịch
      if (checkDuplicate(values.staffId, timeString)) {
        message.error('Nhân viên đã có lịch lúc này, vui lòng chọn giờ khác!');
        return;
      }

      // Thêm lịch mới vào bảng
      addAppointment({
        customerName: values.customerName,
        staffId: values.staffId,
        time: timeString
      });

      message.success('Đặt lịch thành công!');
      setIsModalOpen(false); // Đóng popup
      form.resetFields();    // Xóa trắng form để lần sau nhập tiếp
      
    } catch (error) {
      console.error("Lỗi khi submit:", error);
      message.error('Có lỗi xảy ra, bạn nhấn F12 mở Console chụp mình xem nhé!');
    }
  };
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '80vh' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản lý lịch hẹn</h2>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          + Đặt lịch mới
        </Button>
      </div>

      <Table dataSource={items} columns={columns} rowKey="id" bordered />

      {/* --- Cửa sổ Form Đặt lịch --- */}
     <Modal 
        title="Đặt lịch hẹn mới" 
        visible={isModalOpen} // <-- Đổi thành visible nhé
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Nhập tên khách hàng..." />
          </Form.Item>
          
          <Form.Item name="staffId" label="Chọn nhân viên" rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}>
            <Select placeholder="-- Chọn nhân viên --">
              <Select.Option value="NV01">Nguyễn Văn A</Select.Option>
              <Select.Option value="NV02">Trần Thị B</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="time" label="Thời gian" rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}>
             {/* Thầy có dặn dùng MyDatepicker, nếu trong project base của nhóm có file MyDatepicker.tsx thì bạn import vào thay cho DatePicker của antd này nhé */}
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} placeholder="Chọn ngày và giờ" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit">Xác nhận</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentPage;