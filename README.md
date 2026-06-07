# Project Management App

A collaborative project management application that allows users to create multiple workspaces, invite team members, manage projects, assign tasks, and work together in an organized way.

The app is designed for teams, students, startups, and organizations that need a simple platform to manage tasks and collaborate efficiently.

---

## Project Overview

The Project Management App helps users organize their work inside different workspaces. Each workspace can have multiple members, projects, and tasks. Users can invite other members to collaborate and manage work together.

The application includes authentication, workspace management, invitation system, task tracking, and secure user access.

---

## Main Features

### 1. User Authentication

Users can securely sign up, log in, and manage their account using Clerk authentication.

Features include:

* User registration
* User login
* Secure authentication
* Session management
* Protected routes
* User profile management

---

### 2. Multiple Workspaces

Users can create and manage multiple workspaces.

Each workspace can represent:

* A company
* A college project
* A team
* A department
* A personal project group

Workspace features:

* Create workspace
* View workspace details
* Switch between workspaces
* Manage workspace members
* Organize projects separately

---

### 3. Team Collaboration

The app allows users to work together in the same workspace.

Collaboration features:

* Add team members
* Assign tasks
* Track task progress
* View project updates
* Manage shared workspace data

---

### 4. Invitation System

Workspace owners or admins can invite other users to join a workspace.

Invitation features:

* Invite users by email
* Accept workspace invitations
* Join workspace through invite link
* Manage invited members
* Secure access to workspace after accepting invitation

---

### 5. Project Management

Users can create projects inside a workspace.

Project features:

* Create new projects
* View all projects in a workspace
* Manage project details
* Organize tasks under projects
* Track project progress

---

### 6. Task Management

Users can create and manage tasks for each project.

Task features:

* Create tasks
* Assign tasks to members
* Set task priority
* Set task deadline
* Update task status
* Track completed and pending tasks

Task statuses can include:

```txt
TODO
IN_PROGRESS
DONE
```

---

### 7. Role-Based Access

The app can support different member roles.

Example roles:

```txt
OWNER
ADMIN
MEMBER
```

Role usage:

* Owner can manage the full workspace.
* Admin can manage projects and members.
* Member can view and work on assigned tasks.

---

## Technologies Used

### Frontend

* Next.js
* React.js
* Tailwind CSS

### Backend

* Next.js API Routes / Server Actions
* Prisma ORM

### Database

* PostgreSQL or any Prisma-supported database

### Authentication

* Clerk

### Deployment

* Vercel

### ORM

* Prisma

---

## Folder Structure

```txt
project-management-app/
│
├── app/
│   ├── dashboard/
│   ├── workspaces/
│   ├── projects/
│   ├── invitations/
│   ├── sign-in/
│   └── sign-up/
│
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── WorkspaceCard.jsx
│   ├── ProjectCard.jsx
│   ├── TaskCard.jsx
│   └── InviteMember.jsx
│
├── lib/
│   ├── prisma.js
│   └── auth.js
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── .env
├── package.json
└── README.md
```

---

## Database Models

The app can use the following main database models:

```txt
User
Workspace
WorkspaceMember
Project
Task
Invitation
```

---

## Basic Prisma Schema Idea

```prisma
model Workspace {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime @default(now())

  projects    Project[]
  members     WorkspaceMember[]
  invitations Invitation[]
}

model WorkspaceMember {
  id          String   @id @default(cuid())
  userId      String
  workspaceId String
  role        String   @default("MEMBER")

  workspace   Workspace @relation(fields: [workspaceId], references: [id])
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  workspaceId String
  createdAt   DateTime @default(now())

  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  tasks       Task[]
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      String   @default("TODO")
  priority    String?
  dueDate     DateTime?
  assignedTo  String?
  projectId   String
  createdAt   DateTime @default(now())

  project     Project @relation(fields: [projectId], references: [id])
}

model Invitation {
  id          String   @id @default(cuid())
  email       String
  token       String   @unique
  workspaceId String
  status      String   @default("PENDING")
  createdAt   DateTime @default(now())

  workspace   Workspace @relation(fields: [workspaceId], references: [id])
}
```

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/project-management-app.git
```

### 2. Go to Project Folder

```bash
cd project-management-app
```

### 3. Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root folder.

```env
DATABASE_URL="your_database_url"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

---

## Prisma Setup

### 1. Generate Prisma Client

```bash
npx prisma generate
```

### 2. Push Schema to Database

```bash
npx prisma db push
```

### 3. Open Prisma Studio

```bash
npx prisma studio
```

Prisma Studio helps to view and manage database records visually.

---

## Running the Project Locally

Start the development server:

```bash
npm run dev
```

The app will run at:

```txt
http://localhost:3000
```

---

## Deployment on Vercel

The app can be deployed easily using Vercel.

### Steps:

1. Push the project to GitHub.
2. Open Vercel.
3. Import the GitHub repository.
4. Add environment variables in Vercel settings.
5. Deploy the project.

Important environment variables to add in Vercel:

```env
DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
```

---

## How the App Works

1. User signs up or logs in using Clerk.
2. User creates a workspace.
3. User creates projects inside the workspace.
4. User adds tasks inside projects.
5. Workspace owner invites team members.
6. Invited users accept the invitation.
7. Members collaborate inside the workspace.
8. Tasks are assigned and updated.
9. Project progress can be tracked from the dashboard.

---

## Example Use Case

A student team can create a workspace named:

```txt
Final Year Project
```

Inside that workspace, they can create projects like:

```txt
Frontend Development
Backend Development
Documentation
Testing
```

Tasks can be assigned to team members, such as:

```txt
Design login page
Create database schema
Build invitation system
Prepare project report
Test dashboard
```

This helps the team divide work and track progress clearly.

---

## Key Pages

### Dashboard Page

Shows all workspaces and quick project information.

### Workspace Page

Shows workspace details, members, projects, and invitations.

### Project Page

Shows project tasks and progress.

### Task Page

Shows task details, status, priority, deadline, and assigned member.

### Invitation Page

Allows users to accept workspace invitations.

---

## Future Enhancements

* Kanban board view
* Drag and drop task management
* Comments on tasks
* File upload support
* Email notifications
* Activity logs
* Calendar view
* Task deadline reminders
* Workspace analytics
* Team chat system
* Dark mode
* Mobile responsive app

---

## Project Title

Project Management App - Collaborative Workspace and Task Management System

---

## Conclusion

The Project Management App provides a simple and powerful way for users to collaborate across multiple workspaces. With workspace creation, invitations, task assignment, project tracking, Clerk authentication, Prisma database management, and Vercel deployment, the system is suitable for modern team-based project management.
