import Card from "../components/common/Card";
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <Card title="My Profile" className="w-full max-w-lg mt-8">
        <div className="flex items-center justify-center mb-6 text-6xl text-gray-400">
          👤
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
