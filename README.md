# Apex Sentinel: Automated Contest Monitoring

Apex Sentinel is a comprehensive, full-stack application designed for competitive programmers and coding enthusiasts. It acts as an automated, centralized tracking hub for upcoming coding contests across multiple platforms such as Codeforces, LeetCode, CodeChef, and AtCoder.

## 🚀 Features

- **Automated Aggregation:** Continuously syncs contest data directly from platform APIs (e.g., Codeforces API, LeetCode GraphQL).
- **Interactive AI Assistant:** Built-in simulated Chatbot endpoint allows users to query upcoming schedules and platform rules.
- **Dynamic Frontend Dashboard:** A responsive, modern UI built with React and Vite featuring fluid micro-animations, glassmorphism aesthetics, and real-time filtering.
- **Robust Backend:** Powered by FastAPI and Python, managing scheduled tasks, storing structured data via SQLAlchemy in SQLite, and providing cross-origin accessibility.
- **Bookmarking System:** Save and track your favorite contests to never miss an important round.

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Custom CSS with modern CSS Variables (Light Theme, Glassmorphism)
- **Icons & Animations:** `lucide-react` for scalable vector icons and `framer-motion` for complex component animations.

### Backend
- **Framework:** FastAPI
- **Database:** SQLite with SQLAlchemy ORM
- **Web Scraping / API:** `requests`, `beautifulsoup4`, interacting with REST and GraphQL APIs.

## 📂 Project Structure

```
├── backend/
│   ├── main.py        # FastAPI application, CORS setup, and REST endpoints
│   ├── scraper.py     # Aggregation logic and API integrations (Codeforces, LeetCode)
│   ├── schemas.py     # Pydantic models and SQLAlchemy DB schema
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── src/           # React application source code
│   │   ├── App.jsx    # Main Dashboard, Filtering, API fetching, Bookmarking
│   │   ├── Chatbot.jsx# Interactive AI Assistant UI
│   │   └── index.css  # Application-wide styling and tokens
│   ├── index.html     # Vite entry point
│   └── package.json   # Node dependencies and scripts
└── .gitignore         # Excludes environments, node_modules, and private data
```

## ⚙️ Installation & Setup

To run Apex Sentinel locally, you need to spin up both the backend server and the frontend client.

### 1. Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. (Optional but recommended) Create and activate a virtual environment.
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Uvicorn server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will be available at `http://localhost:8000`*

### 2. Frontend Setup (React/Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the node modules:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically be available at `http://localhost:5173`*

## 🔌 API Endpoints

- `GET /contests`: Fetches the aggregated list of upcoming contests.
- `POST /contests/sync`: Triggers the scraper to fetch fresh data from platform APIs.
- `POST /bookmarks/{id}`: Toggles the bookmark status for a specific contest.
- `POST /chat`: Interacts with the AI Assistant endpoint.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is licensed under the MIT License.
