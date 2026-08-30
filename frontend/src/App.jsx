import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';
import { Documents } from './pages/Documents';
import { Employees } from './pages/Employees';
import { Customers } from './pages/Customers';
import { Reports } from './pages/Reports';
import { DeveloperPortal } from './pages/DeveloperPortal';
import { CompanyData } from './pages/CompanyData';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Activity } from './pages/Activity';
import { Admin } from './pages/Admin';

const PageTitleMap = {
  '/': { title: 'Employee Dashboard', subtitle: 'Overview of company projects, task assignments & portal activities' },
  '/projects': { title: 'Projects Portfolio', subtitle: 'Manage software development initiatives and team milestones' },
  '/tasks': { title: 'Task Management', subtitle: 'Kanban workspace for sprint tasks, priorities, and assignments' },
  '/documents': { title: 'Document Center', subtitle: 'Corporate document repository, technical specs, and client files' },
  '/employees': { title: 'Employee Directory', subtitle: 'Company organizational roster, engineering leads, and contact details' },
  '/customers': { title: 'Customer Accounts', subtitle: 'Client portfolio, account managers, and deployment status' },
  '/reports': { title: 'Business Reports & Analytics', subtitle: 'Executive performance metrics, team productivity, and revenue' },
  '/developer': { title: 'Developer Portal', subtitle: 'CI/CD build pipelines, microservices repos, and API specs' },
  '/company-data': { title: 'Company Master Data Hub', subtitle: 'Internal enterprise datasets and master data catalog' },
  '/profile': { title: 'Employee Profile', subtitle: 'Personal credentials, technical competencies, and assigned projects' },
  '/settings': { title: 'Portal Settings', subtitle: 'Appearance themes, notification preferences, and language settings' },
  '/activity': { title: 'Recent Activity Feed', subtitle: 'Real-time audit log of team actions and workspace events' },
  '/admin': { title: 'Administrator Console', subtitle: 'Privileged system actions and security telemetry' }
};

const ProtectedLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const currentMeta = PageTitleMap[location.pathname] || { title: 'NexaCore Portal', subtitle: '' };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
        />
        <main className="page-content">
          {children}
        </main>
      </div>
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/developer" element={<DeveloperPortal />} />
                  <Route path="/company-data" element={<CompanyData />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/activity" element={<Activity />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ProtectedLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
