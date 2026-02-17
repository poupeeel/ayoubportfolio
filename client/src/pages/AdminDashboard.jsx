import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SERVER_HOST from '../config';

function AdminDashboard() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchContacts();
  }, [navigate]);

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${SERVER_HOST}/api/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        navigate('/admin');
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        setContacts(data);
      } else {
        setError(data.error || 'Failed to fetch contacts');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a contact
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    setDeleting(id);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${SERVER_HOST}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setContacts(contacts.filter(contact => contact._id !== id));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete contact');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin');
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Admin Dashboard</h1>
            <p>Manage your contact form submissions</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        {error && (
          <div className="dashboard-error">
            <span>⚠</span> {error}
            <button onClick={() => setError('')} className="error-dismiss">×</button>
          </div>
        )}

        <div className="contacts-section">
          <div className="section-header">
            <h2>Contact Submissions</h2>
            <span className="contact-count">{contacts.length} total</span>
          </div>

          {contacts.length === 0 ? (
            <div className="no-contacts">
              <p>No contact submissions yet.</p>
            </div>
          ) : (
            <div className="contacts-table-wrapper">
              <table className="contacts-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td className="contact-name">{contact.name}</td>
                      <td>
                        <a href={`mailto:${contact.email}`} className="contact-email">
                          {contact.email}
                        </a>
                      </td>
                      <td>{contact.telephone || '-'}</td>
                      <td>{contact.subject || '-'}</td>
                      <td className="contact-message">
                        <span className="message-text">{contact.message}</span>
                      </td>
                      <td className="contact-date">{formatDate(contact.createdAt)}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          disabled={deleting === contact._id}
                          className="delete-button"
                        >
                          {deleting === contact._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
