import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch all users and products
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [usersResponse, productsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setUsers(usersResponse.data); // Corrected variable name
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <h3>{user.firstname} {user.lastname}</h3>
            <p>Email: {user.email}</p>
            <p>User Type: {user.userType}</p>
            <button>Edit</button>
            <button>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button>Edit</button>
            <button>Delete</button>
          </li>
        ))}
      </ul>
      {/* Add more admin-specific features like:
          - Manage user roles
          - View sales reports
          - Handle customer support
      */}
    </div>
  );
}

export default AdminDashboard;