import { Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">EMS</h1>
                    <nav className="space-x-4">
                        <button onClick={() => navigate('/')} className="text-gray-600 hover:text-indigo-600 transition-colors">Dashboard</button>
                        <button onClick={() => navigate('/profile')} className="text-gray-600 hover:text-indigo-600 transition-colors">Profile</button>
                        <button onClick={() => navigate('/employees')} className="text-gray-600 hover:text-indigo-600 transition-colors">Employees</button>
                        <button onClick={() => navigate('/form-builder')} className="text-gray-600 hover:text-indigo-600 transition-colors">Form Builder</button>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
