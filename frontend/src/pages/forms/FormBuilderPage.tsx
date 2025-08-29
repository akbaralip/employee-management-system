import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import useFormBuilderStore from "../../store/formStore";
import { FaPlus, FaSave } from 'react-icons/fa';
import DraggableField from '../../form-builder/DraggableField';


const FormBuilderPage = () => {
    const { fields, formName, setFormName, addField, reorderFields, resetForm } = useFormBuilderStore();

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(fields);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        reorderFields(items);
    };

    const handleSaveForm = async () => {
        try {
            const payload = {
                name: formName,
                fields_data: fields.map(({ id, ...field }) => field)
            };
            await axiosInstance.post('/form/templates/', payload);
            toast.success('Form template saved successfully!');
            resetForm();
        } catch (error) {
            toast.error('Failed to save form template.');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="text-sm font-bold p-2 border rounded"
                />

                <button onClick={handleSaveForm} className="flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
                    <FaSave className="mr-2" /> Save Form
                </button>
            </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="formFields">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                            {fields.map((field, index) => (
                                <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <DraggableField field={field} />
                                    </div>
                                )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
            </DragDropContext>

            <button
                onClick={addField}
                className="mt-4 flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
                <FaPlus className="mr-2" /> Add Field
            </button>
        </div>
    )
}

export default FormBuilderPage;