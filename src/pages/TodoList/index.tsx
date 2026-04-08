import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Popconfirm, message, Modal, Form, Input, Select, DatePicker, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

// ... (code interface Todo và các phần dưới của bạn cứ giữ nguyên nhé)
interface Todo {
    id: number;
    title: string;
    assignee: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    deadline: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

const STORAGE_KEY = 'todolist_advanced'; // Đổi key để không bị xung đột với data cũ

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form] = Form.useForm();

    // Lấy data từ localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setTodos(JSON.parse(stored));
            } catch (error) {
                console.error('Lỗi khi tải todos:', error);
            }
        }
    }, []);

    // Lưu data vào localStorage mỗi khi todos thay đổi
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    // Mở Modal Thêm mới
    const showAddModal = () => {
        setEditingId(null);
        form.resetFields();
        form.setFieldsValue({ status: 'TODO', priority: 'MEDIUM' }); // Gán giá trị mặc định
        setIsModalVisible(true);
    };

    // Mở Modal Chỉnh sửa
    const showEditModal = (record: Todo) => {
        setEditingId(record.id);
        form.setFieldsValue({
            ...record,
            deadline: dayjs(record.deadline), // Format lại ngày cho form
        });
        setIsModalVisible(true);
    };

    // Xử lý Xóa
    const handleDelete = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
        message.success('Đã xoá công việc!');
    };

    // Xử lý Submit Form (Lưu hoặc Cập nhật)
    const handleFinish = (values: any) => {
        const todoData = {
            ...values,
            deadline: values.deadline.format('YYYY-MM-DD'), // Lưu chuẩn ngày tháng
        };

        if (editingId) {
            setTodos(todos.map(todo => (todo.id === editingId ? { ...todo, ...todoData } : todo)));
            message.success('Đã cập nhật công việc!');
        } else {
            const newTodo: Todo = { id: Date.now(), ...todoData };
            setTodos([newTodo, ...todos]);
            message.success('Đã thêm công việc mới!');
        }
        setIsModalVisible(false);
    };

    // 2. Cấu hình các cột cho Bảng
    const columns = [
        {
            title: 'Tên công việc',
            dataIndex: 'title',
            key: 'title',
            fontWeight: 'bold',
        },
        {
            title: 'Người được giao',
            dataIndex: 'assignee',
            key: 'assignee',
        },
        {
            title: 'Độ ưu tiên',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: string) => {
                const config: Record<string, { color: string; text: string }> = {
                    HIGH: { color: 'red', text: 'Cao' },
                    MEDIUM: { color: 'orange', text: 'Trung bình' },
                    LOW: { color: 'blue', text: 'Thấp' },
                };
                const { color, text } = config[priority] || config.MEDIUM;
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const config: Record<string, { color: string; text: string }> = {
                    DONE: { color: 'green', text: 'Đã xong' },
                    IN_PROGRESS: { color: 'geekblue', text: 'Đang làm' },
                    TODO: { color: 'default', text: 'Chưa làm' },
                };
                const { color, text } = config[status] || config.TODO;
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Todo) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => showEditModal(record)} />
                    <Popconfirm
                        title="Bạn có chắc muốn xoá?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xoá"
                        cancelText="Hủy"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0 }}>Danh sách Công việc</Title>
                        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} size="large">
                            Thêm công việc
                        </Button>
                    </div>
                    <Table 
                        dataSource={todos} 
                        columns={columns} 
                        rowKey="id" 
                        pagination={{ pageSize: 5 }} 
                        locale={{ emptyText: 'Chưa có công việc nào, hãy thêm mới!' }}
                    />
                </Space>
            </Card>

            {/* Form nhập liệu */}
            <Modal
                title={editingId ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="title" label="Tên công việc" rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}>
                        <Input placeholder="Nhập tên..." />
                    </Form.Item>

                    <Form.Item name="assignee" label="Người được giao" rules={[{ required: true, message: 'Vui lòng nhập người nhận việc!' }]}>
                        <Input placeholder="Nhập tên người giao..." />
                    </Form.Item>

                    <Form.Item name="priority" label="Mức độ ưu tiên">
                        <Select>
                            <Option value="LOW">Thấp</Option>
                            <Option value="MEDIUM">Trung bình</Option>
                            <Option value="HIGH">Cao</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="deadline" label="Thời hạn (Deadline)" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái">
                        <Select>
                            <Option value="TODO">Chưa làm</Option>
                            <Option value="IN_PROGRESS">Đang làm</Option>
                            <Option value="DONE">Đã xong</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">Lưu</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TodoList;