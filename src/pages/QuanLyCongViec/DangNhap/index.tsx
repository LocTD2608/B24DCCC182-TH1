import { LoginOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Typography } from 'antd';
import React, { useEffect } from 'react';
import { history, useModel } from 'umi';
import styles from './index.less';

const { Title, Text } = Typography;

const DangNhapPage: React.FC = () => {
  const { dangNhap, daDangNhap, loading, error, setError } = useModel('quanlyconviec.auth');
  const [form] = Form.useForm();

  // Nếu đã đăng nhập → chuyển sang trang chính
  useEffect(() => {
    if (daDangNhap) {
      history.replace('/quan-ly-cong-viec/dashboard');
    }
  }, [daDangNhap]);

  const handleFinish = (values: { ten: string }) => {
    const ok = dangNhap(values.ten);
    if (ok) {
      history.push('/quan-ly-cong-viec/dashboard');
    }
  };

  return (
    <div className={styles.container}>
      {/* Phần nền trái */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <TeamOutlined className={styles.heroIcon} />
          <Title level={2} className={styles.heroTitle}>
            Quản lý Công việc Nhóm
          </Title>
          <Text className={styles.heroSubtitle}>
            Phân công, theo dõi và hoàn thành công việc dễ dàng hơn bao giờ hết.
          </Text>

          <div className={styles.featureList}>
            {[
              '✅ Phân công công việc theo nhóm',
              '📅 Theo dõi deadline trực quan',
              '🔍 Lọc và tìm kiếm nhanh',
              '📊 Thống kê tiến độ',
            ].map((item) => (
              <div key={item} className={styles.featureItem}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phần form phải */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <div className={styles.avatarCircle}>
              <UserOutlined />
            </div>
            <Title level={3} className={styles.formTitle}>
              Đăng nhập
            </Title>
            <Text className={styles.formSubtitle}>Nhập tên của bạn để bắt đầu</Text>
          </div>

          {error && (
            <Alert
              message={error}
              type='error'
              showIcon
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: 16 }}
            />
          )}

          <Form
            form={form}
            layout='vertical'
            onFinish={handleFinish}
            autoComplete='off'
            size='large'
          >
            <Form.Item
              label='Tên người dùng'
              name='ten'
              rules={[
                { required: true, message: 'Vui lòng nhập tên của bạn!' },
                { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
                { max: 50, message: 'Tên không được vượt quá 50 ký tự!' },
              ]}
            >
              <Input
                id='input-ten-nguoi-dung'
                prefix={<UserOutlined className={styles.inputIcon} />}
                placeholder='Ví dụ: Nguyễn Văn A'
                allowClear
                autoFocus
              />
            </Form.Item>

            <Form.Item>
              <Button
                id='btn-dang-nhap'
                type='primary'
                htmlType='submit'
                block
                icon={<LoginOutlined />}
                loading={loading}
                className={styles.submitBtn}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.hint}>
            <Text type='secondary' style={{ fontSize: 12 }}>
              💡 Tên của bạn sẽ được lưu trong trình duyệt. Không cần mật khẩu.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangNhapPage;
