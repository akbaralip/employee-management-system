import axiosInstance from './axiosInstance';
import type { FormField } from '../types';

export const createFormTemplate = (formName: string, fields: FormField[]) => {
    const payload = {
        name: formName,
        fields: fields.map(({ id, ...field }) => ({ ...field, order: 0 })),
    };
    return axiosInstance.post('/form/templates/', payload);
};

export const getFormTemplates = () => {
    return axiosInstance.get('/form/templates/');
};

export const reorderFormFields = (templateId: number, fieldOrders: { id: number; order: number; }[]) => {
    return axiosInstance.post(`/form/templates/${templateId}/reorder_fields/`, {
        field_orders: fieldOrders,
    });
};

export const getFormTemplateFields = (templateId: number) => {
    return axiosInstance.get(`/form/templates/${templateId}/`);
};
