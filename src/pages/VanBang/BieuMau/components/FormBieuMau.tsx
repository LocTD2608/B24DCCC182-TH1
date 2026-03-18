import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormBieuMau = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
    useModel('vanbang.bieumau');
  const title = props?.title ?? '';

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else if (record?._id) form.setFieldsValue(record);
  }, [record?._id, visibleForm]);

  const onFinish = async (values: BieuMau.IRecord) => {
    if (edit) {
      putModel(record?._id ?? '', values)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(values)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
  };

  return (
    <Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item
          name="tenTruong"
          label="Tên trường thông tin"
          rules={[...rules.required, ...rules.text, ...rules.length(150)]}
        >
          <Input placeholder="Ví dụ: Điểm trung bình, Dân tộc" />
        </Form.Item>

        <Form.Item
          name="kieuDuLieu"
          label="Kiểu dữ liệu"
          rules={[...rules.required]}
        >
          <Select placeholder="Chọn một kiểu dữ liệu">
            <Select.Option value="String">String (Chuỗi ký tự)</Select.Option>
            <Select.Option value="Number">Number (Số)</Select.Option>
            <Select.Option value="Date">Date (Ngày tháng)</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="moTa"
          label="Mô tả / Ghi chú"
          rules={[...rules.length(500)]}
        >
          <Input.TextArea rows={3} placeholder="Mô tả mục đích của trường này" />
        </Form.Item>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormBieuMau;
