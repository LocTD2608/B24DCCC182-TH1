import type { Employee } from '../../pages/QuanLyNhanVien/data';

const STORAGE_KEY = 'EMPLOYEE_LIST';

// Simulate a short network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function getStoredEmployees(): Employee[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function setStoredEmployees(employees: Employee[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

export async function getEmployees(): Promise<{ data: Employee[]; success: boolean; total: number }> {
    await delay(200);
    const data = getStoredEmployees();
    return {
        data,
        success: true,
        total: data.length,
    };
}

export async function addEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    await delay(200);
    const employees = getStoredEmployees();

    // Tự động sinh mã nhân viên
    const newId = `NV${Date.now().toString().slice(-6)}`;
    const newEmployee: Employee = {
        ...employee,
        id: newId,
    };

    employees.push(newEmployee);
    setStoredEmployees(employees);
    return newEmployee;
}

export async function updateEmployee(id: string, employeeData: Omit<Employee, 'id'>): Promise<Employee | null> {
    await delay(200);
    const employees = getStoredEmployees();
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const updated = { ...employees[index], ...employeeData };
    employees[index] = updated;
    setStoredEmployees(employees);
    return updated;
}

export async function deleteEmployee(id: string): Promise<boolean> {
    await delay(200);
    const employees = getStoredEmployees();
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) return false;

    employees.splice(index, 1);
    setStoredEmployees(employees);
    return true;
}
