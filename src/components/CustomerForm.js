import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCustomer, getCustomerById, updateCustomer } from '../services/customerService';

function CustomerForm() {
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    state: '',
    pinCode: '',
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getCustomerById(id)
        .then(res => {
          setCustomer(res.data);
        })
        .catch(() => {
          alert('Customer not found');
          navigate('/');
        });
    }
  }, [id, navigate]);

  const validate = () => {
    const errs = [];
    if (!customer.firstName.trim()) errs.push('First name is required');
    if (!customer.lastName.trim()) errs.push('Last name is required');
    if (!customer.phone.trim()) errs.push('Phone is required');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleChange = e => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;

    if (id) {
      updateCustomer(id, customer)
        .then(() => {
          alert('Customer updated successfully');
          navigate('/');
        })
        .catch(err => alert('Error updating: ' + err.message));
    } else {
      createCustomer(customer)
        .then(() => {
          alert('Customer created successfully');
          navigate('/');
        })
        .catch(err => alert('Error creating: ' + err.message));
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit' : 'Add'} Customer</h2>
      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name: </label>
          <input name="firstName" value={customer.firstName} onChange={handleChange} />
        </div>
        <div>
          <label>Last Name: </label>
          <input name="lastName" value={customer.lastName} onChange={handleChange} />
        </div>
        <div>
          <label>Phone: </label>
          <input name="phone" value={customer.phone} onChange={handleChange} />
        </div>
        <div>
          <label>City: </label>
          <input name="city" value={customer.city} onChange={handleChange} />
        </div>
        <div>
          <label>State: </label>
          <input name="state" value={customer.state} onChange={handleChange} />
        </div>
        <div>
          <label>Pin Code: </label>
          <input name="pinCode" value={customer.pinCode} onChange={handleChange} />
        </div>
        <button type="submit">{id ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
}

export default CustomerForm;
