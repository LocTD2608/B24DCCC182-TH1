import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Radio } from 'antd';
import { RegistrationItem } from '../data';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  initialValues?: RegistrationItem;
}

const RegistrationForm: React.FC<Props> = ({ visible, onCancel, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues || { gender: 'Male', status: 'Pending' });
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa đơn' : 'Thêm đơn đăng ký'}
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="clubId" label="Câu lạc bộ" rules={[{ required: true }]}>
          <Select placeholder="Chọn CLB">
            <Select.Option value="c1">CLB Âm Nhạc</Select.Option>
            <Select.Option value="c2">CLB Bóng Đá</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="gender" label="Giới tính">
          <Radio.Group>
            <Radio value="Male">Nam</Radio>
            <Radio value="Female">Nữ</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="talent" label="Sở trường">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="reason" label="Lý do đăng ký">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegistrationForm;