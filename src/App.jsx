import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Function to fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setIsLoading(false);
  };

  // Fetch users when the component first loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form submission to create a new user
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !email) {
      alert('Please enter both name and email.');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        // Clear the form and refresh the user list
        setName('');
        setEmail('');
        fetchUsers();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('An error occurred while creating the user.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cloudflare Users</h1>
        <div className="card">
          <h2>Add New User</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <button type="submit">Add User</button>
          </form>
        </div>

        <div className="card">
          <h2>User List</h2>
          {isLoading ? (
            <p>Loading users...</p>
          ) : (
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;