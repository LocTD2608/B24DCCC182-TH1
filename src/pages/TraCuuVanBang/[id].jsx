import { useEffect, useState } from 'react';
import { useParams, useModel } from 'umi';
import { Descriptions } from 'antd';

export default function Detail() {
  const { id } = useParams();
  const { detail } = useModel('vanbang');
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await detail(id);
    setData(res.data);
  };

  return (
    <Descriptions bordered>
      <Descriptions.Item label="Họ tên">{data.ho_ten}</Descriptions.Item>
      <Descriptions.Item label="MSV">{data.msv}</Descriptions.Item>
      <Descriptions.Item label="Số hiệu">{data.so_hieu}</Descriptions.Item>
      <Descriptions.Item label="Số vào sổ">{data.so_vao_so}</Descriptions.Item>
      <Descriptions.Item label="Quyết định">
        {data.so_quyet_dinh}
      </Descriptions.Item>
    </Descriptions>
  );
}