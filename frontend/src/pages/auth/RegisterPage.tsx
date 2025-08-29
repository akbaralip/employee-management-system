import { useState } from "react";
import type { RegistrationData } from "../../types";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-toastify";
import { registerUser } from "../../api/authService";


const RegisterPage = () => {
  const [formData, setFormData] = useState<RegistrationData>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      toast.error("Password don't match!");
      return
    }

    setLoading(true);
    try {
      const response = await registerUser(formData);
      login(response.data);
      toast.success('Registration successful! Welcome.');
      navigate('/');
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key]}`);
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-extrabold text-center text-gray-900">Create an Account</h2>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <input name="first_name" type="text" onChange={handleChange} placeholder="First Name" required className="input-field border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 mt-1" />
            <input name="last_name" type="text" onChange={handleChange} placeholder="Last Name" required className="input-field border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 mt-1" />
            <input name="username" type="text" onChange={handleChange} placeholder="Username" required className="input-field border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 mt-1 sm:col-span-2" />
            <input name="email" type="email" onChange={handleChange} placeholder="Email Address" required className="input-field border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 mt-1 sm:col-span-2" />
            <input name="password" type="password" onChange={handleChange} placeholder="Password" required className="input-field border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 mt-1" />
            <input name="password_confirm" type="password" onChange={handleChange} placeholder="Confirm Password" required className="input-field border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 mt-1" />            
          </div>

          <button
          type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign In
            </Link>
          </p>
        </form>

      </div>      
    </div>
  )
}

export default RegisterPage;