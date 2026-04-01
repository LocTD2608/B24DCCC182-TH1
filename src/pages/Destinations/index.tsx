'use client'

import React, { useMemo, useState } from 'react';
import { Card, Col, Row, Rate, Select, Slider, Space, Tag, Typography, Button, Form, Input, InputNumber, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

type DestinationType = 'beach' | 'mountain' | 'city';

type Destination = {
  id: number;
  title: string;
  location: string;
  type: DestinationType;
  price: number;
  rating: number;
  image: string;
};

const initialData: Destination[] = [
  // Beach destinations
  {
    id: 1,
    title: 'Đà Nẵng',
    location: 'Miền Trung',
    type: 'beach',
    price: 4.5,
    rating: 4.6,
    image: 'https://picsum.photos/seed/danang/600/400',
  },
  {
    id: 2,
    title: 'Phú Quốc',
    location: 'Kiên Giang',
    type: 'beach',
    price: 6.5,
    rating: 4.8,
    image: 'https://picsum.photos/seed/phuquoc/600/400',
  },
  {
    id: 3,
    title: 'Nha Trang',
    location: 'Khánh Hòa',
    type: 'beach',
    price: 3.8,
    rating: 4.5,
    image: 'https://picsum.photos/seed/nhatrang/600/400',
  },
  {
    id: 4,
    title: 'Vũng Tàu',
    location: 'Bà Rịa - Vũng Tàu',
    type: 'beach',
    price: 2.5,
    rating: 4.2,
    image: 'https://picsum.photos/seed/vungtau/600/400',
  },
  {
    id: 5,
    title: 'Cù Lao Chàm',
    location: 'Quảng Nam',
    type: 'beach',
    price: 3.2,
    rating: 4.7,
    image: 'https://picsum.photos/seed/culao/600/400',
  },
  {
    id: 6,
    title: 'Hạ Long Bay',
    location: 'Quảng Ninh',
    type: 'beach',
    price: 5.0,
    rating: 4.9,
    image: 'https://picsum.photos/seed/halong/600/400',
  },
  {
    id: 7,
    title: 'Mũi Né',
    location: 'Bình Thuận',
    type: 'beach',
    price: 3.5,
    rating: 4.4,
    image: 'https://picsum.photos/seed/muine/600/400',
  },
  {
    id: 8,
    title: 'Cần Thơ',
    location: 'Cần Thơ',
    type: 'beach',
    price: 1.8,
    rating: 4.1,
    image: 'https://picsum.photos/seed/cantho/600/400',
  },

  // Mountain destinations
  {
    id: 9,
    title: 'Sa Pa',
    location: 'Lào Cai',
    type: 'mountain',
    price: 3.2,
    rating: 4.4,
    image: 'https://picsum.photos/seed/sapa/600/400',
  },
  {
    id: 10,
    title: 'Fansipan',
    location: 'Lào Cai',
    type: 'mountain',
    price: 4.5,
    rating: 4.6,
    image: 'https://picsum.photos/seed/fansipan/600/400',
  },
  {
    id: 11,
    title: 'Đà Lạt',
    location: 'Lâm Đồng',
    type: 'mountain',
    price: 4.0,
    rating: 4.7,
    image: 'https://picsum.photos/seed/dalat/600/400',
  },
  {
    id: 12,
    title: 'Tây Nguyên',
    location: 'Gia Lai',
    type: 'mountain',
    price: 2.8,
    rating: 4.3,
    image: 'https://picsum.photos/seed/taynguyen/600/400',
  },
  {
    id: 13,
    title: 'Cát Bà',
    location: 'Hải Phòng',
    type: 'mountain',
    price: 3.5,
    rating: 4.5,
    image: 'https://picsum.photos/seed/catba/600/400',
  },
  {
    id: 14,
    title: 'Mộc Châu',
    location: 'Sơn La',
    type: 'mountain',
    price: 2.5,
    rating: 4.2,
    image: 'https://picsum.photos/seed/mochchau/600/400',
  },
  {
    id: 15,
    title: 'Tam Đảo',
    location: 'Vĩnh Phúc',
    type: 'mountain',
    price: 2.0,
    rating: 4.0,
    image: 'https://picsum.photos/seed/tamdao/600/400',
  },
  {
    id: 16,
    title: 'Sơn Trà',
    location: 'Đà Nẵng',
    type: 'mountain',
    price: 3.0,
    rating: 4.3,
    image: 'https://picsum.photos/seed/sontra/600/400',
  },

  // City destinations
  {
    id: 17,
    title: 'Hà Nội',
    location: 'Miền Bắc',
    type: 'city',
    price: 2.0,
    rating: 4.2,
    image: 'https://picsum.photos/seed/hanoi/600/400',
  },
  {
    id: 18,
    title: 'TP. Hồ Chí Minh',
    location: 'Nam Bộ',
    type: 'city',
    price: 2.5,
    rating: 4.3,
    image: 'https://picsum.photos/seed/hcm/600/400',
  },
  {
    id: 19,
    title: 'Huế',
    location: 'Thừa Thiên Huế',
    type: 'city',
    price: 2.2,
    rating: 4.4,
    image: 'https://picsum.photos/seed/hue/600/400',
  },
  {
    id: 20,
    title: 'Hội An',
    location: 'Quảng Nam',
    type: 'city',
    price: 3.0,
    rating: 4.6,
    image: 'https://picsum.photos/seed/hoian/600/400',
  },
  {
    id: 21,
    title: 'Cần Thơ',
    location: 'Cần Thơ',
    type: 'city',
    price: 1.8,
    rating: 4.1,
    image: 'https://picsum.photos/seed/cantho2/600/400',
  },
  {
    id: 22,
    title: 'Hải Phòng',
    location: 'Hải Phòng',
    type: 'city',
    price: 1.9,
    rating: 4.0,
    image: 'https://picsum.photos/seed/haiphong/600/400',
  },
  {
    id: 23,
    title: 'Đà Lạt City',
    location: 'Lâm Đồng',
    type: 'city',
    price: 3.5,
    rating: 4.5,
    image: 'https://picsum.photos/seed/dalatcity/600/400',
  },
  {
    id: 24,
    title: 'Quy Nhơn',
    location: 'Bình Định',
    type: 'city',
    price: 2.8,
    rating: 4.2,
    image: 'https://picsum.photos/seed/quynhon/600/400',
  },
];

const TYPE_LABEL: Record<DestinationType, string> = {
  beach: 'Biển',
  mountain: 'Núi',
  city: 'Thành phố',
};

type SortKey = 'ratingDesc' | 'priceAsc' | 'priceDesc';

// CSS Animations
const styles = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeOutScale {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInOverlay {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(4px);
    }
  }

  @keyframes fadeOutOverlay {
    from {
      opacity: 1;
      backdrop-filter: blur(4px);
    }
    to {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
  }

  .form-overlay {
    animation: fadeInOverlay 0.3s ease-out;
  }

  .form-overlay.closing {
    animation: fadeOutOverlay 0.3s ease-out;
  }

  .form-card {
    animation: fadeInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .form-card.closing {
    animation: fadeOutScale 0.3s ease-in;
  }

  .destination-card {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .destination-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .button-add {
    transition: all 0.3s ease;
  }

  .button-add:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .card-action-button {
    transition: all 0.3s ease;
  }

  .card-action-button:hover {
    transform: scale(1.05);
  }

  .filter-section {
    animation: slideUp 0.5s ease-out;
  }

  .cards-grid {
    animation: slideUp 0.6s ease-out;
  }
`;

const DestinationsPage: React.FC = () => {
  const [data, setData] = useState<Destination[]>(() => {
    const saved = localStorage.getItem('destinations');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [type, setType] = useState<'all' | DestinationType>('all');
  const [sort, setSort] = useState<SortKey>('ratingDesc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10]);
  const [showForm, setShowForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // Lưu vào localStorage
  const saveToLocalStorage = (newData: Destination[]) => {
    localStorage.setItem('destinations', JSON.stringify(newData));
    setData(newData);
  };

  // Filter và Sort
  const filtered = useMemo(() => {
    const list = data.filter((d) => {
      const okType = type === 'all' ? true : d.type === type;
      const okPrice = d.price >= priceRange[0] && d.price <= priceRange[1];
      return okType && okPrice;
    });

    list.sort((a, b) => {
      if (sort === 'ratingDesc') return b.rating - a.rating;
      if (sort === 'priceAsc') return a.price - b.price;
      return b.price - a.price;
    });

    return list;
  }, [data, type, sort, priceRange]);

  // Thêm điểm đến
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const newDestination: Destination = {
        id: data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1,
        title: values.title,
        location: values.location,
        type: values.type,
        price: values.price,
        rating: values.rating || 0,
        image: values.image || 'https://via.placeholder.com/600x400?text=No+Image',
      };

      const updated = [...data, newDestination];
      saveToLocalStorage(updated);
      form.resetFields();
      setIsClosing(true);
      setTimeout(() => {
        setShowForm(false);
        setIsClosing(false);
      }, 300);
      message.success('✅ Thêm điểm đến thành công!');
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  // Sửa điểm đến
  const handleEdit = (destination: Destination) => {
    setEditingId(destination.id);
    form.setFieldsValue({
      title: destination.title,
      location: destination.location,
      type: destination.type,
      price: destination.price,
      rating: destination.rating,
      image: destination.image,
    });
    setShowForm(true);
  };

  // Cập nhật điểm đến
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updated = data.map((d) =>
        d.id === editingId
          ? {
              ...d,
              title: values.title,
              location: values.location,
              type: values.type,
              price: values.price,
              rating: values.rating,
              image: values.image,
            }
          : d
      );

      saveToLocalStorage(updated);
      form.resetFields();
      setIsClosing(true);
      setTimeout(() => {
        setShowForm(false);
        setEditingId(null);
        setIsClosing(false);
      }, 300);
      message.success('✅ Cập nhật điểm đến thành công!');
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  // Xóa điểm đến
  const handleDelete = (id: number) => {
    if (confirm('❓ Bạn có chắc chắn muốn xóa?')) {
      const updated = data.filter((d) => d.id !== id);
      saveToLocalStorage(updated);
      message.success('✅ Xóa điểm đến thành công!');
    }
  };

  // Đóng form
  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowForm(false);
      setEditingId(null);
      form.resetFields();
      setIsClosing(false);
    }, 300);
  };

  return (
    <div style={{ padding: 24, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <style>{styles}</style>

      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} style={{ marginBottom: 4, marginTop: 0 }}>
              🌍 Khám phá Việt Nam
            </Title>
            <Text type="secondary">
              Khám phá {filtered.length} điểm đến tuyệt vời - Thêm, Sửa, Xóa các địa điểm yêu thích của bạn
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setShowForm(true);
            }}
            className="button-add"
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          >
             Thêm Điểm Đến
          </Button>
        </div>

        {/* Filters */}
        <div className="filter-section" style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
          <Space wrap size={16}>
            <Space direction="vertical" size={4}>
              <Text strong>Loại hình</Text>
              <Select
                style={{ width: 180 }}
                value={type}
                onChange={(v) => setType(v)}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'beach', label: '🏖️ Biển' },
                  { value: 'mountain', label: '⛰️ Núi' },
                  { value: 'city', label: '🏙️ Thành phố' },
                ]}
              />
            </Space>

            <Space direction="vertical" size={4}>
              <Text strong>Giá (0 → 10 triệu VNĐ)</Text>
              <Slider
                range
                min={0}
                max={10}
                step={0.5}
                value={priceRange}
                onChange={(v) => setPriceRange(v as [number, number])}
                style={{ width: 260 }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {priceRange[0].toFixed(1)} - {priceRange[1].toFixed(1)} triệu VNĐ
              </Text>
            </Space>

            <Space direction="vertical" size={4}>
              <Text strong>Sắp xếp</Text>
              <Select
                style={{ width: 220 }}
                value={sort}
                onChange={(v) => setSort(v)}
                options={[
                  { value: 'ratingDesc', label: '⭐ Đánh giá: Cao → Thấp' },
                  { value: 'priceAsc', label: '💰 Giá: Thấp → Cao' },
                  { value: 'priceDesc', label: '💸 Giá: Cao → Thấp' },
                ]}
              />
            </Space>
          </Space>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid">
          <Row gutter={[16, 16]}>
            {filtered.length === 0 ? (
              <Col xs={24}>
                <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <Title level={4}>🔍 Không có điểm đến nào phù hợp</Title>
                  <Text type="secondary">Hãy thử thay đổi bộ lọc hoặc thêm điểm đến mới</Text>
                </Card>
              </Col>
            ) : (
              filtered.map((d, index) => (
                <Col key={d.id} xs={24} sm={12} md={8} lg={6} style={{ animation: `slideUp 0.6s ease-out ${index * 0.05}s backwards` }}>
                  <Card
                    hoverable
                    className="destination-card"
                    cover={
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                          alt={d.title}
                          src={d.image}
                          style={{ height: 180, objectFit: 'cover', width: '100%' }}
                        />
                        <Tag
                          color={d.type === 'beach' ? 'blue' : d.type === 'mountain' ? 'green' : 'orange'}
                          style={{ position: 'absolute', top: 8, right: 8 }}
                        >
                          {TYPE_LABEL[d.type]}
                        </Tag>
                      </div>
                    }
                  >
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <div>
                        <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>
                          {d.title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          📍 {d.location}
                        </Text>
                      </div>

                      <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                        <Rate allowHalf disabled defaultValue={d.rating} style={{ fontSize: '14px' }} />
                        <Text strong style={{ fontSize: '12px' }}>
                          {d.rating.toFixed(1)}/5
                        </Text>
                      </Space>

                      <div style={{ backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                        <Text style={{ fontSize: '14px' }}>
                          💰 <Text strong>{d.price.toFixed(1)}</Text> triệu VNĐ
                        </Text>
                      </div>

                      {/* Actions */}
                      <Space style={{ width: '100%', marginTop: 12, justifyContent: 'space-between' }}>
                        <Button
                          type="primary"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(d)}
                          className="card-action-button"
                          style={{ cursor: 'pointer', flex: 1 }}
                        >
                          Sửa
                        </Button>
                        <Button
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(d.id)}
                          className="card-action-button"
                          style={{ cursor: 'pointer', flex: 1 }}
                        >
                          Xóa
                        </Button>
                      </Space>
                    </Space>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>

        {/* Stats */}
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', marginTop: '20px' }}>
          <Space size={32}>
            <div>
              <Text strong style={{ fontSize: '18px' }}>📊 {filtered.length}</Text>
              <br />
              <Text type="secondary">Điểm đến</Text>
            </div>
            <div>
              <Text strong style={{ fontSize: '18px' }}>🏖️ {data.filter(d => d.type === 'beach').length}</Text>
              <br />
              <Text type="secondary">Biển</Text>
            </div>
            <div>
              <Text strong style={{ fontSize: '18px' }}>⛰️ {data.filter(d => d.type === 'mountain').length}</Text>
              <br />
              <Text type="secondary">Núi</Text>
            </div>
            <div>
              <Text strong style={{ fontSize: '18px' }}>🏙️ {data.filter(d => d.type === 'city').length}</Text>
              <br />
              <Text type="secondary">Thành phố</Text>
            </div>
          </Space>
        </div>
      </Space>

      {/* Floating Form Box */}
      {showForm && (
        <div
          className={`form-overlay ${isClosing ? 'closing' : ''}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
          }}
          onClick={handleCancel}
        >
          <Card
            className={`form-card ${isClosing ? 'closing' : ''}`}
            style={{
              width: '90%',
              maxWidth: 500,
              borderRadius: 12,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                {editingId === null ? ' Thêm Điểm Đến' : '✏️ Cập Nhật Điểm Đến'}
              </Title>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={handleCancel}
                style={{ cursor: 'pointer' }}
              />
            </div>

            <Form
              form={form}
              layout="vertical"
              style={{ marginTop: 20 }}
            >
              <Form.Item
                label="Tên Điểm Đến"
                name="title"
                rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến!' }]}
              >
                <Input placeholder="Nhập tên điểm đến" />
              </Form.Item>

              <Form.Item
                label="Địa Điểm"
                name="location"
                rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
              >
                <Input placeholder="Nhập địa điểm" />
              </Form.Item>

              <Form.Item
                label="Loại Hình"
                name="type"
                rules={[{ required: true, message: 'Vui lòng chọn loại hình!' }]}
              >
                <Select
                  placeholder="Chọn loại hình"
                  options={[
                    { value: 'beach', label: '🏖️ Biển' },
                    { value: 'mountain', label: '⛰️ Núi' },
                    { value: 'city', label: '🏙️ Thành phố' },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Giá (triệu VNĐ)"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={0.5}
                  placeholder="Nhập giá"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="Đánh Giá (0-5)"
                name="rating"
                rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}
              >
                <InputNumber
                  min={0}
                  max={5}
                  step={0.1}
                  placeholder="Nhập đánh giá"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="URL Hình Ảnh"
                name="image"
              >
                <Input placeholder="Nhập URL hình ảnh" />
              </Form.Item>

              <Space style={{ width: '100%', justifyContent: 'flex-end', gap: 10 }}>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button
                  type="primary"
                  onClick={editingId === null ? handleAdd : handleUpdate}
                >
                  {editingId === null ? 'Thêm' : 'Cập nhật'}
                </Button>
              </Space>
            </Form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;