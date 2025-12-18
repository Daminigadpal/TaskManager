import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
  });
  const [loading, setLoading] = useState(!!id); // Set loading to true if editing
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (response.data && response.data.task) {
          setFormData({
            title: response.data.task.title || '',
            description: response.data.task.description || '',
            status: response.data.task.status || 'Pending',
            priority: response.data.task.priority || 'Medium',
          });
        }
      } catch (err) {
        console.error('Error fetching task:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.response?.data?.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Basic validation
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority
      };
      
      const url = id ? `http://localhost:5000/api/tasks/${id}` : 'http://localhost:5000/api/tasks';
      const method = id ? 'put' : 'post';
      
      const response = await axios({
        method,
        url,
        data: taskData,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200 || response.status === 201) {
        navigate('/tasks');
      } else {
        throw new Error(response.data?.message || 'Failed to save task');
      }
      
    } catch (error) {
      console.error('Task submission error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login', { state: { from: 'task-form' } });
        return;
      }
      
      setError(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && id) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading task...</span>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">{id ? 'Edit Task' : 'Create New Task'}</h2>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-bold">Title</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-bold">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter task description"
                  ></textarea>
                </div>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="status" className="form-label fw-bold">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="In Progress">🚧 In Progress</option>
                      <option value="Completed">✅ Completed</option>
                    </select>
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="priority" className="form-label fw-bold">Priority</label>
                    <select
                      className="form-select"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="Low">⬇️ Low</option>
                      <option value="Medium">⏺️ Medium</option>
                      <option value="High">⬆️ High</option>
                    </select>
                  </div>
                </div>
                
                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate('/tasks')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {id ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        {id ? 'Update Task' : 'Create Task'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
