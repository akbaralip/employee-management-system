import Card from "../components/common/Card";
import { useNavigate } from 'react-router-dom';
import useAuthStore from "../store/authStore";


const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex items-center justify-center bg-gray-100 p-2">
      <Card title="My Profile" className="w-full max-w-lg mt-8">
        <div className="flex items-center justify-center mb-6 text-6xl text-gray-400">
          👤
        </div>
        <div className="space-y-4">
          <div className="border-b border-gray-500 pb-2 py-2 px-1">
            <h4 className="text-gray-500 text-md">Username</h4>
            <p className="font-medium text-md">{user?.username}</p>
          </div>
          <div className="border-b border-gray-500 pb-2 py-2 px-1">
            <h4 className="text-gray-500 text-sm">Email</h4>
            <p className="font-medium text-lg">{user?.email}</p>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate('/change-password')}
            className="py-2 px-4 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Change Password
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
