import { Modal, Form, Input, DatePicker, Switch } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import dayjs from 'dayjs';
import type { ClubType } from '@/models/club';

export default function ClubForm(props: any) {
  const { open, setOpen, editing } = props;
  const { clubs, setClubs } = useModel('club');

  const [form] = Form.useForm();

  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        ...editing,
        foundedDate: editing.foundedDate
          ? dayjs(editing.foundedDate)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [editing]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const data: ClubType = {
        ...values,
        id: editing ? editing.id : Date.now(),
        foundedDate: values.foundedDate
          ? values.foundedDate.format('YYYY-MM-DD')
          : '',
      };

      if (editing) {
        const newData = clubs.map((c: ClubType) =>
          c.id === editing.id ? data : c
        );
        setClubs(newData);
      } else {
        setClubs([...clubs, data]);
      }

      setOpen(false);
    });
  };

  return (
    <Modal
      title={editing ? 'Sửa CLB' : 'Thêm CLB'}
      visible={open}
      onOk={handleSubmit}
      onCancel={() => setOpen(false)}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên CLB"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="president" label="Chủ nhiệm">
          <Input />
        </Form.Item>

        <Form.Item name="foundedDate" label="Ngày thành lập">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Hoạt động"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}