import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getFormTemplates } from "../../api/formService";
import {
  createEmployee,
  getEmployeeById,
  updateEmployee,
} from "../../api/employeeService";
import type { FormTemplate, FormField, EmployeeData } from "../../types";

const EmployeeFormPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
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
          setTemplateFields(
            formTemplates.find((t) => t.id === emp.form_template)?.fields || []
          );
        } catch (error) {
          toast.error("Failed to load employee data.");
          navigate("/employees");
        }
      }
    };

    if (formTemplates.length > 0) {
      fetchEmployeeData();
    }
  }, [isEditMode, id, formTemplates, navigate]);

  useEffect(() => {
    if (selectedTemplateId) {
      const template = formTemplates.find((t) => t.id === selectedTemplateId);
      if (template) {
        setTemplateFields(template.fields);
        if (!isEditMode) {
          setEmployeeData(
            template.fields.map((field) => ({
              field_label: field.label,
              field_value: "",
            }))
          );
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
      value: employeeData[index]?.field_value || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleFormChange(index, e.target.value),
    };

    switch (field.field_type) {
      case "text":
        return <input type="text" {...commonProps} />;
      case "email":
        return <input type="email" {...commonProps} />;
      case "number":
        return <input type="number" {...commonProps} />;
      case "password":
        return <input type="password" {...commonProps} />;
      case "date":
        return <input type="date" {...commonProps} />;
      case "textarea":
        return (
          <textarea
            {...commonProps}
            onChange={(e) => handleFormChange(index, e.target.value)}
          />
        );
      case "select":
        return (
          <select
            {...commonProps}
            onChange={(e) => handleFormChange(index, e.target.value)}
          >
            <option value="">Select an option</option>
            {field.options &&
              field.options.map((option, optIndex) => (
                <option key={optIndex} value={option}>
                  {option}
                </option>
              ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isEditMode ? "Edit Employee" : "Create New Employee"}
              </h1>
              <p className="text-gray-600">
                {isEditMode
                  ? "Update employee information"
                  : "Fill in the details to add a new employee"}
              </p>
            </div>
            <button
              onClick={() => navigate("/employees")}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              ← Back to List
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Form Template
              </h2>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Form Template
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedTemplateId || ""}
                  onChange={(e) =>
                    setSelectedTemplateId(parseInt(e.target.value))
                  }
                  disabled={isEditMode}
                  className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-200 text-gray-900 font-medium shadow-sm hover:border-gray-300 appearance-none"
                >
                  <option value="" className="text-gray-500">
                    -- Choose a template --
                  </option>
                  {formTemplates.map((template) => (
                    <option
                      key={template.id}
                      value={template.id}
                      className="text-gray-900 py-2"
                    >
                      📋 {template.name}
                    </option>
                  ))}
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isEditMode ? "text-gray-400" : "text-gray-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {selectedTemplateId && !isEditMode && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm font-medium text-green-800">
                      Template selected:{" "}
                      {
                        formTemplates.find((t) => t.id === selectedTemplateId)
                          ?.name
                      }
                    </span>
                  </div>
                </div>
              )}
              {isEditMode && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-amber-800">
                      Template cannot be changed in edit mode
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedTemplateId && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Employee Information
                </h2>
                <p className="text-sm text-gray-600">
                  Fields marked with <span className="text-red-500">*</span> are
                  required
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {templateFields.map((field, index) => (
                    <div
                      key={field.id}
                      className={
                        field.field_type === "textarea" ? "md:col-span-2" : ""
                      }
                    >
                      <label
                        htmlFor={field.label}
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <div className="relative">
                        {renderInput(field, index)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => navigate("/employees")}
                      className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center gap-2 min-w-32"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          {isEditMode ? "Update Employee" : "Create Employee"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {!selectedTemplateId && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a Form Template
              </h3>
              <p className="text-gray-600">
                Choose a form template from the dropdown above to start{" "}
                {isEditMode ? "editing" : "creating"} employee information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeFormPage;
