# 🎟️ EventEase — AI-Powered College Event Management

**One platform. Every event. Simpler management.**

EventEase is a web-based college event management platform developed by **Team NOIR** for **Code Carnival 3.0 at Atmiya University**.

It helps students discover and register for college events while enabling organizers to manage events, issue digital tickets, track attendance using QR codes, and monitor participation through a dashboard.

Our goal is to make college event management more organized, convenient, and efficient for both students and organizers.

---

## 📌 1. The Problem

College events such as workshops, technical competitions, seminars, and cultural activities often involve several manual tasks.

- Students may find it difficult to discover events and manage registrations.
- Organizers need to manage participant details and registrations.
- Manual attendance checking can be slow and time-consuming.
- Tracking attendance and participation across events can be difficult.
- Students may need help finding information about events and registrations.

These challenges can lead to confusion, delays, and unnecessary administrative work.

## 💡 2. Our Solution

**EventEase brings event discovery, registration, digital tickets, and attendance tracking into one platform.**

Students can explore available events, register online, and use their digital registration pass. Organizers can manage events, verify attendance through QR codes, and view participation statistics. An integrated AI assistant provides an additional way for users to get help.

Instead of managing every task separately, EventEase provides a centralized workflow for college events.

## ✨ 3. Key Features

### 🔐 User Authentication
Provides a login and registration system so users can access the platform according to the supported user roles.

### 📅 Event Discovery
Allows students to explore available college events and view important information such as event descriptions, dates, venues, and capacity.

### 🎫 Online Event Registration
Allows students to register for events through the platform rather than relying entirely on manual registration.

### 📱 QR-Based Digital Tickets
Generates QR codes associated with registrations, making ticket identification and verification easier.

### 📷 QR-Based Attendance
Helps organizers record attendance by scanning participants' QR codes.

### 🛡️ Duplicate Check-In Prevention
Helps prevent the same registration from being counted multiple times during attendance check-in.

### 📊 Attendance Dashboard
Presents event and attendance information in a more organized format, helping organizers monitor participation.

### 🗓️ Event Management
Provides organizers with a centralized place to create and manage event information.

### 🤖 AI Assistant
Offers an AI-powered assistance feature to help users interact with the platform and obtain relevant information.

### 📱 Responsive User Interface
Provides a modern interface designed to work across different screen sizes and devices.

## 🔄 4. How EventEase Works

**For students**

1. **Sign up or log in** — Access the platform.
2. **Explore events** — Browse available college events.
3. **Register** — Select an event and complete registration.
4. **Get a digital pass** — Access the registration ticket and its QR code.
5. **Check in** — Present the QR code for attendance verification at the event.

**For organizers**

1. **Access the dashboard** — Manage event information.
2. **Create or update events** — Maintain event details.
3. **Verify participants** — Scan registration QR codes during check-in.
4. **Prevent duplicate attendance** — Validate registrations before recording check-ins.
5. **Monitor participation** — Review attendance information and event statistics.

## 🏗️ 5. System Architecture

EventEase follows a frontend-and-backend architecture.

| Component | Responsibility |
|---|---|
| Frontend | Displays pages, event information, registration flows, and dashboards. |
| Backend API | Processes requests, handles application logic, and connects the frontend to stored data. |
| Database | Stores application data such as users, events, and registrations, according to the implemented schema. |
| QR Code System | Supports digital registration passes and attendance verification. |
| AI Assistant | Provides the platform's AI-based assistance functionality. |

**Typical workflow:**

User → Frontend → Backend API → Database → Response to Frontend

QR verification and AI assistance add further functionality to this core workflow.

## 🛠️ 6. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, React Router, Tailwind CSS |
| UI and Icons | Lucide React |
| Backend | Python, FastAPI |
| Database Integration | SQLAlchemy |
| Authentication Support | JWT-related libraries and password-hashing libraries |
| QR Code Generation | Python QR Code library and `qrcode.react` |
| Development Tools | Visual Studio Code, Git, GitHub |

