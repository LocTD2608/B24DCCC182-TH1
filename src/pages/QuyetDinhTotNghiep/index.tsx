import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space } from 'antd';
import { connect, useDispatch } from 'umi'; 
import ModalQuyetDinh from './components/ModalQuyetDinh';

const QuyetDinhPage = (props: any) => {
  const { list, dispatch } = props; // Lấy từ props do dùng connect
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch({ type: 'quyetDinh/fetch' });
  }, []);

  const columns = [
    { title: 'Số quyết định', dataIndex: 'soQD' },
    { title: 'Ngày ban hành', dataIndex: 'ngayBanHanh' },
    { title: 'Trích yếu', dataIndex: 'trichYeu' },
    { title: 'Thuộc sổ', dataIndex: 'tenSoVanBang' },
    {
      title: 'Thao tác',
      render: (record: any) => (
        <Space>
          <Button type="link" onClick={() => { setEditing(record); setVisible(true); }}>Sửa</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quyết định tốt nghiệp" extra={<Button type="primary" onClick={() => { setEditing(null); setVisible(true); }}>Thêm mới</Button>}>
      <Table dataSource={list} columns={columns} rowKey="id" />
      <ModalQuyetDinh visible={visible} record={editing} onCancel={() => setVisible(false)} />
    </Card>
  );
};

export default connect(({ quyetDinh }: any) => ({
  list: quyetDinh.list,
}))(QuyetDinhPage);