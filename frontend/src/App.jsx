import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/TaskList';
import TaskForm from './pages/NewTaskForm'; 
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
              <Route element={<Layout />}></Route>
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-task" 
              element={
                <ProtectedRoute>
                  <TaskForm />
                </ProtectedRoute>

              } 
              />
              <Route 
              path="*" element={<Navigate to="/login" />}

            />
            
            <Route 
              path="/edit-task/:id" 
              element={
                <ProtectedRoute>
                  <TaskForm />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/tasks" />} />
            
          </Routes>

        </div>


      </Router>
    </AuthProvider>
  );
}

export default App;


