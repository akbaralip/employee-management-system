import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { FieldType } from '../types';

interface FormField {
    id: string;
    label: string;
    fieldType: FieldType;
    order: number;
}

interface FormBuilderState {
    formName: string;
    fields: FormField[];
    setFormName: (name: string) => void;
    addField: () => void;
    updateField: (id: string, updates: Partial<FormField>) => void;
    removeField: (id: string) => void;
    reorderFields: (fields: FormField[]) => void;
    resetForm: () => void;
}

const useFormBuilderStore = create<FormBuilderState>((set) => ({
    formName: 'New Employee Form',
    fields: [],
    setFormName: (name) => set({formName: name}),
    addField: () => 
        set((state) => ({
            fields: [
                ...state.fields,
                { id: uuidv4(), label: 'New Field', fieldType: 'text', order: state.fields.length },
            ],
    })),
    updateField: (id, updates) =>
        set((state) => ({
        fields: state.fields.map((field) =>
            field.id === id ? { ...field, ...updates } : field
        ),
    })),
    removeField: (id) =>
    set((state) => ({
      fields: state.fields.filter((field) => field.id !== id),
    })),
  reorderFields: (newFields) =>
    set({
      fields: newFields.map((field, index) => ({ ...field, order: index })),
    }),
  resetForm: () => set({ formName: 'New Employee Form', fields: [] }),
}))

export default useFormBuilderStore;