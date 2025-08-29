import axiosInstance from './axiosInstance';
import type {EmployeeData } from '../types';

export const getEmployees = () => {
    return axiosInstance.get('/employees/');
};

export const getEmployeeById = (id: number) => {
    return axiosInstance.get(`/employees/${id}/`);
};

export const createEmployee = (formTemplateId: number, data: EmployeeData[]) => {
    const payload = {
        form_template: formTemplateId,
        data: data.map(item => ({ field_label: item.field_label, field_value: item.field_value })),
    };
    return axiosInstance.post('/employees/', payload);
};

export const updateEmployee = (id: number, formTemplateId: number, data: EmployeeData[]) => {
    const payload = {
        form_template: formTemplateId,
        data: data.map(item => ({ field_label: item.field_label, field_value: item.field_value })),
    };
    return axiosInstance.put(`/employees/${id}/`, payload);
};

export const deleteEmployee = (id: number) => {
    return axiosInstance.delete(`/employees/${id}/`);
};

export const searchEmployees = (query: string) => {
    return axiosInstance.get(`/employees/search/?q=${query}`);
};