The AI integration and database engine depend on the project's actual configuration.

## 📂 7. Project Structure

The repository is organized into frontend and backend areas.

```text
code-carnival-2026/
│
├── app/                  # Backend application
├── frontend/             # Frontend application
├── .env.example          # Example environment configuration
├── .gitignore            # Files excluded from Git
├── package.json          # JavaScript dependencies
├── package-lock.json     # Locked JavaScript dependencies
├── requirements.txt      # Python dependencies
└── README.md             # Project documentation
```

## 🚀 8. Getting Started

### Prerequisites

Install the following tools before running the project:

- Python
- Node.js and npm
- Git
- Visual Studio Code (recommended)

### Step 1: Clone the repository

```bash
git clone https://github.com/kevin-varghees/code-carnival-2026.git
cd code-carnival-2026
```

### Step 2: Set up the Python environment

```bash
python -m venv .venv
```

Activate the environment on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

### Step 3: Configure environment variables

Review `.env.example` and create a local `.env` file with the required configuration.

Add the API keys and secrets required by your actual setup. **Never commit your real `.env` file or expose private API keys on GitHub.**

### Step 4: Install frontend dependencies

```bash
npm install
```

### Step 5: Run the application

Start the backend using the project's actual FastAPI entry point. For example, if the entry point is `app.main:app`, use:

```bash
uvicorn app.main:app --reload
```

Start the frontend using the development command configured in its `package.json`. If the frontend has its own `package.json`, run `npm install` and the appropriate development script from that directory.

> **Note:** Confirm the backend entry-point path, frontend directory, required environment variables, and available npm scripts in the repository before running these commands.

## 🧪 9. Testing the Main Workflow

The following checks can be used to evaluate the platform:

- Register a user and log in.
- Browse the available events.
- Register for an event.
- Check that the registration ticket and QR code are generated correctly.
- Scan a valid QR code and verify that attendance is recorded.
- Attempt to check in the same registration again and verify duplicate prevention.
- Review attendance statistics on the dashboard.
- Test the AI assistant using supported questions.
- Check that the interface works on desktop and mobile screen sizes.

## 🌟 10. What Makes EventEase Useful?

EventEase connects several important event-management tasks in one platform.

- **Centralized management:** Event information and registrations are organized in one place.
- **Faster check-in:** QR-based verification can reduce manual attendance work.
- **Better record keeping:** Digital registration and attendance records help organizers track participation.
- **Improved student experience:** Students can discover events and access their registration information online.
- **AI-assisted interaction:** The integrated assistant adds another way to obtain help.
- **Room for growth:** The platform can be extended to support more event-management workflows.

## 🔮 11. Future Scope

Potential improvements include:

- Email notifications and event reminders.
- Calendar integration for upcoming events.
- More detailed analytics and event reports.
- Improved accessibility and multilingual support.
- Additional AI-assisted event discovery and support.
- Deployment and performance improvements for larger numbers of users.

These are future possibilities, not claims that every feature is already implemented.

## 👥 12. Meet Team NOIR

| Team Member | Responsibility |
|---|---|
| Kevin Varghees | Integration, Deployment, Quality Assurance, Documentation and Presentation |
| Rohith | Frontend Development and UI/UX |
| Pooja | Backend Development and Database |
| Nithin | AI Assistant |

We collaborate to combine frontend development, backend functionality, AI integration, testing, and documentation into one project.

## 🏁 Conclusion

EventEase aims to make college event management simpler by connecting event discovery, registration, digital tickets, QR-based attendance, and participation tracking in one platform.

By reducing dependence on manual processes and providing a centralized digital experience, EventEase can help students participate in events more conveniently and help organizers manage them more efficiently.

**Built with teamwork by Team NOIR for Code Carnival 3.0 at Atmiya University.** 🖤
