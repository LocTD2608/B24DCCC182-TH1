import { Table } from 'antd';
import { formatCurrency } from '@/utils/format';

const ServiceTable = ({ data }: { data: any[] }) => {
  const columns = [
    { title: 'Tên Dịch vụ', dataIndex: 'service', key: 'service' },
    { 
      title: 'Doanh thu', 
      dataIndex: 'amount', 
      render: (val: number) => <b>{formatCurrency(val)}</b> 
    },
  ];
  return <Table dataSource={data} columns={columns} rowKey="service" pagination={{ pageSize: 5 }} />;
};

export default ServiceTable;