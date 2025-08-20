# Thryve Final Project
## Project Description

Thryve is a web application that connects skilled individuals like freelancers, artisans, and plumbers with clients who need their services. It has AI-enhanced discovery, smart recommendations, and project-based showcases, TalentConnect becomes more than a portfolio or job board – it’s a dynamic ecosystem. It bridges the gap between skilled artisans and potential employers and investors where talented individuals struggle to showcase their work in meaningful ways, and investors/employers face difficulty in identifying, validating, and collaborating with emerging talents.

**Live Project:** [https://thryve-final-project.vercel.app/](https://thryve-final-project.vercel.app/)

---

## Goals & Objectives

### Project Goals

1. ***Bridging the gap between skills and demand***
   
    Provide a centralized, user-friendly platform that links skilled professionals with potential clients looking for services.

2. ***Empower skilled individuals***

    Offer opportunities for freelancers, artisans, and service providers to showcase their skills, build credibility, and earn income.

3. ***Simplify service discovery for clients***
   
   Make it easy for clients to find, assess, and hire the right professional for their needs through search, reviews, and profiles.

4. ***Promote trust and transparency***
   
    Ensure safe, trustworthy interactions through verified profiles, transparent reviews, and secure communication.

5. ***Support economic inclusion and digital visibility***
   
     Enable local skilled workers, especially in underserved communities, to reach more customers online.

---

## *Project Objectives*

### Platform Functionality

* Develop an intuitive, mobile-friendly web platform accessible to both clients and skilled individuals.
* Implement secure registration, login, and profile management for users.
* Allow skilled users to create detailed service listings categorized by expertise.
* Enable clients to post service requests and contact providers.
* Add a rating/review system for post-service feedback.
* Include messaging or job request tools for real-time communication.

### Security and Trust

* Use verification methods to authenticate service providers.
* Implement JWT-based user authentication and authorization.
* Enable reporting of fraudulent or inappropriate behavior.

### Administrative Control

* Create an admin panel for managing users, services, categories, and reports.
* Include basic analytics to monitor platform usage and performance.

### Scalability and Integration

* Design the system for scalability to support future integrations like:
  * In-app payments
  * Real-time chat (e.g., via Socket.io)
  * Mobile app extension

---

## Tech Stack

### Frontend
- Next.js
- Tailwind CSS
- Shadcn UI
- Radix UI
- Redux

### Backend
- Node.js
- MongoDB
- Express.js

## Installation & Setup
## Installation & Setup

### Prerequisites
Before starting, make sure you have installed:
- **Node.js** (v18+ recommended)
- **npm** or **yarn** (latest version)
- **MongoDB** (local or cloud, e.g., MongoDB Atlas)
- **Git**

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/geeksforcode/thryve.git
cd thryve
```

### 2️⃣ Install Dependencies
for the Frontend:

```bash
cd client
npm install
# or
yarn install
```

for the Backend:
```bash
cd server
npm install
# or
yarn install
```
### 3️⃣ Environment Variables

Create a .env file in both frontend and backend folders and configure the following:

Backend .env:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/thryve
JWT_SECRET=your_jwt_secret
```

Frontend .env.local:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4️⃣ Run the Application

Start Backend:
```bash
cd server
npm run dev
```

Start Frontend:
```bash
cd client
npm run dev
```

## 5️⃣ Access the Application

```bash
Frontend: http://localhost:3000

Backend API: http://localhost:5000/api
```

## Architecture

## Features

* **Smart Talent Matchmaking**: NLP-powered matching system based on portfolio content, skills, and job description.
* **Portfolio Insights**: Auto-summarization of work/projects using GPT.
* **Chatbot for Employers**: Ask AI to find a suitable talent.
* **Skill Assessment**: AI-based coding/art assessments.
* **Talent Pitch Generation**: Auto-generate a talent’s elevator pitch.
* **Investor Report Generator**: Summarizes potential talents’ profile and recent activity.

## Deployment

We use **Vercel** for frontend hosting and **Render/Heroku** for backend deployment.

### 🚀 Frontend Deployment (Vercel)
1. Push your frontend code to **GitHub**.
2. Go to [Vercel](https://vercel.com/) and **import your repository**.
3. Add the required **environment variables** under the **Settings** tab.
4. Click **Deploy** to launch your frontend.

---

### ⚙️ Backend Deployment (Render or Heroku)

#### Using Render:
1. Push your backend code to **GitHub**.
2. Create a new **Web Service** on [Render](https://render.com/).
3. **Connect your repository**.
4. Add environment variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000


Here’s your Contributing Guidelines section properly formatted for a README:

## 🤝 Contributing Guidelines

We welcome contributions to make **Thryve** better!  
Follow these steps to get started:

### 1️⃣ Fork the Repository
Click **Fork** on the [GitHub repository](https://github.com/geeksforcode/thryve.git) page.

### 2️⃣ Clone Your Fork
```bash
git clone https://github.com/geeksforcode/thryve.git
```
3️⃣ Create a New Branch
```bash
git checkout -b feature/your-feature-name
```

4️⃣ Make Changes & Commit
```bash
git commit -m "Add your descriptive commit message"
```

5️⃣ Push to Your Fork
```bash
git push origin feature/your-feature-name
```

6️⃣ Open a Pull Request

Open a Pull Request to the main branch on GitHub.

📏 Code Style Guidelines

✅ Use clear and descriptive commit messages.

✅ Follow the project's existing code formatting and naming conventions.

✅ Write meaningful comments for complex code.
