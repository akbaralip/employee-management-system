import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const baseClasses = "text-gray-600 hover:text-indigo-600 transition-colors";
  const activeClasses ="text-indigo-600 font-semibold border-b-2 border-indigo-600";

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      <header className="bg-white shadow-md p-4 fixed top-0 left-0 right-0 z-50 animate-fade-in">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">EMS</h1>
          <nav className="space-x-4">
            <button
              onClick={() => navigate("/")}
              className={`${baseClasses} ${isActive("/") ? activeClasses : ""}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/profile")}
              className={`${baseClasses} ${
                isActive("/profile") ? activeClasses : ""
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/employees")}
              className={`${baseClasses} ${
                isActive("/employees") ? activeClasses : ""
              }`}
            >
              Employees
            </button>
            <button
              onClick={() => navigate("/form-builder")}
              className={`${baseClasses} ${
                isActive("/form-builder") ? activeClasses : ""
              }`}
            >
              Form Builder
            </button>
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
