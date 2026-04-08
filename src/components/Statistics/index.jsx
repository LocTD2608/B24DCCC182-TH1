import { useEffect, useState } from "react";
import { getStatistics } from "../../utils/taskUtils";
import "./style.css";

function Statistics({ tasks }) {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
  });

  useEffect(() => {
    const data = getStatistics();
    setStats(data);
  }, [tasks]);

  const percent =
    stats.total === 0
      ? 0
      : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="stats-box">
      <h3>Thống kê</h3>

      <p>Tổng công việc: {stats.total}</p>
      <p>Đã hoàn thành: {stats.completed}</p>
      <p>Tiến độ: {percent}%</p>

      <div className="progress">
        <div
          className="progress-bar"
          style={{ width: percent + "%" }}
        ></div>
      </div>
    </div>
  );
}

export default Statistics;