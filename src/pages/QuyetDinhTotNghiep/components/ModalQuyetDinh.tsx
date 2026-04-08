import React from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';
// Sửa dòng import moment này
import moment from 'moment';

const ModalQuyetDinh = (props: { visible: boolean; onCancel: () => void; record: any }) => {
  const { visible, onCancel, record } = props;
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (record) {
        form.setFieldsValue({ 
          ...record, 
          // Đảm bảo ngayBanHanh là một object moment
          ngayBanHanh: record.ngayBanHanh ? moment(record.ngayBanHanh) : null 
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, record, form]);

  return (
    <Modal 
      title={record ? "Sửa quyết định" : "Thêm quyết định"} 
      visible={visible}
      onCancel={onCancel} 
      onOk={() => form.submit()}
      // Thêm destroyOnClose để mỗi lần mở là form mới hoàn toàn
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="soQD" label="Số quyết định" rules={[{ required: true, message: 'Vui lòng nhập số QĐ' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="ngayBanHanh" label="Ngày ban hành" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item name="tenSoVanBang" label="Thuộc sổ" rules={[{ required: true }]}>
          <Select placeholder="Chọn sổ văn bằng">
            <Select.Option value="Sổ K67">Sổ K67</Select.Option>
            <Select.Option value="Sổ K68">Sổ K68</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="trichYeu" label="Trích yếu">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalQuyetDinh;