import React, { useState } from 'react';
import { Tabs, Typography } from 'antd';
import {
    BookOutlined, BankOutlined, QuestionCircleOutlined, FileTextOutlined
} from '@ant-design/icons';
import KhoiKienThucTab, { INITIAL_KHOI_KIEN_THUC } from './KhoiKienThuc';
import MonHocTab, { INITIAL_MON_HOC } from './MonHoc';
import CauHoiTab, { INITIAL_CAU_HOI } from './CauHoi';
import DeThiTab from './DeThi';
import type { KhoiKienThuc, MonHoc, CauHoi, DeThi, CauTrucDeThi } from './types';

const { TabPane } = Tabs;
const { Title } = Typography;

const NganHangCauHoi: React.FC = () => {
    const [khoiKienThucList, setKhoiKienThucList] = useState<KhoiKienThuc[]>(INITIAL_KHOI_KIEN_THUC);
    const [monHocList, setMonHocList] = useState<MonHoc[]>(INITIAL_MON_HOC);
    const [cauHoiList, setCauHoiList] = useState<CauHoi[]>(INITIAL_CAU_HOI);
    const [deThiList, setDeThiList] = useState<DeThi[]>([]);
    const [cauTrucList, setCauTrucList] = useState<CauTrucDeThi[]>([]);

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2} style={{ marginBottom: 24 }}>
                📚 Hệ Thống Ngân Hàng Câu Hỏi
            </Title>
            <Tabs defaultActiveKey="khoi-kien-thuc" size="large" type="card">
                <TabPane
                    key="khoi-kien-thuc"
                    tab={<span><BankOutlined /> Khối Kiến Thức</span>}
                >
                    <KhoiKienThucTab
                        khoiKienThucList={khoiKienThucList}
                        setKhoiKienThucList={setKhoiKienThucList}
                    />
                </TabPane>

                <TabPane
                    key="mon-hoc"
                    tab={<span><BookOutlined /> Môn Học</span>}
                >
                    <MonHocTab
                        monHocList={monHocList}
                        setMonHocList={setMonHocList}
                    />
                </TabPane>

                <TabPane
                    key="cau-hoi"
                    tab={<span><QuestionCircleOutlined /> Câu Hỏi</span>}
                >
                    <CauHoiTab
                        cauHoiList={cauHoiList}
                        setCauHoiList={setCauHoiList}
                        monHocList={monHocList}
                        khoiKienThucList={khoiKienThucList}
                    />
                </TabPane>

                <TabPane
                    key="de-thi"
                    tab={<span><FileTextOutlined /> Đề Thi</span>}
                >
                    <DeThiTab
                        deThiList={deThiList}
                        setDeThiList={setDeThiList}
                        cauTrucList={cauTrucList}
                        setCauTrucList={setCauTrucList}
                        cauHoiList={cauHoiList}
                        monHocList={monHocList}
                        khoiKienThucList={khoiKienThucList}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default NganHangCauHoi;
