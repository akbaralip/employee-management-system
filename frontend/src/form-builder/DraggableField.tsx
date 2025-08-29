import React from 'react';
import useFormBuilderStore from '../store/formStore';
import { FaTrash, FaGripVertical } from 'react-icons/fa';

interface DraggableFieldProps {
  field: { id: string; label: string; field_type: string; };
}

const DraggableField: React.FC<DraggableFieldProps> = ({ field }) => {
  const { updateField, removeField } = useFormBuilderStore();

  return (
    <div className="flex items-center p-4 space-x-4 bg-white border rounded shadow-sm">
      <FaGripVertical className="text-gray-400 cursor-grab" />
      <input
        type="text"
        value={field.label}
        onChange={(e) => updateField(field.id, { label: e.target.value })}
        className="flex-grow p-2 border rounded"
        placeholder="Field Label"
      />
      <select
        value={field.field_type}
        onChange={(e) => updateField(field.id, { field_type: e.target.value as any })}
        className="p-2 border rounded"
      >
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="email">Email</option>
        <option value="date">Date</option>
        <option value="password">Password</option>
      </select>
      <button onClick={() => removeField(field.id)} className="text-red-500 hover:text-red-700">
        <FaTrash />
      </button>
    </div>
  );
};

export default DraggableField;