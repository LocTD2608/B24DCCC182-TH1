export interface Employee {
    id: string;
    fullName: string;
    position: string;
    department: string;
    salary: number;
    status: string;
}

export const POSITION_OPTS = ['Giám đốc', 'Trưởng phòng', 'Nhân viên', 'Thực tập sinh'];
export const DEPARTMENT_OPTS = ['Nhân sự', 'Kỹ thuật', 'Kinh doanh', 'Kế toán'];
export const STATUS_OPTS = ['Thử việc', 'Đã ký hợp đồng', 'Nghỉ phép', 'Đã thôi việc'];
