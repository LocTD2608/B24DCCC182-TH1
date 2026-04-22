import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Employee } from './data.d';
import { POSITION_OPTS, DEPARTMENT_OPTS } from './data.d';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '@/services/NhanVien/nhanVien';
import FormNhanVien from './components/FormNhanVien';

const QuanLyNhanVien = () => {
    const [data, setData] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingData, setEditingData] = useState<Employee | undefined>(undefined);

    // Filters
    const [searchText, setSearchText] = useState('');
    const [filterPos, setFilterPos] = useState<string | undefined>(undefined);
    const [filterDept, setFilterDept] = useState<string | undefined>(undefined);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getEmployees();
            if (res.success) {
                setData(res.data);
            }
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddClick = () => {
        setEditingData(undefined);
        setModalVisible(true);
    };

    const handleEditClick = (record: Employee) => {
        setEditingData(record);
        setModalVisible(true);
    };

    const handleDelete = async (id: string, status: string) => {
        if (status !== 'Thử việc' && status !== 'Đã thôi việc') {
            message.error('Chỉ được xoá nhân viên Thử việc hoặc Đã thôi việc!');
            return;
        }
        const success = await deleteEmployee(id);
        if (success) {
            message.success('Xóa nhân viên thành công');
            fetchData();
        } else {
            message.error('Xóa nhân viên thất bại');
        }
    };

    const handleModalFinish = async (values: any) => {
        try {
            if (editingData) {
                await updateEmployee(editingData.id, values);
                message.success('Cập nhật nhân viên thành công');
            } else {
                await addEmployee(values);
                message.success('Thêm nhân viên thành công');
            }
            setModalVisible(false);
            fetchData();
        } catch (e) {
            message.error('Có lỗi xảy ra');
        }
    };

    const filteredData = data.filter(item => {
        const matchSearch = item.id.toLowerCase().includes(searchText.toLowerCase()) ||
            item.fullName.toLowerCase().includes(searchText.toLowerCase());
        const matchPos = filterPos ? item.position === filterPos : true;
        const matchDept = filterDept ? item.department === filterDept : true;
        return matchSearch && matchPos && matchDept;
    });

    const columns = [
        {
            title: 'Mã NV',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Phòng ban',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Lương',
            dataIndex: 'salary',
            key: 'salary',
            sorter: (a: Employee, b: Employee) => a.salary - b.salary,
            defaultSortOrder: 'descend' as const,
            render: (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (val: string) => {
                let color = 'blue';
                if (val === 'Thử việc') color = 'orange';
                if (val === 'Đã thôi việc') color = 'red';
                if (val === 'Nghỉ phép') color = 'purple';
                return <Tag color={color}>{val}</Tag>;
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Employee) => {
                const canDelete = record.status === 'Thử việc' || record.status === 'Đã thôi việc';
                return (
                    <Space>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEditClick(record)}
                        />
                        {canDelete ? (
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xoá nhân viên này?"
                                onConfirm={() => handleDelete(record.id, record.status)}
                            >
                                <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                />
                            </Popconfirm>
                        ) : (
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                                onClick={() => message.warning('Chỉ được xoá nhân viên Thử việc hoặc Đã thôi việc!')}
                            />
                        )}
                    </Space>
                );
            }
        }
    ];

    return (
        <Card title="Quản lý nhân viên">
            <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Space>
                    <Input.Search
                        placeholder="Tìm theo Mã, Họ tên"
                        allowClear
                        onSearch={setSearchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 250 }}
                    />
                    <Select
                        placeholder="Tất cả chức vụ"
                        allowClear
                        style={{ width: 150 }}
                        onChange={setFilterPos}
                    >
                        {POSITION_OPTS.map(opt => <Select.Option key={opt} value={opt}>{opt}</Select.Option>)}
                    </Select>
                    <Select
                        placeholder="Tất cả phòng ban"
                        allowClear
                        style={{ width: 150 }}
                        onChange={setFilterDept}
                    >
                        {DEPARTMENT_OPTS.map(opt => <Select.Option key={opt} value={opt}>{opt}</Select.Option>)}
                    </Select>
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
                    Thêm mới
                </Button>
            </Space>

            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={filteredData}
            />

            <FormNhanVien
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onFinish={handleModalFinish}
                initialValues={editingData}
            />
        </Card>
    );
};

export default QuanLyNhanVien;
