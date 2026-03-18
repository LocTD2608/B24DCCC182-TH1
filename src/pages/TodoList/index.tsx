import React, { useState, useEffect } from 'react';
import { Card, Input, Button, List, Checkbox, Space, Typography, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
// Import component từ thư mục components

const { Title } = Typography;
interface Todo { id: number; text: string; completed: boolean; createdAt: number; }
const STORAGE_KEY = 'todolist';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) { try { setTodos(JSON.parse(stored)); } catch (e) { console.error(e); } }
    }, []);

    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); }, [todos]);

    const handleAdd = () => {
        if (!inputValue.trim()) { message.warning('Vui lòng nhập nội dung!'); return; }
        const newTodo: Todo = { id: Date.now(), text: inputValue.trim(), completed: false, createdAt: Date.now() };
        setTodos([newTodo, ...todos]);
        setInputValue('');
        message.success('Đã thêm thành công!');
    };

    const handleDelete = (id: number) => {
        setTodos(todos.filter(t => t.id !== id));
        message.success('Đã xoá!');
    };

    const saveEdit = () => {
        if (!editText.trim()) return;
        setTodos(todos.map(t => t.id === editId ? { ...t, text: editText.trim() } : t));
        setEditId(null);
        message.success('Đã cập nhật!');
    };

    return (
        <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={2}>Danh sách Todo List</Title>
                    <Space size={0} style={{ width: '100%' }}>
                        <Input 
                            placeholder="Nhập todo mới..." 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)} 
                            onPressEnter={handleAdd}
                            size="large" style={{ flex: 1 }}
                        />
                        <Button type="primary" onClick={handleAdd} size="large">Thêm</Button>
                    </Space>
                    <List
                        dataSource={todos}
                        locale={{ emptyText: 'Chưa có todo nào' }}
                        renderItem={(todo) => (
                            <List.Item actions={[
                                <Button key="edit" icon={<EditOutlined />} onClick={() => { setEditId(todo.id); setEditText(todo.text); }} size="small" />,
                                <Popconfirm key="del" title="Xoá nhé?" onConfirm={() => handleDelete(todo.id)}><Button danger icon={<DeleteOutlined />} size="small" /></Popconfirm>
                            ]}>
                                <Space>
                                    <Checkbox checked={todo.completed} onChange={() => setTodos(todos.map(t => t.id === todo.id ? {...t, completed: !t.completed} : t))} />
                                    {editId === todo.id ? (
                                        <Input value={editText} onChange={(e) => setEditText(e.target.value)} onPressEnter={saveEdit} autoFocus />
                                    ) : (
                                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
                                    )}
                                </Space>
                            </List.Item>
                        )}
                    />
                </Space>
            </Card>
        </div>
    );
};

export default TodoList;