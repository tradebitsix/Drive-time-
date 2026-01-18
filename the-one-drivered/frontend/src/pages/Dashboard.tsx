import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { logout } from '../auth/useAuth';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  state: string;
}

const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({
    first_name: '',
    last_name: '',
    email: '',
    state: '',
  });
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const response = await api.get<Student[]>('/api/students/');
      setStudents(response.data);
    } catch (err) {
      setError('Failed to load students');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post<Student>('/api/students/', newStudent);
      setStudents((prev) => [...prev, response.data]);
      setNewStudent({ first_name: '', last_name: '', email: '', state: '' });
    } catch (err) {
      setError('Failed to add student');
    }
  };

  const handleLogout = () => {
    logout();
    // reload to show login page
    window.location.reload();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Log Out
        </button>
      </div>
      <h2 style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: 500 }}>Students</h2>
      {error && <p style={{ color: '#e3342f' }}>{error}</p>}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {students.map((s) => (
          <li key={s.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
            {s.first_name} {s.last_name} — {s.email} ({s.state})
          </li>
        ))}
      </ul>
      <h3 style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>Add Student</h3>
      <form onSubmit={handleAddStudent} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="first_name" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>First Name</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={newStudent.first_name}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="last_name" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Last Name</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={newStudent.last_name}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={newStudent.email}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="state" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>State (e.g. ID)</label>
          <input
            id="state"
            name="state"
            type="text"
            value={newStudent.state}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            maxLength={2}
            required
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
      </form>
    </div>
  );
};

export default Dashboard;