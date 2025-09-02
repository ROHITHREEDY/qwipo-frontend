import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers, deleteCustomer } from '../services/customerService';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({ city: '', state: '', pinCode: '' });

  const fetchCustomers = () => {
    getCustomers(filters)
      .then(response => setCustomers(response.data))
      .catch(err => alert('Error fetching customers: ' + err.message));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id)
        .then(() => {
          alert('Customer deleted');
          fetchCustomers();
        })
        .catch(err => alert('Error deleting customer: ' + err.message));
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchCustomers();
  };

  const clearFilters = () => {
    setFilters({ city: '', state: '', pinCode: '' });
    getCustomers({})
      .then(response => setCustomers(response.data))
      .catch(err => alert('Error fetching customers: ' + err.message));
  };

  return (
    <div>
      <h2>Customer List</h2>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          name="city"
          placeholder="Filter by City"
          value={filters.city}
          onChange={handleFilterChange}
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          name="state"
          placeholder="Filter by State"
          value={filters.state}
          onChange={handleFilterChange}
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          name="pinCode"
          placeholder="Filter by Pin Code"
          value={filters.pinCode}
          onChange={handleFilterChange}
          style={{ marginRight: 10 }}
        />
        <button onClick={applyFilters} style={{ marginRight: 5 }}>Apply</button>
        <button onClick={clearFilters}>Clear</button>
      </div>
      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>State</th>
            <th>Pin Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.firstName}</td>
              <td>{c.lastName}</td>
              <td>{c.phone}</td>
              <td>{c.city}</td>
              <td>{c.state}</td>
              <td>{c.pinCode}</td>
              <td>
                <Link to={`/details/${c.id}`} style={{ marginRight: 10 }}>View</Link>
                <Link to={`/edit/${c.id}`} style={{ marginRight: 10 }}>Edit</Link>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>No customers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
