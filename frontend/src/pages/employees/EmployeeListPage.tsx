import { useState, useEffect, useCallback } from "react";
import type { Employee } from "../../types";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  getEmployees,
  deleteEmployee,
  searchEmployees,
} from "../../api/employeeService";
import debounce from "lodash/debounce";
import EmployeeListSkeleton from "../../components/common/skeletons/EmployeeListSkeleton";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  const debouncedFetchEmployees = useCallback(
    debounce(async (query: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = query
          ? await searchEmployees(query)
          : await getEmployees();
        setEmployees(response.data);
      } catch (err) {
        setError("Failed to fetch employees.");
        toast.error("Failed to fetch employees.");
        console.error("Failed to fetch employees:", err);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetchEmployees("");
    return () => {
      debouncedFetchEmployees.cancel();
    };
  }, [debouncedFetchEmployees]);

  const handleDeleteClick = (employeeId: number) => {
    setEmployeeToDelete(employeeId);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (employeeToDelete !== null) {
      try {
        await deleteEmployee(employeeToDelete);
        toast.success("Employee deleted successfully.");
        debouncedFetchEmployees(searchTerm);
      } catch (err) {
        toast.error("Failed to delete employee.");
        console.error("Failed to delete employee:", err);
      } finally {
        setShowConfirmModal(false);
        setEmployeeToDelete(null);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    debouncedFetchEmployees(query);
  };

  if (loading) return <EmployeeListSkeleton />;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Employee List</h1>
        <button
          onClick={() => navigate("/employees/create")}
          className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <FaPlus className="mr-2" /> Add Employee
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <CiSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-y-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Form Template
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Employee Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-semibold text-indigo-600">
                            {emp.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {emp.form_template_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {emp.data.map((item, index) => (
                          <div key={index} className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {item.field_label}
                            </span>
                            <span className="text-sm text-gray-900 mt-1">
                              {item.field_value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/employees/edit/${emp.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(emp.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this employee? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default EmployeeListPage;
