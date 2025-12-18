import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        console.log('Fetching tasks with token:', token.substring(0, 20) + '...');
        
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true,
          crossDomain: true,
          credentials: 'include'
        });
        
        console.log('Tasks response:', response);
        
        if (response.data && response.data.data && response.data.data.tasks) {
          setTasks(response.data.data.tasks);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Unexpected response format from server');
        }
      } catch (err) {
        console.error('Error fetching tasks:', {
          message: err.message,
          response: err.response ? {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
          } : 'No response',
          config: {
            url: err.config?.url,
            method: err.config?.method,
            headers: err.config?.headers
          }
        });
        
        if (err.response) {
          if (err.response.status === 401) {
            setError('Your session has expired. Please log in again.');
            // Optionally redirect to login
            // navigate('/login');
          } else if (err.response.data && err.response.data.message) {
            setError(`Server error: ${err.response.data.message}`);
          } else {
            setError(`Request failed with status ${err.response.status}`);
          }
        } else if (err.request) {
          setError('No response from server. Please check your connection.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasks.filter(task => task._id !== id));
      } catch (err) {
        alert('Failed to delete task');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Tasks</h2>
        <Link to="/add-task" className="btn btn-primary">Add New Task</Link>
      </div>

      {tasks.length === 0 ? (
        <div className="alert alert-info">No tasks found. Create your first task!</div>
      ) : (
        <div className="list-group">
          {tasks.map(task => (
            <div key={task._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{task.title}</h5>
                  <p className="mb-1">{task.description}</p>
                  <small>
                    Priority: <span className={`badge bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'info'}`}>
                      {task.priority}
                    </span>
                  </small>
                  <small className="ms-2">
                    Status: <span className={`badge bg-${task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'primary' : 'secondary'}`}>
                      {task.status}
                    </span>
                  </small>
                </div>
                <div>
                  <Link to={`/edit-task/${task._id}`} className="btn btn-sm btn-outline-primary me-2">Edit</Link>
                  <button 
                    onClick={() => handleDelete(task._id)} 
                    className="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;