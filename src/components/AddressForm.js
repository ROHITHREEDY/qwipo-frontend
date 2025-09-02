import React, { useState } from 'react';
import { createAddress, updateAddress } from '../services/addressService';

function AddressForm({ address, stopEditing }) {
  const [formData, setFormData] = useState({ ...address });
  const [errors, setErrors] = useState([]);

  const validate = () => {
    const errs = [];
    if (!formData.addressLine.trim()) errs.push('Address is required');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;

    if (formData.id) {
      updateAddress(formData.id, formData)
        .then(() => {
          alert('Address updated');
          stopEditing();
        })
        .catch(err => alert('Error updating address: ' + err.message));
    } else {
      createAddress(formData)
        .then(() => {
          alert('Address added');
          stopEditing();
        })
        .catch(err => alert('Error adding address: ' + err.message));
    }
  };

  return (
    <div>
      <h3>{formData.id ? 'Edit' : 'Add'} Address</h3>
      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((err, idx) => <li key={idx}>{err}</li>)}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Address: </label>
          <input name="addressLine" value={formData.addressLine} onChange={handleChange} />
        </div>
        <div>
          <label>City: </label>
          <input name="city" value={formData.city} onChange={handleChange} />
        </div>
        <div>
          <label>State: </label>
          <input name="state" value={formData.state} onChange={handleChange} />
        </div>
        <div>
          <label>Pin Code: </label>
          <input name="pinCode" value={formData.pinCode} onChange={handleChange} />
        </div>
        <button type="submit" style={{ marginRight: 5 }}>{formData.id ? 'Update' : 'Add'}</button>
        <button type="button" onClick={stopEditing}>Cancel</button>
      </form>
    </div>
  );
}

export default AddressForm;
