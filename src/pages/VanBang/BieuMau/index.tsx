import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormBieuMau from './components/FormBieuMau';

const BieuMauPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('vanbang.bieumau');

  const columns: IColumn<BieuMau.IRecord>[] = [
    {
      title: 'Tên trường thông tin',
      dataIndex: 'tenTruong',
      width: 200,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'kieuDuLieu',
      width: 150,
      filterType: 'select',
      filterData: ['String', 'Number', 'Date'],
      sortable: true,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      width: 250,
      filterType: 'string',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: BieuMau.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record?._id ?? '', getModel)}
              title="Bạn có chắc chắn muốn xóa trường này khỏi cấu hình văn bằng?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="vanbang.bieumau"
      title="Cấu hình biểu mẫu phụ lục văn bằng"
      Form={FormBieuMau}
    />
  );
};

export default BieuMauPage;
