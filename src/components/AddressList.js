import React, { useState, useEffect } from 'react';
import { getAddressesByCustomerId, deleteAddress } from '../services/addressService';
import AddressForm from './AddressForm';

function AddressList({ customerId }) {
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = () => {
    getAddressesByCustomerId(customerId)
      .then(res => setAddresses(res.data))
      .catch(err => alert('Error fetching addresses: ' + err.message));
  };

  useEffect(() => {
    fetchAddresses();
  }, [customerId]);

  const handleEdit = (address) => {
    setEditingAddress(address);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      deleteAddress(id)
        .then(() => {
          alert('Address deleted');
          fetchAddresses();
        })
        .catch(err => alert('Error deleting address: ' + err.message));
    }
  };

  const stopEditing = () => {
    setEditingAddress(null);
    fetchAddresses();
  };

  return (
    <div>
      {editingAddress ? (
        <AddressForm address={editingAddress} stopEditing={stopEditing} />
      ) : (
        <>
          <button onClick={() => setEditingAddress({ customerId, addressLine: '', city: '', state: '', pinCode: '' })}>
            Add Address
          </button>
          <table border="1" cellPadding="10" cellSpacing="0" width="100%" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Pin Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map(addr => (
                <tr key={addr.id}>
                  <td>{addr.addressLine}</td>
                  <td>{addr.city}</td>
                  <td>{addr.state}</td>
                  <td>{addr.pinCode}</td>
                  <td>
                    <button onClick={() => handleEdit(addr)} style={{ marginRight: 5 }}>Edit</button>
                    <button onClick={() => handleDelete(addr.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {addresses.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No addresses found</td></tr>}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AddressList;
