import useAuthStore from "../../store/authStore";
import { useNavigate } from 'react-router-dom';
import type { DashboardItem } from '../../types';

const DashboardPage = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardItems: DashboardItem[] = [
    { title: 'My Profile', icon: '👤', description: 'View and manage your personal details.', link: '/profile' },
    { title: 'Employee Forms', icon: '📝', description: 'Build and manage dynamic employee forms.', link: '/form-builder' },
    { title: 'Employees', icon: '👥', description: 'View, add, and manage employee records.', link: '/employees' },
    { title: 'Change Password', icon: '🔐', description: 'Update your password for security and protection.', link: '/change-password' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-gray-900">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center text-white bg-red-600 rounded-md px-4 py-2 hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardItems.map((item) => (
          <div key={item.title} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            <div className="text-4xl text-indigo-600 mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{item.description}</p>
            <button
              onClick={() => navigate(item.link)}
              className="w-full py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Go to {item.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
