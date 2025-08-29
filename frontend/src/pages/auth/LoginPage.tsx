import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { loginUser } from "../../api/authService";
import { toast } from "react-toastify";


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);
  try {
    const response = await loginUser({ username, password });
    login(response.data); 
    toast.success('Login successful! Welcome back.');
    navigate('/');
  } catch (error: any) {
    if (error.response && error.response.data) {
      const errors = error.response.data;
      Object.keys(errors).forEach((key) => {
        toast.error(`${key}: ${errors[key]}`);
      });
    } else {
      toast.error('Login failed. Please try again.');
    }
    console.error('Login failed:', error);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="text-sm text-center text-gray-600">
            Yod dont have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign Up
            </Link>
          </p>
        </form>

      </div>
    </div>
  )
}

export default LoginPage;