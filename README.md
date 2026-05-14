# Kanban Board Application

A full-stack Kanban board application that allows users to manage tasks across different columns (e.g., To Do, In Progress, Done). It supports drag-and-drop functionality, adding and deleting cards, along with undo/redo capabilities.

## 🛠 Tech Stack

### Frontend (`/client`)
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Drag & Drop:** `@dnd-kit`
- **Testing:** Jest, React Testing Library

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Testing:** Jest

### End-to-End Testing (`/e2e`)
- **Framework:** Cypress

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm (Node Package Manager)

### 1. Installation

You will need to install the dependencies for both the client and server separately.

**Install Backend Dependencies:**
```bash
cd server
npm install
```

**Install Frontend Dependencies:**
```bash
cd ../client
npm install
```

**Install E2E Testing Dependencies:**
```bash
cd ../e2e
npm install
```

---

## 💻 Running the Application

For the application to work properly, you need to run both the backend server and the frontend client concurrently.

### Start the Backend Server
The server runs on **port 3001** and handles API requests.
```bash
cd server
npm run dev
```

### Start the Frontend Client
The Vite development server runs on **port 3000** and proxies `/api` requests to the backend.
```bash
cd client
npm run dev
```

Once both are running, open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing

The project includes unit tests for both the frontend and backend, as well as end-to-end tests via Cypress.

### Run Unit Tests
You can run all the unit tests for both the client and the server simultaneously from the **root directory**:

```bash
# In the root directory
npm run test
```

Alternatively, you can run them individually within their respective directories (`npm test`).

### Run E2E Tests
To run the Cypress end-to-end tests, make sure both your frontend and backend servers are running, then execute:

```bash
cd e2e
npm run cypress:open  # Opens the Cypress UI
# OR
npm run cypress:run   # Runs tests headlessly in the terminal
```

---

## 📦 Building for Production

To build the frontend and backend for production environments:

**Build the Backend:**
```bash
cd server
npm run build
```
*The compiled JavaScript will be output to `server/dist/`.*

**Build the Frontend:**
```bash
cd client
npm run build
```
*The optimized static assets will be output to `client/dist/`.*
