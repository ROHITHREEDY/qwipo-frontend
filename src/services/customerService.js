import axios from 'axios';

const API_URL = 'http://localhost:5000/api/customers';

export const getCustomers = (filters) => {
  const params = new URLSearchParams(filters);
  return axios.get(`${API_URL}?${params.toString()}`);
};

export const getCustomerById = (id) => axios.get(`${API_URL}/${id}`);

export const createCustomer = (customer) => axios.post(API_URL, customer);

export const updateCustomer = (id, customer) => axios.put(`${API_URL}/${id}`, customer);

export const deleteCustomer = (id) => axios.delete(`${API_URL}/${id}`);
