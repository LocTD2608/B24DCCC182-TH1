/**
 * Component: UserBadge
 * ──────────────────────────────────────────────────────────
 * Dùng ở bất kỳ trang nào để hiển thị tên người đang đăng nhập
 * và nút Đăng xuất.
 *
 * Cách dùng:
 *   import UserBadge from '@/components/QuanLyCongViec/UserBadge';
 *   <UserBadge />                  // hiển thị avatar + tên + nút đăng xuất
 *   <UserBadge showLogout={false}  // chỉ hiển thị tên
 */

import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Popconfirm, Space, Tag, Tooltip, Typography } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';

const { Text } = Typography;

interface UserBadgeProps {
  /** Có hiển thị nút đăng xuất không (mặc định: true) */
  showLogout?: boolean;
  /** Kích thước avatar (mặc định: 32) */
  avatarSize?: number;
  /** Compact mode: chỉ avatar, tooltip tên */
  compact?: boolean;
}

const UserBadge: React.FC<UserBadgeProps> = ({
  showLogout = true,
  avatarSize = 32,
  compact = false,
}) => {
  const { currentUser, daDangNhap, dangXuat } = useModel('quanlyconviec.auth');

  if (!daDangNhap || !currentUser) {
    return (
      <Button
        id='btn-di-dang-nhap'
        type='primary'
        size='small'
        icon={<UserOutlined />}
        onClick={() => history.push('/quan-ly-cong-viec/dang-nhap')}
      >
        Đăng nhập
      </Button>
    );
  }

  const firstChar = currentUser.ten.trim()[0]?.toUpperCase() ?? 'U';

  const handleDangXuat = () => {
    dangXuat();
    history.push('/quan-ly-cong-viec/dang-nhap');
  };

  if (compact) {
    return (
      <Tooltip title={`${currentUser.ten} — Nhấn để đăng xuất`}>
        <Avatar
          id='avatar-nguoi-dung'
          size={avatarSize}
          style={{
            background: 'linear-gradient(135deg, #5282ff 0%, #9333ea 100%)',
            cursor: 'pointer',
            fontWeight: 700,
          }}
          onClick={handleDangXuat}
        >
          {firstChar}
        </Avatar>
      </Tooltip>
    );
  }

  return (
    <Space id='user-badge' align='center' size={8}>
      <Avatar
        id='avatar-nguoi-dung-full'
        size={avatarSize}
        style={{
          background: 'linear-gradient(135deg, #5282ff 0%, #9333ea 100%)',
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {firstChar}
      </Avatar>

      <div style={{ lineHeight: '1.3' }}>
        <Text strong style={{ fontSize: 13, display: 'block' }}>
          {currentUser.ten}
        </Text>
        <Tag color='blue' style={{ fontSize: 10, margin: 0, lineHeight: '16px' }}>
          Đã đăng nhập
        </Tag>
      </div>

      {showLogout && (
        <Popconfirm
          title='Đăng xuất?'
          description='Bạn có chắc muốn đăng xuất không?'
          okText='Đăng xuất'
          cancelText='Hủy'
          okButtonProps={{ danger: true }}
          onConfirm={handleDangXuat}
        >
          <Tooltip title='Đăng xuất'>
            <Button
              id='btn-dang-xuat'
              type='text'
              danger
              icon={<LogoutOutlined />}
              size='small'
            />
          </Tooltip>
        </Popconfirm>
      )}
    </Space>
  );
};

export default UserBadge;
