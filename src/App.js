import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function App() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pinCode: ''
  });
  const [searchFilter, setSearchFilter] = useState({ city: '', state: '', pinCode: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/customers`);
      setCustomers(res.data);
      setMessage('');
      setMessageType('');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error fetching customers';
      setMessage(errorMsg);
      setMessageType('error');
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.city) {
      setMessage('Please fill in all required fields');
      setMessageType('error');
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/customers`, formData);
      setMessage('Customer created successfully');
      setMessageType('success');
      setFormData({ firstName: '', lastName: '', phoneNumber: '', address: '', city: '', state: '', pinCode: '' });
      fetchCustomers();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error creating customer';
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter(cust =>
    (!searchFilter.city || (cust.city || '').toLowerCase().includes(searchFilter.city.toLowerCase())) &&
    (!searchFilter.state || (cust.state || '').toLowerCase().includes(searchFilter.state.toLowerCase())) &&
    (!searchFilter.pinCode || (cust.pinCode || '').includes(searchFilter.pinCode))
  );

  const handleSearchChange = e => {
    const { name, value } = e.target;
    setSearchFilter(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSearchFilter({ city: '', state: '', pinCode: '' });
  };

  return (
    <div className="App">
      <h1>Customer Management</h1>
      {message && (
        <p className={`message ${messageType === 'error' ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="customer-form">
        <h2>Add New Customer</h2>
        <input name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleInputChange} required />
        <input name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleInputChange} required />
        <input name="phoneNumber" placeholder="Phone Number *" value={formData.phoneNumber} onChange={handleInputChange} required />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
        <input name="city" placeholder="City *" value={formData.city} onChange={handleInputChange} required />
        <input name="state" placeholder="State" value={formData.state} onChange={handleInputChange} />
        <input name="pinCode" placeholder="Pin Code" value={formData.pinCode} onChange={handleInputChange} />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Customer'}
        </button>
      </form>

      <div className="search-section">
        <h2>Search Customers</h2>
        <input name="city" placeholder="City" value={searchFilter.city} onChange={handleSearchChange} />
        <input name="state" placeholder="State" value={searchFilter.state} onChange={handleSearchChange} />
        <input name="pinCode" placeholder="Pin Code" value={searchFilter.pinCode} onChange={handleSearchChange} />
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      <h2>Customer List</h2>
      <ul className="customer-list">
        {filteredCustomers.length === 0 ? (
          <li>No customers found.</li>
        ) : (
          filteredCustomers.map(customer => (
            <li key={customer.id}>
              {customer.firstName} {customer.lastName} - {customer.phoneNumber} - {customer.city}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
