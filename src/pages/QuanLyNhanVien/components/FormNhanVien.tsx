import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { POSITION_OPTS, DEPARTMENT_OPTS, STATUS_OPTS } from '../data.d';
import type { Employee } from '../data.d';

interface FormNhanVienProps {
    visible: boolean;
    onCancel: () => void;
    onFinish: (values: Employee) => void;
    initialValues?: Employee;
}

const FormNhanVien: React.FC<FormNhanVienProps> = ({ visible, onCancel, onFinish, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    return (
        <Modal
            title={initialValues ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'}
            visible={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="fullName"
                    label="Họ tên"
                    rules={[
                        { required: true, message: 'Vui lòng nhập họ tên' },
                        { max: 50, message: 'Họ tên không được vượt quá 50 ký tự' },
                        { pattern: /^[^!@#$%^&*()_+={}\[\]:;"'<>,.?/\\\-|~`]+$/, message: 'Họ tên không được chứa ký tự đặc biệt' }
                    ]}
                >
                    <Input placeholder="Nhập họ tên" />
                </Form.Item>
                <Form.Item
                    name="position"
                    label="Chức vụ"
                    rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
                >
                    <Select placeholder="Chọn chức vụ">
                        {POSITION_OPTS.map(opt => <Select.Option key={opt} value={opt}>{opt}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="department"
                    label="Phòng ban"
                    rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
                >
                    <Select placeholder="Chọn phòng ban">
                        {DEPARTMENT_OPTS.map(opt => <Select.Option key={opt} value={opt}>{opt}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="salary"
                    label="Lương"
                    rules={[{ required: true, message: 'Vui lòng nhập lương' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Nhập lương" />
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Trạng thái"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        {STATUS_OPTS.map(opt => <Select.Option key={opt} value={opt}>{opt}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default FormNhanVien;
