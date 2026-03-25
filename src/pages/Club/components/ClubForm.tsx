import { useModel } from 'umi';
import { Table, Button, Space, Popconfirm, Input } from 'antd';
import { useState } from 'react';
import ClubForm from '../index';
import type { ClubType } from '@/models/club';

export default function ClubPage() {
  const { clubs, setClubs } = useModel('club');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClubType | null>(null);
  const [keyword, setKeyword] = useState('');

  const handleDelete = (id: number) => {
    setClubs(clubs.filter((item: ClubType) => item.id !== id));
  };

  const filteredData = clubs.filter((c: ClubType) =>
    c.name.toLowerCase().includes(keyword.toLowerCase())
  );

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      render: (text: string) =>
        text ? <img src={text} width={50} /> : 'No Image',
    },
    {
      title: 'Tên CLB',
      dataIndex: 'name',
      sorter: (a: ClubType, b: ClubType) =>
        a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      sorter: (a: ClubType, b: ClubType) =>
        new Date(a.foundedDate || '').getTime() -
        new Date(b.foundedDate || '').getTime(),
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'president',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      render: (val: boolean) => (val ? 'Có' : 'Không'),
      filters: [
        { text: 'Có', value: true },
        { text: 'Không', value: false },
      ],
      onFilter: (value: any, record: ClubType) =>
        record.isActive === value,
    },
    {
      title: 'Thao tác',
      render: (_: any, record: ClubType) => (
        <Space>
          <Button
            onClick={() => {
              setEditing(record);
              setOpen(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa CLB?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>

          <Button>Xem thành viên</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm CLB"
          onChange={(e) => setKeyword(e.target.value)}
        />

        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Thêm CLB
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
      />

      <ClubForm
        open={open}
        setOpen={setOpen}
        editing={editing}
      />
    </div>
  );
}