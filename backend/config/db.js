const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      title TEXT,
      department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Projects Table
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      manager TEXT NOT NULL,
      team_count INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      deadline TEXT NOT NULL,
      progress INTEGER NOT NULL,
      status TEXT NOT NULL,
      description TEXT,
      document_path TEXT
    )
  `);

  // 3. Tasks Table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      assigned_employee TEXT NOT NULL,
      priority TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL,
      project_name TEXT
    )
  `);

  // 4. Employees Table
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      position TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL,
      phone TEXT,
      avatar TEXT
    )
  `);

  // 5. Customers Table
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      industry TEXT NOT NULL,
      project TEXT NOT NULL,
      account_manager TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `);

  // 6. Documents Table
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      owner TEXT NOT NULL,
      last_modified TEXT NOT NULL,
      size TEXT NOT NULL
    )
  `);

  // 7. Repositories / Dev Portal Table
  db.run(`
    CREATE TABLE IF NOT EXISTS repositories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      branch TEXT NOT NULL,
      last_commit TEXT NOT NULL,
      build_number TEXT NOT NULL,
      build_status TEXT NOT NULL,
      deployment_status TEXT NOT NULL,
      environment TEXT NOT NULL
    )
  `);

  // 8. Activity Log Table
  db.run(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity TEXT NOT NULL,
      user TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL
    )
  `);

  // Replace all login accounts with the single VIT credential
  const vitPass = bcrypt.hashSync('hi@vit', 10);
  db.run("DELETE FROM users", (delErr) => {
    if (delErr) return console.error("Error clearing users:", delErr);
    db.run(
      "INSERT INTO users (email, password, role, name, title, department) VALUES (?, ?, ?, ?, ?, ?)",
      ['helloVIT', vitPass, 'developer', 'helloVIT', 'Senior Software Engineer', 'Engineering']
    );
  });

  // Seed Data if projects table is empty
  db.get("SELECT COUNT(*) as count FROM projects", async (err, row) => {
    if (err) return console.error("Error checking projects count:", err);
    if (row.count === 0) {
      console.log("🌱 Seeding NexaCore Technologies enterprise database...");

      // Seed Projects
      const projects = [
        ['Aurora Cloud Platform', 'Alex Johnson', 8, '2026-01-15', '2026-10-15', 75, 'Active', 'Enterprise cloud orchestration & serverless engine.'],
        ['Atlas Analytics', 'Priya Nair', 5, '2026-03-01', '2026-11-30', 40, 'In Progress', 'Real-time business intelligence and data warehouse.'],
        ['Mercury Mobile', 'Rahul Sharma', 6, '2026-02-10', '2026-09-20', 90, 'Active', 'Cross-platform mobile workspace suite.'],
        ['Nova CRM', 'Ananya Menon', 4, '2025-11-01', '2026-08-01', 100, 'Completed', 'Customer relationship and sales pipeline platform.'],
        ['Orion AI Platform', 'Vikram Raj', 7, '2026-05-01', '2026-12-15', 20, 'On Hold', 'Next-gen LLM knowledge graph integration.']
      ];
      projects.forEach(p => {
        db.run("INSERT INTO projects (name, manager, team_count, start_date, deadline, progress, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", p);
      });

      // Seed Tasks
      const tasks = [
        ['API Integration', 'Alex Johnson', 'High', '2026-09-05', 'In Progress', 'Aurora Cloud Platform'],
        ['UI Redesign', 'Sneha Patel', 'Medium', '2026-09-10', 'To Do', 'Atlas Analytics'],
        ['Database Migration', 'Arun Kumar', 'High', '2026-09-01', 'Review', 'Mercury Mobile'],
        ['Client Dashboard', 'Rahul Sharma', 'Medium', '2026-08-25', 'Completed', 'Nova CRM'],
        ['Performance Optimization', 'Alex Johnson', 'High', '2026-09-12', 'In Progress', 'Aurora Cloud Platform'],
        ['Testing & QA', 'Priya Nair', 'Low', '2026-09-15', 'To Do', 'Atlas Analytics']
      ];
      tasks.forEach(t => {
        db.run("INSERT INTO tasks (title, assigned_employee, priority, due_date, status, project_name) VALUES (?, ?, ?, ?, ?, ?)", t);
      });

      // Seed Employees
      const employees = [
        ['Arun Kumar', 'Engineering', 'Lead Architect', 'arun@nexacore.local', 'Active', '+1 (555) 234-5678'],
        ['Rahul Sharma', 'Engineering', 'Senior Developer', 'rahul@nexacore.local', 'Active', '+1 (555) 345-6789'],
        ['Priya Nair', 'Design', 'UI/UX Lead', 'priya@nexacore.local', 'Active', '+1 (555) 456-7890'],
        ['Ananya Menon', 'HR', 'Talent Manager', 'ananya@nexacore.local', 'Active', '+1 (555) 567-8901'],
        ['Vikram Raj', 'Management', 'Project Director', 'vikram@nexacore.local', 'Active', '+1 (555) 678-9012'],
        ['Sneha Patel', 'Marketing', 'Product Marketer', 'sneha@nexacore.local', 'Active', '+1 (555) 789-0123'],
        ['Alex Johnson', 'Engineering', 'Senior Software Engineer', 'alex@nexacore.local', 'Active', '+1 (555) 890-1234']
      ];
      employees.forEach(e => {
        db.run("INSERT INTO employees (name, department, position, email, status, phone) VALUES (?, ?, ?, ?, ?, ?)", e);
      });

      // Seed Customers
      const customers = [
        ['Vertex Systems', 'Enterprise Tech', 'Aurora Cloud Platform', 'Vikram Raj', 'Active'],
        ['BlueWave Technologies', 'Telecom', 'Atlas Analytics', 'Priya Nair', 'Onboarding'],
        ['Apex Retail', 'E-Commerce', 'Nova CRM', 'Sneha Patel', 'Completed'],
        ['CloudSphere', 'Cloud Hosting', 'Mercury Mobile', 'Rahul Sharma', 'Active'],
        ['NextGen Solutions', 'Financial Services', 'Orion AI Platform', 'Arun Kumar', 'Active']
      ];
      customers.forEach(c => {
        db.run("INSERT INTO customers (name, industry, project, account_manager, status) VALUES (?, ?, ?, ?, ?)", c);
      });

      // Seed Documents
      const documents = [
        ['Aurora Requirements.pdf', 'Technical Documents', 'Alex Johnson', '2026-08-20', '4.2 MB'],
        ['API Documentation.pdf', 'Technical Documents', 'Rahul Sharma', '2026-08-18', '2.8 MB'],
        ['Project Proposal.pdf', 'Project Documents', 'Vikram Raj', '2026-08-15', '1.5 MB'],
        ['Q4 Business Report.pdf', 'Reports', 'Ananya Menon', '2026-08-10', '5.1 MB'],
        ['Client Agreement.pdf', 'Client Documents', 'Sneha Patel', '2026-08-05', '850 KB']
      ];
      documents.forEach(d => {
        db.run("INSERT INTO documents (name, category, owner, last_modified, size) VALUES (?, ?, ?, ?, ?)", d);
      });

      // Seed Repositories
      const repos = [
        ['aurora-platform', 'main', 'feat: Optimize serverless routing engine', 'Build #1842', 'Passed', 'Deployed to Production', 'Production'],
        ['atlas-dashboard', 'develop', 'fix: Resolve aggregation pipeline latency', 'Build #1841', 'Passed', 'Staging Ready', 'Staging'],
        ['nova-mobile', 'feature/v2', 'refactor: Migrate token refresh to async await', 'Build #1840', 'Failed', 'Build Error', 'Development'],
        ['internal-tools', 'main', 'chore: Update dependency security patches', 'Build #1839', 'Passed', 'Deployed to Internal', 'Internal']
      ];
      repos.forEach(r => {
        db.run("INSERT INTO repositories (name, branch, last_commit, build_number, build_status, deployment_status, environment) VALUES (?, ?, ?, ?, ?, ?, ?)", r);
      });

      // Seed Activities
      const activities = [
        ['Alex updated Project Aurora', 'Alex Johnson', '2026-08-29', '11:15 AM'],
        ['Priya uploaded a project document', 'Priya Nair', '2026-08-29', '10:42 AM'],
        ['Rahul completed API integration task', 'Rahul Sharma', '2026-08-29', '09:30 AM'],
        ['Ananya created a new task UI Redesign', 'Ananya Menon', '2026-08-28', '04:15 PM'],
        ['Vikram updated customer information for Vertex Systems', 'Vikram Raj', '2026-08-28', '02:00 PM']
      ];
      activities.forEach(a => {
        db.run("INSERT INTO activities (activity, user, date, time) VALUES (?, ?, ?, ?)", a);
      });

      console.log("✅ NexaCore database seeding complete!");
    }
  });
});

module.exports = db;
