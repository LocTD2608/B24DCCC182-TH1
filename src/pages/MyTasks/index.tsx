import React, { useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { Table, Card, Tag, Typography } from 'antd';
import type { TaskModelState } from '@/models/task'; // Import interface từ model

const { Title } = Typography;

interface MyTasksProps {
  dispatch: Dispatch;
  myTasks: any[];
  loading: boolean;
}

const MyTasksPage: React.FC<MyTasksProps> = ({ dispatch, myTasks, loading }) => {
  useEffect(() => {
    dispatch({
      type: 'task/fetchTasks',
    });
  }, [dispatch]);

  const columns = [
    { title: 'Tên công việc', dataIndex: 'taskName', key: 'taskName' },
    { 
      title: 'Độ ưu tiên', 
      dataIndex: 'priority', 
      render: (tag: string) => {
        let color = tag === 'Cao' ? 'volcano' : tag === 'Trung bình' ? 'geekblue' : 'green';
        return <Tag color={color}>{tag}</Tag>;
      }
    },
    { title: 'Hạn chót', dataIndex: 'deadline', key: 'deadline' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      render: (status: string) => <Tag color="blue">{status}</Tag> 
    },
  ];

  const currentUser = localStorage.getItem('username');

  return (
    <Card title={<Title level={4}>Công việc của: {currentUser || 'Khánh'}</Title>}>
      <Table 
        columns={columns} 
        dataSource={myTasks} 
        rowKey="id" 
        loading={loading}
      />
    </Card>
  );
};

// Lưu ý: Kết nối đúng state từ task model
export default connect(({ task, loading }: { task: TaskModelState; loading: { effects: Record<string, boolean> } }) => ({
  myTasks: task.myTasks,
  loading: loading.effects['task/fetchTasks'],
}))(MyTasksPage);