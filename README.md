# TaskManager
A full-stack MERN Task Management System featuring JWT authentication, soft-delete functionality, priority-based task sorting, and real-time search/filtering. Built with React (Vite) and Node.js.
🚀 Smart Task Management System (MERN)
A robust Full-Stack application designed to manage daily tasks efficiently. This project implements a secure backend with Node/Express and a dynamic, responsive frontend using React.

✨ Key Features
Secure Authentication: User registration and login using JWT (JSON Web Tokens) and Bcrypt password hashing.

Task CRUD: Create, Read, Update, and Soft-Delete tasks.

Smart Logic: Automatically sets status to "In Progress" for High-priority tasks.

Priority Sorting: Tasks are automatically ordered by priority (High > Medium > Low).

Search & Filter: Real-time search by title and filtering by status (Pending, In Progress, Completed).

Protected Routes: Frontend routes are guarded; only logged-in users can access the dashboard.

Global Layout: Persistent Navbar with an active logout mechanism.

🛠️ Tech Stack
Frontend: React.js (Vite), React Router DOM, Axios, Context API.

Backend: Node.js, Express.js.

Database: MongoDB with Mongoose ODM.

Security: JWT for authorization, CORS for cross-origin requests.

3. Recommended GitHub Tags (Topics)
Add these tags to your repository to make it more discoverable: javascript mongodb expressjs reactjs nodejs mern-stack jwt-authentication task-manager

💡 Pro-Tip before you Push to GitHub:
Make sure you have a .gitignore file in your root folder. You must not upload your node_modules or your .env file (which contains your database password).

Your .gitignore should include:
