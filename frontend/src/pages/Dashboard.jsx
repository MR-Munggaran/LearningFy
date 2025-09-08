import { Outlet } from "react-router-dom";
import Header from '../components/Dashboard/Header'

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>

      <main className="flex-1 p-4">
        {/* Semua children route dashboard tampil di sini */}
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
