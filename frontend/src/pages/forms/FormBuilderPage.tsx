import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import useFormBuilderStore from "../../store/formStore";
import { FaPlus, FaSave } from "react-icons/fa";
import DraggableField from "../../components/form-builder/DraggableField";
import {
  createFormTemplate,
  reorderFormFields,
  getFormTemplateFields,
} from "../../api/formService";
import type { FormField } from "../../types";

const FormBuilderPage = () => {
  const { fields, formName, setFormName, addField, reorderFields, resetForm } =
    useFormBuilderStore();
  const [templateId, setTemplateId] = useState<number | null>(null);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const newFields = items.map((field, index) => ({ ...field, order: index }));
    reorderFields(newFields as FormField[]);

    if (templateId) {
      try {
        const fieldOrders = newFields.map((field) => ({
          id: Number(field.id),
          order: field.order,
        }));

        await reorderFormFields(templateId, fieldOrders);
        toast.success("Fields reordered successfully!");
      } catch (error) {
        toast.error("Failed to reorder fields on the server.");
        console.error(error);
      }
    }
  };

  const handleSaveForm = async () => {
    if (!formName) {
      toast.error("Please provide a form name.");
      return;
    }

    if (fields.length === 0) {
      toast.error("Please add at least one field to the form.");
      return;
    }
    
    try {
      const response = await createFormTemplate(formName, fields);
      setTemplateId(response.data.id);
      toast.success("Form template saved successfully!");

      const fetchedFieldsResponse = await getFormTemplateFields(
        response.data.id
      );
      reorderFields(fetchedFieldsResponse.data.fields);
      resetForm();
    } catch (error) {
      toast.error("Failed to save form template.");
      console.error(error);
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
          placeholder="Form Name"
        />

        <button
          onClick={handleSaveForm}
          className="flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          <FaSave className="mr-2" /> Save Form
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="formFields">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {fields.map((field, index) => (
                <Draggable
                  key={field.id}
                  draggableId={String(field.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
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
  );
};

export default FormBuilderPage;
