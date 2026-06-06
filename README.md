# 🌸 Minato Japanese Learning (Demo)

A small demo web application built as a final project for the **IE103 - Information Management** course. This platform is designed to help users learn and review Japanese (Vocabulary, Kanji) from N5 to N1 levels.

> **Note:** As this is a small academic project focusing mainly on database management and backend logic, the web application still has several limitations, particularly regarding the User Interface (UI/UX).

## Features

- **Students:** Register for an account, set learning goals, practice with review exercises, and track learning progress.
- **Admin/Editor:** Manage users, view system statistics (e.g., new registrations, students per JLPT level), and manage content (add/update/delete exercises and vocabulary).
- **AI Assistant:** Integrated Gemini API to provide an intelligent chat feature, helping users answer quick questions during their learning process.

## Tech Stack

- **Frontend:** React
- **Backend:** Python (FastAPI / Uvicorn)
- **Database:** PostgreSQL (Hosted on Neon Cloud)

## Local Setup

### 1. Prerequisites

- Python 3.x installed
- Node.js installed

### 2. Backend Setup

Open your terminal and run the following commands:

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment (recommended)
python -m venv venv
source venv/Scripts/activate  # (For Windows)

# Install dependencies
pip install -r requirements.txt

# Database Configuration
# -> Create a .env file and add your DATABASE_URL.

# Run the server
uvicorn main:app --reload
```

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the application
npm run dev
```
