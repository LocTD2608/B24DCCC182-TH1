import React, { useState } from 'react';
import {
    Card, Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag,
    Typography, Row, Col, Divider, InputNumber, Alert, Descriptions, List
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
    ThunderboltOutlined, SaveOutlined
} from '@ant-design/icons';
import type { DeThi, CauTrucDeThi, CoCauDeThi, CauHoi, KhoiKienThuc, MonHoc, MucDoKho } from './types';
import { MUC_DO_KHO_OPTIONS, MUC_DO_KHO_COLOR } from './types';

const { Title, Text } = Typography;

interface Props {
    deThiList: DeThi[];
    setDeThiList: React.Dispatch<React.SetStateAction<DeThi[]>>;
    cauTrucList: CauTrucDeThi[];
    setCauTrucList: React.Dispatch<React.SetStateAction<CauTrucDeThi[]>>;
    cauHoiList: CauHoi[];
    monHocList: MonHoc[];
    khoiKienThucList: KhoiKienThuc[];
}

const DeThiTab: React.FC<Props> = ({
    deThiList, setDeThiList,
    cauTrucList, setCauTrucList,
    cauHoiList, monHocList, khoiKienThucList
}) => {
    const [activeTab, setActiveTab] = useState<'de-thi' | 'cau-truc'>('de-thi');

    // == Cấu trúc đề thi ==
    const [cauTrucModalOpen, setCauTrucModalOpen] = useState(false);
    const [editingCauTruc, setEditingCauTruc] = useState<CauTrucDeThi | null>(null);
    const [cauTrucForm] = Form.useForm();
    const [coCauRows, setCoCauRows] = useState<CoCauDeThi[]>([]);

    // == Tạo đề thi ==
    const [taoDeThiModalOpen, setTaoDeThiModalOpen] = useState(false);
    const [taoDeThiForm] = Form.useForm();
    const [selectedCauTrucId, setSelectedCauTrucId] = useState<string | undefined>();
    const [customCoCau, setCustomCoCau] = useState<CoCauDeThi[]>([]);
    const [previewDeThi, setPreviewDeThi] = useState<CauHoi[] | null>(null);
    const [deThiError, setDeThiError] = useState<string>('');

    // == Xem đề thi ==
    const [viewDeThiModal, setViewDeThiModal] = useState(false);
    const [viewingDeThi, setViewingDeThi] = useState<DeThi | null>(null);

    const getMonHocName = (id: string) => monHocList.find(m => m.id === id)?.tenMon || id;
    const getKhoiName = (id: string) => khoiKienThucList.find(k => k.id === id)?.tenKhoi || id;

    // ====== LOGIC TẠO ĐỀ THI ======
    const generateDeThi = (monHocId: string, coCau: CoCauDeThi[]): { cauHois: CauHoi[], error: string } => {
        const result: CauHoi[] = [];
        const used = new Set<string>();
        let error = '';

        for (const row of coCau) {
            const pool = cauHoiList.filter(
                c => c.monHocId === monHocId &&
                    c.mucDoKho === row.mucDoKho &&
                    c.khoiKienThucId === row.khoiKienThucId &&
                    !used.has(c.id)
            );
            if (pool.length < row.soLuong) {
                const khoiName = getKhoiName(row.khoiKienThucId);
                error = `Không đủ câu hỏi! Cần ${row.soLuong} câu [${row.mucDoKho} / ${khoiName}], hiện có ${pool.length} câu.`;
                return { cauHois: [], error };
            }
            const shuffled = [...pool].sort(() => Math.random() - 0.5);
            const picked = shuffled.slice(0, row.soLuong);
            picked.forEach(c => {
                result.push(c);
                used.add(c.id);
            });
        }
        return { cauHois: result, error: '' };
    };

    const handlePreviewDeThi = async () => {
        try {
            const values = await taoDeThiForm.validateFields(['monHocId']);
            const monHocId = values.monHocId;
            const coCau = selectedCauTrucId
                ? (cauTrucList.find(c => c.id === selectedCauTrucId)?.coCau || [])
                : customCoCau;

            if (!coCau.length) {
                setDeThiError('Vui lòng thêm ít nhất một yêu cầu cơ cấu đề thi!');
                setPreviewDeThi(null);
                return;
            }

            const { cauHois, error } = generateDeThi(monHocId, coCau);
            if (error) {
                setDeThiError(error);
                setPreviewDeThi(null);
            } else {
                setDeThiError('');
                setPreviewDeThi(cauHois);
            }
        } catch {
            // validation error
        }
    };

    const handleSaveDeThi = async () => {
        try {
            const values = await taoDeThiForm.validateFields();
            if (!previewDeThi || previewDeThi.length === 0) {
                message.warning('Vui lòng tạo xem trước đề thi trước!');
                return;
            }
            const newDeThi: DeThi = {
                id: Date.now().toString(),
                maDeThi: values.maDeThi,
                tenDeThi: values.tenDeThi,
                monHocId: values.monHocId,
                cauTrucId: selectedCauTrucId,
                danhSachCauHoi: previewDeThi.map(c => c.id),
                ngayTao: new Date().toLocaleDateString('vi-VN'),
                ghiChu: values.ghiChu,
            };
            setDeThiList(prev => [...prev, newDeThi]);
            message.success('Đã tạo đề thi thành công!');
            setTaoDeThiModalOpen(false);
            setPreviewDeThi(null);
            setDeThiError('');
            setSelectedCauTrucId(undefined);
            setCustomCoCau([]);
            taoDeThiForm.resetFields();
        } catch {
            // validation error
        }
    };

    // ====== CẤU TRÚC ĐỀ THI ======
    const openAddCauTruc = () => {
        setEditingCauTruc(null);
        cauTrucForm.resetFields();
        setCoCauRows([]);
        setCauTrucModalOpen(true);
    };

    const openEditCauTruc = (item: CauTrucDeThi) => {
        setEditingCauTruc(item);
        cauTrucForm.setFieldsValue({ tenCauTruc: item.tenCauTruc, monHocId: item.monHocId });
        setCoCauRows(item.coCau);
        setCauTrucModalOpen(true);
    };

    const updateCoCauRow = (index: number, field: keyof CoCauDeThi, value: any) => {
        setCoCauRows(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
    };

    const removeCoCauRow = (index: number) => {
        setCoCauRows(prev => prev.filter((_, i) => i !== index));
    };

    const saveCauTruc = async () => {
        try {
            const values = await cauTrucForm.validateFields();
            if (coCauRows.length === 0) {
                message.error('Vui lòng thêm ít nhất một yêu cầu cơ cấu!');
                return;
            }
            if (editingCauTruc) {
                setCauTrucList(prev => prev.map(c => c.id === editingCauTruc.id
                    ? { ...c, tenCauTruc: values.tenCauTruc, monHocId: values.monHocId, coCau: coCauRows }
                    : c
                ));
                message.success('Đã cập nhật cấu trúc đề thi!');
            } else {
                const newItem: CauTrucDeThi = {
                    id: Date.now().toString(),
                    tenCauTruc: values.tenCauTruc,
                    monHocId: values.monHocId,
                    coCau: coCauRows,
                };
                setCauTrucList(prev => [...prev, newItem]);
                message.success('Đã lưu cấu trúc đề thi!');
            }
            setCauTrucModalOpen(false);
        } catch {
            // validation error
        }
    };

    // ====== COLUMNS ======
    const deThiColumns = [
        { title: 'Mã đề', dataIndex: 'maDeThi', key: 'maDeThi', width: 100 },
        { title: 'Tên đề thi', dataIndex: 'tenDeThi', key: 'tenDeThi' },
        { title: 'Môn học', dataIndex: 'monHocId', key: 'monHocId', render: (id: string) => getMonHocName(id) },
        { title: 'Số câu', dataIndex: 'danhSachCauHoi', key: 'soLuong', width: 80, align: 'center' as const, render: (arr: string[]) => arr.length },
        { title: 'Ngày tạo', dataIndex: 'ngayTao', key: 'ngayTao', width: 110 },
        {
            title: 'Thao tác', key: 'action', width: 120,
            render: (_: any, record: DeThi) => (
                <Space>
                    <Button icon={<EyeOutlined />} size="small" onClick={() => { setViewingDeThi(record); setViewDeThiModal(true); }} />
                    <Popconfirm title="Xóa đề thi này?" onConfirm={() => { setDeThiList(prev => prev.filter(d => d.id !== record.id)); message.success('Đã xóa!'); }} okText="Xóa" cancelText="Hủy">
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const cauTrucColumns = [
        { title: 'Tên cấu trúc', dataIndex: 'tenCauTruc', key: 'tenCauTruc' },
        { title: 'Môn học', dataIndex: 'monHocId', key: 'monHocId', render: (id: string) => getMonHocName(id) },
        {
            title: 'Cơ cấu',
            key: 'coCau',
            render: (_: any, record: CauTrucDeThi) => (
                <Space size={4} wrap>
                    {record.coCau.map((c, i) => (
                        <Tag key={i} color={MUC_DO_KHO_COLOR[c.mucDoKho]}>
                            {c.soLuong} câu {c.mucDoKho} ({getKhoiName(c.khoiKienThucId)})
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Thao tác', key: 'action', width: 100,
            render: (_: any, record: CauTrucDeThi) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => openEditCauTruc(record)} />
                    <Popconfirm title="Xóa cấu trúc này?" onConfirm={() => { setCauTrucList(prev => prev.filter(c => c.id !== record.id)); message.success('Đã xóa!'); }} okText="Xóa" cancelText="Hủy">
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            {/* Tabs: Đề thi & Cấu trúc */}
            <Space style={{ marginBottom: 16 }}>
                <Button
                    type={activeTab === 'de-thi' ? 'primary' : 'default'}
                    onClick={() => setActiveTab('de-thi')}
                >
                    📝 Đề Thi
                </Button>
                <Button
                    type={activeTab === 'cau-truc' ? 'primary' : 'default'}
                    onClick={() => setActiveTab('cau-truc')}
                >
                    🗂️ Cấu Trúc Đề
                </Button>
            </Space>

            {activeTab === 'de-thi' && (
                <Card>
                    <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>Danh sách Đề Thi</Title>
                        <Button
                            type="primary"
                            icon={<ThunderboltOutlined />}
                            onClick={() => {
                                setTaoDeThiModalOpen(true);
                                setPreviewDeThi(null);
                                setDeThiError('');
                                setSelectedCauTrucId(undefined);
                                setCustomCoCau([]);
                                taoDeThiForm.resetFields();
                            }}
                        >
                            Tạo đề thi mới
                        </Button>
                    </Space>
                    <Table dataSource={deThiList} columns={deThiColumns} rowKey="id" pagination={{ pageSize: 8 }} />
                </Card>
            )}

            {activeTab === 'cau-truc' && (
                <Card>
                    <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>Cấu Trúc Đề Thi</Title>
                        <Button type="primary" icon={<PlusOutlined />} onClick={openAddCauTruc}>
                            Thêm cấu trúc
                        </Button>
                    </Space>
                    <Table dataSource={cauTrucList} columns={cauTrucColumns} rowKey="id" pagination={{ pageSize: 8 }} />
                </Card>
            )}

            {/* ====== MODAL TẠO ĐỀ THI ====== */}
            <Modal
                title="🎯 Tạo Đề Thi Mới"
                visible={taoDeThiModalOpen}
                onCancel={() => setTaoDeThiModalOpen(false)}
                footer={null}
                width={760}
            >
                <Form form={taoDeThiForm} layout="vertical" style={{ marginTop: 16 }}>
                    <Row gutter={12}>
                        <Col span={8}>
                            <Form.Item name="maDeThi" label="Mã đề thi" rules={[{ required: true, message: 'Bắt buộc!' }]}>
                                <Input placeholder="VD: DT001" />
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item name="tenDeThi" label="Tên đề thi" rules={[{ required: true, message: 'Bắt buộc!' }]}>
                                <Input placeholder="VD: Đề thi cuối kỳ môn CSDL" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name="monHocId" label="Môn học" rules={[{ required: true, message: 'Bắt buộc!' }]}>
                                <Select
                                    placeholder="Chọn môn học"
                                    options={monHocList.map(m => ({ value: m.id, label: m.tenMon }))}
                                    onChange={() => { setPreviewDeThi(null); setDeThiError(''); }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Sử dụng cấu trúc có sẵn (tùy chọn)">
                                <Select
                                    placeholder="Chọn cấu trúc có sẵn"
                                    allowClear
                                    value={selectedCauTrucId}
                                    onChange={(val) => {
                                        setSelectedCauTrucId(val);
                                        setCustomCoCau([]);
                                        setPreviewDeThi(null);
                                        setDeThiError('');
                                    }}
                                    options={cauTrucList.map(c => ({ value: c.id, label: c.tenCauTruc }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="ghiChu" label="Ghi chú">
                        <Input placeholder="Ghi chú về đề thi..." />
                    </Form.Item>

                    <Divider orientation="left">
                        <Text strong>Cơ cấu yêu cầu câu hỏi</Text>
                    </Divider>

                    {selectedCauTrucId ? (
                        <div>
                            <Text type="secondary">Đang dùng cấu trúc: <strong>{cauTrucList.find(c => c.id === selectedCauTrucId)?.tenCauTruc}</strong></Text>
                            <div style={{ marginTop: 8 }}>
                                {(cauTrucList.find(c => c.id === selectedCauTrucId)?.coCau || []).map((row, i) => (
                                    <Tag key={i} color={MUC_DO_KHO_COLOR[row.mucDoKho]} style={{ marginBottom: 4 }}>
                                        {row.soLuong} câu {row.mucDoKho} / {getKhoiName(row.khoiKienThucId)}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {customCoCau.map((row, index) => (
                                <Row key={index} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                                    <Col flex={1}>
                                        <Select
                                            style={{ width: '100%' }}
                                            value={row.khoiKienThucId}
                                            onChange={v => {
                                                const updated = [...customCoCau];
                                                updated[index] = { ...updated[index], khoiKienThucId: v };
                                                setCustomCoCau(updated);
                                            }}
                                            options={khoiKienThucList.map(k => ({ value: k.id, label: k.tenKhoi }))}
                                            placeholder="Khối KT"
                                        />
                                    </Col>
                                    <Col flex={1}>
                                        <Select
                                            style={{ width: '100%' }}
                                            value={row.mucDoKho}
                                            onChange={v => {
                                                const updated = [...customCoCau];
                                                updated[index] = { ...updated[index], mucDoKho: v as MucDoKho };
                                                setCustomCoCau(updated);
                                            }}
                                            options={MUC_DO_KHO_OPTIONS.map(m => ({ value: m, label: m }))}
                                        />
                                    </Col>
                                    <Col>
                                        <InputNumber
                                            min={1}
                                            value={row.soLuong}
                                            onChange={v => {
                                                const updated = [...customCoCau];
                                                updated[index] = { ...updated[index], soLuong: v || 1 };
                                                setCustomCoCau(updated);
                                            }}
                                            addonBefore="Số câu:"
                                            style={{ width: 130 }}
                                        />
                                    </Col>
                                    <Col>
                                        <Button
                                            danger size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() => setCustomCoCau(prev => prev.filter((_, i) => i !== index))}
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => setCustomCoCau(prev => [...prev, {
                                    khoiKienThucId: khoiKienThucList[0]?.id || '',
                                    mucDoKho: 'Dễ',
                                    soLuong: 1
                                }])}
                            >
                                Thêm yêu cầu
                            </Button>
                        </div>
                    )}

                    {deThiError && (
                        <Alert message={deThiError} type="error" showIcon style={{ marginTop: 12 }} />
                    )}

                    {previewDeThi && previewDeThi.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                            <Alert message={`✅ Tạo đề thành công: ${previewDeThi.length} câu hỏi`} type="success" showIcon />
                        </div>
                    )}

                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                        <Space>
                            <Button onClick={() => setTaoDeThiModalOpen(false)}>Hủy</Button>
                            <Button icon={<EyeOutlined />} onClick={handlePreviewDeThi}>
                                Xem trước đề
                            </Button>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveDeThi} disabled={!previewDeThi}>
                                Lưu đề thi
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>

            {/* ====== MODAL CẤU TRÚC ĐỀ THI ====== */}
            <Modal
                title={editingCauTruc ? 'Chỉnh sửa Cấu Trúc' : 'Thêm Cấu Trúc Đề Thi'}
                visible={cauTrucModalOpen}
                onOk={saveCauTruc}
                onCancel={() => setCauTrucModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
                width={680}
            >
                <Form form={cauTrucForm} layout="vertical" style={{ marginTop: 16 }}>
                    <Row gutter={12}>
                        <Col span={14}>
                            <Form.Item name="tenCauTruc" label="Tên cấu trúc" rules={[{ required: true, message: 'Bắt buộc!' }]}>
                                <Input placeholder="VD: Cấu trúc đề cuối kỳ CSDL" />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item name="monHocId" label="Áp dụng cho môn" rules={[{ required: true, message: 'Bắt buộc!' }]}>
                                <Select placeholder="Chọn môn học" options={monHocList.map(m => ({ value: m.id, label: m.tenMon }))} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Cơ cấu câu hỏi</Divider>
                    {coCauRows.map((row, index) => (
                        <Row key={index} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                            <Col flex={1}>
                                <Select
                                    style={{ width: '100%' }}
                                    value={row.khoiKienThucId}
                                    onChange={v => updateCoCauRow(index, 'khoiKienThucId', v)}
                                    options={khoiKienThucList.map(k => ({ value: k.id, label: k.tenKhoi }))}
                                    placeholder="Khối KT"
                                />
                            </Col>
                            <Col flex={1}>
                                <Select
                                    style={{ width: '100%' }}
                                    value={row.mucDoKho}
                                    onChange={v => updateCoCauRow(index, 'mucDoKho', v as MucDoKho)}
                                    options={MUC_DO_KHO_OPTIONS.map(m => ({ value: m, label: m }))}
                                />
                            </Col>
                            <Col>
                                <InputNumber
                                    min={1}
                                    value={row.soLuong}
                                    onChange={v => updateCoCauRow(index, 'soLuong', v || 1)}
                                    addonBefore="Số câu:"
                                    style={{ width: 130 }}
                                />
                            </Col>
                            <Col>
                                <Button danger size="small" icon={<DeleteOutlined />} onClick={() => removeCoCauRow(index)} />
                            </Col>
                        </Row>
                    ))}
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() => setCoCauRows(prev => [...prev, {
                            khoiKienThucId: khoiKienThucList[0]?.id || '',
                            mucDoKho: 'Dễ',
                            soLuong: 1
                        }])}
                        style={{ marginTop: 4 }}
                    >
                        Thêm yêu cầu
                    </Button>
                </Form>
            </Modal>

            {/* ====== MODAL XEM ĐỀ THI ====== */}
            <Modal
                title={`📄 ${viewingDeThi?.tenDeThi}`}
                visible={viewDeThiModal}
                onCancel={() => setViewDeThiModal(false)}
                footer={<Button onClick={() => setViewDeThiModal(false)}>Đóng</Button>}
                width={740}
            >
                {viewingDeThi && (
                    <>
                        <Descriptions bordered size="small" style={{ marginBottom: 16 }}>
                            <Descriptions.Item label="Mã đề">{viewingDeThi.maDeThi}</Descriptions.Item>
                            <Descriptions.Item label="Môn học">{getMonHocName(viewingDeThi.monHocId)}</Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo">{viewingDeThi.ngayTao}</Descriptions.Item>
                            <Descriptions.Item label="Tổng câu hỏi" span={3}>{viewingDeThi.danhSachCauHoi.length} câu</Descriptions.Item>
                            {viewingDeThi.ghiChu && <Descriptions.Item label="Ghi chú" span={3}>{viewingDeThi.ghiChu}</Descriptions.Item>}
                        </Descriptions>
                        <List
                            dataSource={viewingDeThi.danhSachCauHoi.map((id, idx) => ({ idx, cauHoi: cauHoiList.find(c => c.id === id) }))}
                            renderItem={({ idx, cauHoi }) => (
                                <List.Item key={idx}>
                                    <div style={{ width: '100%' }}>
                                        <Space style={{ marginBottom: 4 }}>
                                            <Tag>{idx + 1}</Tag>
                                            {cauHoi && <Tag color={MUC_DO_KHO_COLOR[cauHoi.mucDoKho]}>{cauHoi.mucDoKho}</Tag>}
                                            {cauHoi && <Tag color="blue">{getKhoiName(cauHoi.khoiKienThucId)}</Tag>}
                                        </Space>
                                        <div>{cauHoi?.noiDung || <Text type="danger">Câu hỏi không tìm thấy</Text>}</div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </>
                )}
            </Modal>
        </>
    );
};

export default DeThiTab;
