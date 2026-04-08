/**
 * 📚 GIẢI THÍCH — FORM COMPONENT
 *
 * Đây là component chứa form thêm/sửa văn bằng bên trong Modal.
 * - Dùng `Form` của Ant Design để quản lý form state & validation
 * - `Form.Item` bọc mỗi trường input, có thể set `rules` để validate
 * - `form.setFieldsValue(...)` để fill data khi sửa
 * - `form.validateFields()` để kiểm tra validate trước khi submit
 */
import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Button, Row, Col } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const { Option } = Select;

const FormVanBang: React.FC = () => {
    /**
     * `useModel('vanBang')` lấy ra state & actions từ model.
     * Giống như "kết nối" component này với nguồn dữ liệu chung.
     */
    const {
        isEdit,
        currentVanBang,
        themVanBang,
        suaVanBang,
        getSoVaoSoTiepTheo,
        setVisible,
    } = useModel('vanBang');

    /** Ant Design Form hook — quản lý giá trị form */
    const [form] = Form.useForm();

    /**
     * useEffect: Khi `isEdit` hoặc `currentVanBang` thay đổi
     * → Nếu đang sửa thì fill data cũ vào form
     * → Nếu đang thêm mới thì reset form
     */
    useEffect(() => {
        if (isEdit && currentVanBang) {
            form.setFieldsValue({
                ...currentVanBang,
                ngaySinh: currentVanBang.ngaySinh ? moment(currentVanBang.ngaySinh) : undefined,
                ngayCap: currentVanBang.ngayCap ? moment(currentVanBang.ngayCap) : undefined,
            });
        } else {
            form.resetFields();
        }
    }, [isEdit, currentVanBang]);

    /**
     * Xử lý khi submit form:
     * 1. Validate tất cả fields
     * 2. Chuyển đổi ngày thành chuỗi ISO
     * 3. Gọi hàm thêm hoặc sửa từ model
     */
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Chuyển moment object → chuỗi ngày
            const formData = {
                ...values,
                ngaySinh: values.ngaySinh?.format('YYYY-MM-DD'),
                ngayCap: values.ngayCap?.format('YYYY-MM-DD'),
            };

            if (isEdit && currentVanBang) {
                suaVanBang(currentVanBang.id, formData);
            } else {
                themVanBang(formData);
            }
        } catch (error) {
            // Nếu validate fail thì Ant Design tự show lỗi ở form
            console.log('Validate failed:', error);
        }
    };

    return (
        <Form form={form} layout="vertical">
            {/* Số hiệu văn bằng */}
            <Form.Item
                label="Số hiệu văn bằng"
                name="soHieuVanBang"
                rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng!' }]}
            >
                <Input placeholder="VD: VB-2026-001" />
            </Form.Item>

            {/* Số vào sổ — chỉ hiện khi thêm mới, tự động tính */}
            {!isEdit && (
                <Form.Item label="Số vào sổ (tự động)">
                    <InputNumber value={getSoVaoSoTiepTheo()} disabled style={{ width: '100%' }} />
                </Form.Item>
            )}

            {/* Thông tin sinh viên — dùng Row/Col để chia 2 cột */}
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Họ và tên"
                        name="hoTen"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Ngày sinh"
                        name="ngaySinh"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        label="Giới tính"
                        name="gioiTinh"
                        rules={[{ required: true, message: 'Chọn giới tính!' }]}
                    >
                        <Select placeholder="Chọn">
                            <Option value="Nam">Nam</Option>
                            <Option value="Nữ">Nữ</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Nơi sinh" name="noiSinh">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Dân tộc" name="danToc" initialValue="Kinh">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            {/* Thông tin tốt nghiệp */}
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        label="Xếp loại"
                        name="xepLoai"
                        rules={[{ required: true, message: 'Chọn xếp loại!' }]}
                    >
                        <Select placeholder="Chọn">
                            <Option value="Xuất sắc">Xuất sắc</Option>
                            <Option value="Giỏi">Giỏi</Option>
                            <Option value="Khá">Khá</Option>
                            <Option value="Trung bình">Trung bình</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Hệ đào tạo"
                        name="heDaoTao"
                        rules={[{ required: true, message: 'Chọn hệ đào tạo!' }]}
                    >
                        <Select placeholder="Chọn">
                            <Option value="Chính quy">Chính quy</Option>
                            <Option value="Vừa làm vừa học">Vừa làm vừa học</Option>
                            <Option value="Từ xa">Từ xa</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Năm tốt nghiệp"
                        name="namTotNghiep"
                        rules={[{ required: true, message: 'Nhập năm!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={2000} max={2100} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Ngày cấp"
                name="ngayCap"
                rules={[{ required: true, message: 'Chọn ngày cấp!' }]}
            >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>

            {/* Nút submit */}
            <Form.Item>
                <Button type="primary" onClick={handleSubmit} style={{ marginRight: 8 }}>
                    {isEdit ? 'Cập nhật' : 'Thêm mới'}
                </Button>
                <Button onClick={() => setVisible(false)}>Hủy</Button>
            </Form.Item>
        </Form>
    );
};

export default FormVanBang;
