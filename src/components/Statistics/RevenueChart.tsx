import React from 'react';
import { Column, ColumnConfig } from '@ant-design/charts';
import { Card } from 'antd';

interface Props {
  data: { label: string; value: number }[];
  title: string;
}

const RevenueChart: React.FC<Props> = ({ data, title }) => {
  const config: ColumnConfig = {
    data,
    xField: 'label',
    yField: 'value',
    label: {
      position: 'middle',
      style: { fill: '#FFFFFF',
         opacity: 0.6 },
    },
    meta: {
      label: { alias: 'Thời gian' },
      value: { alias: 'Doanh thu' },
    },
  };

  return (
    <Card title={title} bordered={false}>
      <Column {...config} />
    </Card>
  );
};

export default RevenueChart;