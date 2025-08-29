import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getFormTemplates } from "../../api/formService";
import { createEmployee, getEmployeeById, updateEmployee } from "../../api/employeeService";
import type { FormTemplate, FormField, EmployeeData } from "../../types";

const EmployeeFormPage = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
    const [templateFields, setTemplateFields] = useState<FormField[]>([]);
    const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFormTemplates = async () => {
            try {
                const response = await getFormTemplates();
                setFormTemplates(response.data);
            } catch (error) {
                toast.error("Failed to load form templates.");
            }
        };

        fetchFormTemplates();
    }, []);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (isEditMode && id) {
                try {
                    const response = await getEmployeeById(parseInt(id));
                    const emp = response.data;
                    setSelectedTemplateId(emp.form_template);
                    setEmployeeData(emp.data);
                    setTemplateFields(formTemplates.find(t => t.id === emp.form_template)?.fields || []);
                } catch (error) {
                    toast.error("Failed to load employee data.");
                    navigate('/employees');
                }
            }
        };

        if (formTemplates.length > 0) {
            fetchEmployeeData();
        }
    }, [isEditMode, id, formTemplates, navigate]);

    useEffect(() => {
        if (selectedTemplateId) {
            const template = formTemplates.find(t => t.id === selectedTemplateId);
            if (template) {
                setTemplateFields(template.fields);
                if (!isEditMode) {
                    setEmployeeData(template.fields.map(field => ({
                        field_label: field.label,
                        field_value: "",
                    })));
                }
            }
        }
    }, [selectedTemplateId, formTemplates, isEditMode]);

    const handleFormChange = (index: number, value: string) => {
        const newData = [...employeeData];
        newData[index].field_value = value;
        setEmployeeData(newData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTemplateId) {
            toast.error("Please select a form template.");
            return;
        }

        setLoading(true);
        try {
            if (isEditMode && id) {
                await updateEmployee(parseInt(id), selectedTemplateId, employeeData);
                toast.success("Employee updated successfully!");
            } else {
                await createEmployee(selectedTemplateId, employeeData);
                toast.success("Employee created successfully!");
            }
            navigate("/employees");
        } catch (error) {
            toast.error("Failed to save employee data.");
            console.error("Failed to save employee data:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (field: FormField, index: number) => {
        const commonProps = {
            id: field.label,
            name: field.label,
            className: "w-full p-2 border rounded mt-1",
            required: field.required,
            value: employeeData[index]?.field_value || '',
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(index, e.target.value),
        };

        switch (field.field_type) {
            case 'text':
                return <input type="text" {...commonProps} />;
            case 'email':
                return <input type="email" {...commonProps} />;
            case 'number':
                return <input type="number" {...commonProps} />;
            case 'password':
                return <input type="password" {...commonProps} />;
            case 'date':
                return <input type="date" {...commonProps} />;
            case 'textarea':
                return (
                    <textarea
                        {...commonProps}
                        onChange={(e) => handleFormChange(index, e.target.value)}
                    />
                );
            case 'select':
                return (
                    <select {...commonProps} onChange={(e) => handleFormChange(index, e.target.value)}>
                        <option value="">Select an option</option>
                        {field.options && field.options.map((option, optIndex) => (
                            <option key={optIndex} value={option}>{option}</option>
                        ))}
                    </select>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{isEditMode ? 'Edit Employee' : 'Create Employee'}</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Select Form Template</label>
                    <select
                        value={selectedTemplateId || ""}
                        onChange={(e) => setSelectedTemplateId(parseInt(e.target.value))}
                        disabled={isEditMode}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">-- Choose a template --</option>
                        {formTemplates.map(template => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedTemplateId && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {templateFields.map((field, index) => (
                            <div key={field.id}>
                                <label htmlFor={field.label} className="block text-sm font-medium text-gray-700">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                {renderInput(field, index)}
                            </div>
                        ))}
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                        >
                            {loading ? 'Saving...' : 'Save Employee'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EmployeeFormPage;