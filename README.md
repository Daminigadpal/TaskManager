<h1 align="center"> 
Smart Task Management System

</h1>
<p align="center">Smart Task Management System is a full-stack MERN application designed to handle task organization with built-in priority logic, secure JWT authentication, and soft-delete capabilities.</p>


<h2 align='center'>
<!--  -->
</h2>

## Table of Contents

- [Introduction ](#introduction)
- [Project Setup Steps ](#ProjectSetupSteps)
- [Environment Variables ](#EnvironmentVariables)
- [Tech-Stack ](#techStack)
- [API Documentation](#api-Documnentation)
- [License ](#license)
- [Contact ](#contact)
- [Acknowledgments ](#acknowledgments)


## Introduction
Smart Task Management System is a full-stack MERN application designed to handle task organization with built-in priority logic, secure JWT authentication, and soft-delete capabilities.


## Project SetUp Steps
1. **Repository Initialization**:
   First, organize your project folder. Most MERN projects use a split structure for the frontend and backend.
   - ``mkdir task-manager-mern``
    -`` cd task-manager-mern``
   -`` # Initialize git (optional)``
   -`` git init``

- **2. Backend Setup (Node.js/Express)**: The backend handles the database connection, authentication, and API logic.
>- **>Create the server folder**:
- ``mkdir server``
- ``cd server``
- ``npm init -y``

>- **>.Install Backend Dependencies:**
-`` npm install express mongoose dotenv jsonwebtoken bcryptjs cors``
- ``npm install -D nodemon``

>- **>.Configure Environment Variables:** Create a .env file in the /server directory:
- ``PORT=5000``
- ``MONGO_URI=your_mongodb_connection_string``
- ``JWT_SECRET=your_jwt_secret_key``

>- **>Start the Server**:``npm run dev``

- **3. Frontend Setup (React/Vite)**:The frontend provides the user interface and communicates with the backend via Axios
- **>Create the React App (using Vite)**:From the root folder (task-manager-mern):
-  ``npm create vite@latest client -- --template react``
-  ``cd client``
-  ``npm install``

-  **>Install Frontend Dependencies**:``npm install axios react-router-dom``
 -  **>Start the Development Server**:``npm run dev``
 -  **>Database Configuration (MongoDB)**:Ensure your MongoDB instance is accessible:
 -  Atlas: Whitelist your IP address and copy the connection string into your server/.env file.
 -  Local: Ensure the MongoDB service is running on
 -  ``mongodb://localhost:27017/taskmanager.``
> -  **>Final Folder Structure**:Your project should now look like this for optimal organization:
> -  ``task-manager-mern/
> -   ── client/              # React (Vite) source code
> - | ├── src/
> -         ├── components/  # Navbar, ProtectedRoute
> -        ├── pages/       # Login, TaskList, TaskForm
> -        └── services/    # api.js (Axios instance)
> - |── server/              # Node.js source code
> -          ├── controllers/     # Route logic
> -          ├── models/          # Mongoose Schemas (User, Task)
> -          ├── routes/          # API endpoints
> -          ├── middleware/      # Auth security
> -          └── server.js        # Entry point
> - | ── .gitignore           # Ignore node_modules & .env``
 - ** Verification**:To ensure the setup is correct:
 - Open your browser to the frontend URL ``(usually http://localhost:5173)``.
 - Check the terminal for the backend message: Server running on port 5000 and Database Connected.
 - Attempt to register a user to test the End-to-End connection.

   ## Environment Variables
   You should create a file named .env in your server folder
- **1. Server-Side Environment Variables (server/.env)**: These variables are used by your Node.js/Express backend to connect to the database and handle security.
-   The port the server will run on
``PORT=5000``
-  Your MongoDB connection string (Atlas or Local)
-  Replace <password> and <dbname> with your actual details
``MONGO_URI=mongodb+srv://admin:password123@cluster0.mongodb.net/task_manager``
- Secret key used to sign JWT tokens (make this long and random)
``JWT_SECRET=super_secret_key_998877``
-  How long the user stays logged in (e.g., 1 day or 7 days)
``JWT_EXPIRES_IN=1d``
-  Environment mode
``NODE_ENV=development ``
- **2. Client-Side Environment Variables (client/.env)** :If you are using Vite for your frontend, you can define your API URL here. In Vite, all environment variables must start with ``VITE_.``
- **The base URL for your backend API**
``VITE_API_URL=http://localhost:5000/api``
- **3. Important Security Rules**:
- **Never Push to GitHub**: Ensure your ``.env`` file is listed in your ``.gitignore file``. If you upload this, anyone can access your database.
- ``.env.example``: It is a best practice to create a file named`` .env.example`` that contains the keys but not the real values. This helps other developers know what variables they need to set up.
- Example ``.env.example``:``PORT=5000``
- ``MONGO_URI=``
- ``JWT_SECRET=``
- ``JWT_EXPIRES_IN=1d``
- **How to access them in your code**:
- In Backend: Use ``process.env.VARIABLE_NAME`` (e.g.,`` process.env.MONGO_URI``). You must call ``require('dotenv').config()`` at the top of your`` server.js``.
- **In Frontend (Vite)**: Use ``import.meta.env.VITE_API_URL``.


## Tech Stack
**Component,Technology,Role in Your Project**:
- M: MongoDB,
- A: NoSQL database used to store User profiles and Task data as JSON-like documents.
- E: Express.js,"A web framework for Node.js that handles your API routing (e.g., /api/tasks)."
- R: React.js,"The frontend library used to build the interactive UI, Task cards, and Login forms."
- N: Node.js,The runtime environment that allows your JavaScript backend to run on your computer/server.

## Frontend (Client-Side):
 Frontend (Client-Sid)
- Vite: The build tool used to initialize and run the React project (faster than Create React App).
- Axios: The library used to send GET, POST, PUT, and DELETE requests to your server.
- React Router DOM: Handles navigation between the Login page and the Task Dashboard without refreshing the browser.
- Context API: Manages the "Global State," ensuring the app knows a user is logged in across all pages. give this in two lines

## Backend (Server-Side)
The backend leverages Mongoose to structure data and Dotenv to securely manage environment variables.
Authentication is handled by JWT for secure user sessions, 
while Bcrypt.js ensures data safety by hashing passwords before they reach the database.

## 📝 Task Management Endpoints
These routes are protected. You must include Authorization: Bearer <your_token> in the request header to access them.
- ``GET /api/tasks``: Retrieves all tasks belonging to the logged-in user.
Supports Query Params: ?search=keyword and ?status=Pending/Completed.
-``POST /api/tasks``: Creates a new task.
Smart Logic: If priority is set to "High," the status automatically defaults to "In Progress."
- ``GET /api/tasks/:id:`` Fetches the full details of a single specific task.
- ``PUT /api/tasks/:id:`` Updates an existing task's title, description, priority, or status.
- ``DELETE /api/tasks/:id:`` Executes a Soft Delete by setting isDeleted: true (the task remains in the DB but is hidden from the UI).
## 📊 Query & Filtering Logic
**The GET /api/tasks endpoint is pre-configured with the following backend logic**:
- Search: Uses a MongoDB $regex to find partial matches in task titles.
- Filter: Narrows down results based on the task's current status.
- Default Sort: Automatically orders results by Priority (High > Medium > Low) and then by Newest First.





## Contribute
Contributions are welcome! If you'd like to contribute, please follow our [Contribution Guidelines](CONTRIBUTING.md).

## Contributors
- Damini Gadpal [GitHub](https://github.com/Daminigadpal) | [LinkedIn](https://www.linkedin.com/in/damini-gadpal-01996716b) 

## License
This project is Distributed under the ISC License. See [LICENSE](./LICENSE) for more information.

## Contact
If you have any questions or suggestions, feel free to reach out to us at [Gmail](https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcSGLPhhCThjSQBxqqKCTksFHbgmPZGmrTXlskrtrXBgHxRqbmdRdzJJlNBtvTWsTLmjdVLbb).

## Acknowledgment
We'd like to thank the contributors to this project for their valuable contributions.


## Happy Learning

<p align="center">
<a href="https://github.com/Abhi1o/get_youtube_subscribers" title="GET youtube subscriber projects">
<img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white">
    
</a>
</p>
