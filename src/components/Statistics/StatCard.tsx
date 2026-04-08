import { Card, Statistic } from 'antd';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, prefix, suffix }) => (
  <Card bordered={false} hoverable>
    <Statistic title={title} value={value} prefix={prefix} suffix={suffix} />
  </Card>
);

export default StatCard;