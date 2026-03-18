import { Table, Button } from 'antd';
import { history } from 'umi';

export default function ResultTable({ data }) {
  const columns = [
    { title: "Số hiệu", dataIndex: "so_hieu" },
    { title: "Số vào sổ", dataIndex: "so_vao_so" },
    { title: "MSV", dataIndex: "msv" },
    { title: "Họ tên", dataIndex: "ho_ten" },
    {
      title: "Chi tiết",
      render: (_, record) => (
        <Button onClick={() => history.push(`/tra-cuu-van-bang/${record.id}`)}>
          Xem
        </Button>
      ),
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={data} />;
}