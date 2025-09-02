import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomerById } from '../services/customerService';
import AddressList from './AddressList';

function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    getCustomerById(id)
      .then(res => setCustomer(res.data))
      .catch(() => alert('Customer not found'));
  }, [id]);

  if (!customer) return <div>Loading...</div>;

  return (
    <div>
      <h2>Customer Details</h2>
      <div>
        <b>First Name:</b> {customer.firstName}
      </div>
      <div>
        <b>Last Name:</b> {customer.lastName}
      </div>
      <div>
        <b>Phone:</b> {customer.phone}
      </div>
      <div>
        <b>City:</b> {customer.city}
      </div>
      <div>
        <b>State:</b> {customer.state}
      </div>
      <div>
        <b>Pin Code:</b> {customer.pinCode}
      </div>

      <h3>Addresses</h3>
      <AddressList customerId={id} />

      <Link to="/">Back to List</Link>
    </div>
  );
}

export default CustomerDetails;
