import React from "react";
import { FaUserGraduate, FaBook, FaTasks, FaChartLine } from "react-icons/fa";

const Statistik = ({ data }) => {
  const stats = [
    {
      id: 1,
      label: "Total Siswa",
      value: data?.totalStudents ?? 0,
      icon: <FaUserGraduate className="text-blue-500 text-3xl" />,
    },
    {
      id: 2,
      label: "Kursus Aktif",
      value: data?.activeCourses ?? 0,
      icon: <FaBook className="text-green-500 text-3xl" />,
    },
    {
      id: 3,
      label: "Tugas Pending",
      value: data?.pendingTasks ?? 0,
      icon: <FaTasks className="text-yellow-500 text-3xl" />,
    },
    {
      id: 4,
      label: "Progress",
      value: data?.progress ?? 0 + "%",
      icon: <FaChartLine className="text-purple-500 text-3xl" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4"
        >
          {stat.icon}
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Statistik;
