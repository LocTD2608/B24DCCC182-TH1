import type { IColumn } from '@/components/Table/typing';
import { SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Input, Select, Space, Table, Tag, Typography } from 'antd';
import type { FilterDropdownProps } from 'antd/lib/table/interface';
import { useEffect, useRef } from 'react';
import { useModel } from 'umi';
import ChangeClubModal from './ChangeClubModal';

const { Title } = Typography;

const QuanLyCLB: React.FC = () => {
    const {
        clubs,
        members,
        selectedClubId,
        selectedRowKeys,
        setSelectedRowKeys,
        changeClubModalVisible,
        setChangeClubModalVisible,
        fetchClubs,
        handleSelectClub,
        openChangeClubModal,
        handleChangeClub,
    } = useModel('quanLyCLB');

    const searchInput = useRef<any>(null);

    useEffect(() => {
        fetchClubs();
    }, []);

    /** Helper: tạo props tìm kiếm cho 1 column */
    const getColumnSearchProps = (dataIndex: keyof QuanLyCLB.Member, title: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Tìm ${title}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Tìm
                    </Button>
                    <Button onClick={() => { clearFilters?.(); confirm(); }} size='small' style={{ width: 90 }}>
                        Xóa
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value: any, record: QuanLyCLB.Member) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toString().toLowerCase()),
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    /** Cấu hình columns cho Table */
    const columns: IColumn<QuanLyCLB.Member>[] = [
        {
            title: 'STT',
            width: 60,
            align: 'center',
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Họ tên',
            dataIndex: 'hoTen',
            key: 'hoTen',
            width: 200,
            sorter: (a: QuanLyCLB.Member, b: QuanLyCLB.Member) => a.hoTen.localeCompare(b.hoTen),
            ...getColumnSearchProps('hoTen', 'Họ tên'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 220,
            sorter: (a: QuanLyCLB.Member, b: QuanLyCLB.Member) => a.email.localeCompare(b.email),
            ...getColumnSearchProps('email', 'Email'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'soDienThoai',
            key: 'soDienThoai',
            width: 150,
            ...getColumnSearchProps('soDienThoai', 'SĐT'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            width: 120,
            align: 'center',
            render: (val: string) => <Tag color='green'>{val}</Tag>,
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'ngayThamGia',
            key: 'ngayThamGia',
            width: 150,
            sorter: (a: QuanLyCLB.Member, b: QuanLyCLB.Member) =>
                new Date(a.ngayThamGia).getTime() - new Date(b.ngayThamGia).getTime(),
        },
    ];

    /** Config row selection */
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => {
            setSelectedRowKeys(keys as string[]);
        },
    };


    return (
        <div>
            <Title level={3}>Quản lý Thành viên Câu lạc bộ</Title>

            {/* Thanh toolbar: chọn CLB + nút chuyển CLB */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Space>
                    <span style={{ fontWeight: 500 }}>Câu lạc bộ:</span>
                    <Select
                        style={{ width: 250 }}
                        value={selectedClubId || undefined}
                        onChange={handleSelectClub}
                        placeholder='-- Chọn Câu lạc bộ --'
                    >
                        {clubs.map((club: QuanLyCLB.Club) => (
                            <Select.Option key={club.id} value={club.id}>
                                {club.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Space>

                <Button
                    type='primary'
                    icon={<SwapOutlined />}
                    disabled={selectedRowKeys.length === 0}
                    onClick={openChangeClubModal}
                >
                    Chuyển CLB ({selectedRowKeys.length})
                </Button>
            </div>

            {/* Bảng thành viên */}
            <Table
                rowKey='id'
                dataSource={members}
                columns={columns as any}
                rowSelection={rowSelection}
                bordered
                pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} thành viên` }}
                locale={{ emptyText: selectedClubId ? 'Không có thành viên nào' : 'Vui lòng chọn Câu lạc bộ' }}
            />

            {/* Modal chuyển CLB */}
            <ChangeClubModal
                visible={changeClubModalVisible}
                selectedCount={selectedRowKeys.length}
                currentClubId={selectedClubId}
                onCancel={() => setChangeClubModalVisible(false)}
                onOk={handleChangeClub}
            />
        </div>
    );
};

export default QuanLyCLB;
