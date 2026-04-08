/**
 * Component: Bộ lọc và Tìm kiếm
 * ──────────────────────────────────────────────────────────
 * Dùng để lọc danh sách công việc theo mô hình đã định sẵn.
 * Tương tác trực tiếp với model `quanlyconviec.congviec`.
 */

import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

const { Option } = Select;

const BoLocTimKiem: React.FC = () => {
  // Lấy state từ model chung
  const { boLoc, setBoLoc, resetBoLoc, danhSachNguoiDuocGiao } = useModel(
    'quanlyconviec.congviec',
  );
  const [form] = Form.useForm();

  // Đồng bộ form với model (phòng trường hợp reset từ nơi khác)
  useEffect(() => {
    form.setFieldsValue(boLoc);
  }, [boLoc, form]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    // Cập nhật model mỗi khi form thay đổi
    setBoLoc({
      ...boLoc,
      ...allValues,
    });
  };

  const handleClear = () => {
    form.resetFields();
    resetBoLoc();
  };

  return (
    <Card 
      bodyStyle={{ padding: '16px' }} 
      style={{ marginBottom: '16px', borderRadius: '8px' }}
      title="🔎 Tìm kiếm & Lọc"
      extra={
        <Button onClick={handleClear} type="link" danger>
          Xóa bộ lọc
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={boLoc}
      >
        <Row gutter={16}>
          {/* 1. TÌM KIẾM TỪ KHÓA */}
          <Col xs={24} sm={24} md={10} lg={10}>
            <Form.Item label="Từ khóa (Tên công việc)" name="tuKhoa">
              <Input
                placeholder="Nhập tên công việc cần tìm..."
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item>
          </Col>

          {/* 2. LỌC: TRẠNG THÁI */}
          <Col xs={24} sm={12} md={7} lg={7}>
            <Form.Item label="Trạng thái" name="trangThai">
              <Select placeholder="Tất cả trạng thái" allowClear>
                <Option value="chua_lam">⚪ Chưa làm</Option>
                <Option value="dang_lam">🟡 Đang làm</Option>
                <Option value="da_xong">🟢 Đã xong</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* 3. LỌC: NGƯỜI ĐƯỢC GIAO */}
          <Col xs={24} sm={12} md={7} lg={7}>
            <Form.Item label="Người được giao" name="nguoiDuocGiao">
              <Select
                placeholder="Tất cả thành viên"
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {danhSachNguoiDuocGiao.map((nguoi) => (
                  <Option key={nguoi} value={nguoi}>
                    {nguoi}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default BoLocTimKiem;
