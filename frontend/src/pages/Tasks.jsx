import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('API Response:', response.data);
        if (response.data && response.data.data && response.data.data.tasks) {
          setTasks(response.data.data.tasks);
          console.log('Tasks set:', response.data.data.tasks);
        } else {
          console.warn('Unexpected API response structure:', response.data);
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again.');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  // Handle task deletion
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setIsDeleting(taskId);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsDeleting(null);
    }
  };

  // Toggle task status
  const handleStatusToggle = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const updatedTask = { status: newStatus };
      
      await axios.patch(
        `http://localhost:5000/api/tasks/${taskId}`,
        updatedTask,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const getSortedAndFilteredTasks = () => {
    let filteredTasks = [...tasks];
    
    // Apply filter
    if (filter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filter);
    }
    
    // Apply sorting
    filteredTasks.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return filteredTasks;
  };

  // Get badge class for status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success bg-opacity-10 text-success';
      case 'In Progress':
        return 'bg-warning bg-opacity-10 text-warning';
      default:
        return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };

  // Get badge class for priority
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-danger bg-opacity-10 text-danger';
      case 'Medium':
        return 'bg-warning bg-opacity-10 text-warning';
      default:
        return 'bg-info bg-opacity-10 text-info';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get sorted and filtered tasks
  const processedTasks = getSortedAndFilteredTasks();
  
  // Pagination
  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = processedTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(processedTasks.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading tasks...</span>
      </div>
    );
  }

  // Debug info
  console.log('Current tasks state:', tasks);
  console.log('Processed tasks:', processedTasks);
  console.log('Current page:', currentPage, 'Total pages:', totalPages);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">My Tasks</h1>
            <div className="bg-light p-3 rounded-3 shadow-sm">
              <Link to="/add-task" className="btn btn-primary">
                <i className="bi bi-plus-lg me-2"></i>Add Task
              </Link>
            </div>
          </div>
          
          {/* Task Box Container */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-0">
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Filter and Sort Controls */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">Filter by Status</span>
            <select 
              className="form-select" 
              value={filter} 
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Tasks</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0 table-borderless">
            <thead className="table-light">
              <tr>
                <th 
                  className="cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  Title
                  {sortConfig.key === 'title' && (
                    <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-short ms-1`}></i>
                  )}
                </th>
                <th 
                  className="cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {sortConfig.key === 'status' && (
                    <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-short ms-1`}></i>
                  )}
                </th>
                <th 
                  className="cursor-pointer"
                  onClick={() => handleSort('priority')}
                >
                  Priority
                  {sortConfig.key === 'priority' && (
                    <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-short ms-1`}></i>
                  )}
                </th>
                <th 
                  className="cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Created
                  {sortConfig.key === 'createdAt' && (
                    <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-short ms-1`}></i>
                  )}
                </th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.length > 0 ? (
                currentTasks.map(task => (
                  <tr key={task._id} className={task.status === 'Completed' ? 'table-active' : ''}>
                    <td className="align-middle">
                      <div className="d-flex align-items-center">
                        <div className="form-check me-3">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            checked={task.status === 'Completed'}
                            onChange={() => handleStatusToggle(task._id, task.status === 'Pending' ? 'Completed' : 'Pending')}
                            style={{ width: '1.25rem', height: '1.25rem' }}
                          />
                        </div>
                        <div>
                          <div className={`fw-medium ${task.status === 'Completed' ? 'text-decoration-line-through' : ''}`}>
                            {task.title}
                          </div>
                          <div className="text-muted small">
                            {task.description ? (
                              <span title={task.description}>
                                {task.description.length > 60 
                                  ? `${task.description.substring(0, 60)}...` 
                                  : task.description}
                              </span>
                            ) : (
                              <span className="text-muted fst-italic">No description</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">
                      <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                        {task.status === 'In Progress' ? (
                          <i className="bi bi-arrow-repeat me-1"></i>
                        ) : task.status === 'Completed' ? (
                          <i className="bi bi-check2-circle me-1"></i>
                        ) : (
                          <i className="bi bi-hourglass me-1"></i>
                        )}
                        {task.status}
                      </span>
                    </td>
                    <td className="align-middle">
                      <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority === 'High' ? (
                          <i className="bi bi-exclamation-triangle-fill me-1"></i>
                        ) : task.priority === 'Medium' ? (
                          <i className="bi bi-exclamation-circle-fill me-1"></i>
                        ) : (
                          <i className="bi bi-info-circle-fill me-1"></i>
                        )}
                        {task.priority}
                      </span>
                    </td>
                    <td className="align-middle">
                      <div className="small text-muted" title={new Date(task.createdAt).toString()}>
                        {formatDate(task.createdAt)}
                      </div>
                    </td>
                    <td className="align-middle text-end">
                      <div className="btn-group btn-group-sm" role="group">
                        <Link 
                          to={`/edit-task/${task._id}`}
                          className="btn btn-outline-primary"
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button 
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(task._id)}
                          disabled={isDeleting === task._id}
                          title="Delete"
                        >
                          {isDeleting === task._id ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            <i className="bi bi-trash"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    <div className="py-4">
                      <i className="bi bi-inbox" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
                      <div className="mt-2">No tasks found</div>
                      {filter !== 'all' && (
                        <button 
                          className="btn btn-link p-0"
                          onClick={() => setFilter('all')}
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {processedTasks.length > 0 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              Showing {currentTasks.length} of {processedTasks.length} task{processedTasks.length !== 1 ? 's' : ''}
              {filter !== 'all' && ` (filtered from ${tasks.length} total)`}
            </div>
            <div className="d-flex align-items-center">
              <div className="me-3 small text-muted">
                Page {currentPage} of {totalPages}
              </div>
              <div className="btn-group">
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <i className="bi bi-chevron-left"></i> Previous
                </button>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  disabled={currentPage === totalPages || processedTasks.length === 0}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default Tasks;
