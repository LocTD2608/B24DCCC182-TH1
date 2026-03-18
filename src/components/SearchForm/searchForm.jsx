import { Form, Input, Button, DatePicker, message } from 'antd';

export default function SearchForm({ onSearch }) {
  const [form] = Form.useForm();

  const handleSearch = () => {
    const values = form.getFieldsValue();

    const filled = Object.values(values).filter(v => v);
    if (filled.length < 2) {
      message.error("Nhập ít nhất 2 trường");
      return;
    }

    onSearch(values);
  };

  return (
    <Form form={form} layout="inline">
      <Form.Item name="soHieu">
        <Input placeholder="Số hiệu văn bằng" />
      </Form.Item>

      <Form.Item name="soVaoSo">
        <Input placeholder="Số vào sổ" />
      </Form.Item>

      <Form.Item name="msv">
        <Input placeholder="Mã sinh viên" />
      </Form.Item>

      <Form.Item name="hoTen">
        <Input placeholder="Họ tên" />
      </Form.Item>

      <Form.Item name="ngaySinh">
        <DatePicker placeholder="Ngày sinh" />
      </Form.Item>

      <Button type="primary" onClick={handleSearch}>
        Tìm kiếm
      </Button>
    </Form>
  );
}