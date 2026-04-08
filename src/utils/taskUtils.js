export const getTasks = () => {
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];
  };
  
  export const getStatistics = () => {
    const tasks = getTasks();
  
    const total = tasks.length;
  
    const completed = tasks.filter(
      (task) => task.status === "Đã xong"
    ).length;
  
    return {
      total,
      completed,
    };
  };