import Statistik from '../../components/Dashboard/Statistik'
import { useAuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { authUser } = useAuthContext();

  return (
    <div className="p-6 space-y-6  min-h-screen m-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Selamat Datang, {authUser?.user?.name} 👋
        </h1>
        <p className="text-gray-600">Ini adalah ringkasan aktivitas dashboard kamu.</p>
      </div>

      {/* Statistik Cards */}
      {authUser?.user?.role === "admin" && (
        <Statistik />
      )}
    </div>
  );
};

export default Dashboard;
