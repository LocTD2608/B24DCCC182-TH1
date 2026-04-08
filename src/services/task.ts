// Định nghĩa interface cho Task
export interface TaskItem {
  id: string;
  taskName: string;
  assignedTo: string; // Tên người được giao
  priority: 'Low' | 'Medium' | 'High';
  deadline: string;
  status: 'Todo' | 'Doing' | 'Done';
}

// Lấy danh sách task từ localStorage
export async function getTasks(): Promise<TaskItem[]> {
  const data = localStorage.getItem('tasks');
  return data ? JSON.parse(data) : [];
}

// Lưu task mới hoặc cập nhật
export async function saveTasks(tasks: TaskItem[]) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}