import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
// import { ClerkProvider } from '@clerk/clerk-react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// Import the layouts
import RootLayout from './layouts/root-layout'
import DashboardLayout from './layouts/dashboard-layout'

// Import the components
import IndexPage from './routes'
import SignUpPage from './routes/sign-up'
import DashboardPage from './routes/dashboard'
import ListManagement from './routes/dashboard.listMgmt.tsx'
import EmailComposition from './routes/dashboard.emailComposition.tsx'
import ListManagementByID from './routes/dashboard.listMgmt.id.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "/sign-up/*", element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: "dashboard",
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/dashboard/listmgmt", element: <ListManagement /> },
          { path: "/dashboard/listmgmt/:listId", element: <ListManagementByID /> },
          { path: "/dashboard/emailcomposition", element: <EmailComposition /> },
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
