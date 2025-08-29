import { useState, useEffect, useCallback } from "react";
import type { Employee } from "../../types";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getEmployees, deleteEmployee, searchEmployees } from "../../api/employeeService";
import debounce from 'lodash/debounce';
import EmployeeListSkeleton from "../../components/common/skeletons/EmployeeListSkeleton";

const EmployeeListPage = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
    const navigate = useNavigate();

    const debouncedFetchEmployees = useCallback(
        debounce(async (query: string) => {
            setLoading(true);
            setError(null);
            try {
                const response = query ? await searchEmployees(query) : await getEmployees();
                setEmployees(response.data);
            } catch (err) {
                setError('Failed to fetch employees.');
                toast.error('Failed to fetch employees.');
                console.error('Failed to fetch employees:', err);
            } finally {
                setLoading(false);
            }
        }, 500), 
        [] 
    );

    useEffect(() => {
        debouncedFetchEmployees('');
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
                toast.success('Employee deleted successfully.');
                debouncedFetchEmployees(searchTerm);
            } catch (err) {
                toast.error('Failed to delete employee.');
                console.error('Failed to delete employee:', err);
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

    if (loading) return <EmployeeListSkeleton/>
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Employee List</h1>
                <button
                    onClick={() => navigate('/employees/create')}
                    className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                    <span className="mr-2">➕</span> Add Employee
                </button>
            </div>

            <div className="mb-4 flex items-center relative">
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full max-w-xs p-2 border rounded"
                />
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Template</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fields</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employees.length > 0 ? (
                            employees.map((emp) => (
                                <tr key={emp.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{emp.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{emp.form_template_name}</td>
                                    <td className="px-6 py-4">
                                        <ul className="list-disc list-inside">
                                            {emp.data.map((item, index) => (
                                                <li key={index} className="text-sm">
                                                    <span className="font-semibold">{item.field_label}:</span> {item.field_value}
                                                </li>
                                            ))}
                                        </ul>
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
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No employees found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
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