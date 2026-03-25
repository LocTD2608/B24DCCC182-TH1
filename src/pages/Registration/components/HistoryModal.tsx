import React from 'react';
import { Modal, Timeline, Tag, Typography } from 'antd';
import { RegistrationItem } from '../data';

interface Props {
  visible: boolean;
  onCancel: () => void;
  data?: RegistrationItem;
}

const HistoryModal: React.FC<Props> = ({ visible, onCancel, data }) => {
  return (
    <Modal 
      title={`Lịch sử đơn: ${data?.fullName}`} 
      visible={visible} // Dùng visible thay vì open
      onCancel={onCancel} 
      footer={null}
    >
      {data?.history && data.history.length > 0 ? (
        <Timeline>
          {data.history.map((log, index) => (
            <Timeline.Item key={index} color={log.action === 'Approved' ? 'green' : 'red'}>
              <Typography.Text strong>{log.time}</Typography.Text> - 
              <Tag color={log.action === 'Approved' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                {log.action}
              </Tag>
              <div style={{ marginTop: 4 }}>
                <small>Người thực hiện: {log.adminName}</small>
                {log.reason && <p style={{ margin: 0 }}>Lý do: <i>{log.reason}</i></p>}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <p>Chưa có lịch sử thao tác cho đơn này.</p>
      )}
    </Modal>
  );
};

export default HistoryModal;