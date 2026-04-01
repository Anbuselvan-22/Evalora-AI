# Design Document: Evalora AI Frontend

## Overview

Evalora AI is a React 18 single-page application that serves two user roles — Teacher and Student — with an AI-powered evaluation and learning platform. The frontend communicates with a Node.js/Express backend via REST APIs and presents a modern dark-themed SaaS UI featuring glassmorphism cards, Framer Motion animations, and Recharts data visualizations.

The application is built with Vite as the build tool, React Router v6 for client-side navigation, Axios for HTTP communication, and Tailwind CSS for styling. Authentication state is managed via React Context backed by localStorage persistence.

### Key Design Goals

- Role-based access control enforced at the routing layer
- Centralized API communication with automatic token injection and 401 handling
- Consistent UI component library shared across all pages
- Smooth page transitions and entrance animations via Framer Motion
- Data visualizations for student performance analytics

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│  ┌──────────────┐    ┌──────────────────────────────────┐   │
│  │  AuthContext │    │         React Router v6           │  │
│  │  (user/token │◄───│  AppRoutes → ProtectedRoute       │  │
│  │   /role)     │    │  → Layout → Page Components       │  │
│  └──────┬───────┘    └──────────────────────────────────┘  │
│         │                         │                         │
│         │            ┌────────────▼──────────────────────┐  │
│         │            │         Service Layer              │  │
│         │            │  authService / teacherService /    │  │
│         │            │  studentService / evaluationService│  │
│         │            │  / studyAgentService               │  │
│         │            └────────────┬──────────────────────┘  │
│         │                         │                         │
│         │            ┌────────────▼──────────────────────┐  │
│         └───────────►│         apiClient.js               │  │
│                      │  Axios instance + interceptors     │  │
│                      └────────────┬──────────────────────┘  │
└───────────────────────────────────┼─────────────────────────┘
                                    │ HTTP/REST
                        ┌───────────▼───────────┐
                        │  Node.js/Express API   │
                        └───────────────────────┘
```

### Request/Response Flow

1. User action triggers a service function call
2. Service function calls `apiClient` (Axios instance)
3. Request interceptor attaches `Authorization: Bearer <token>` from localStorage
4. Response interceptor catches 401 → clears localStorage → redirects to `/login`
5. Successful response data flows back to the page component's state

### Authentication Flow

```
LoginPage → authService.login() → POST /api/login
    → success: AuthContext.login(token, role) → localStorage.setItem
              → Router.navigate(/teacher/dashboard or /student/dashboard)
    → failure: display error message
```

---

## Components and Interfaces

### Project Structure

```
Evalora-AI/client/src/
├── pages/
│   ├── auth/
│   │   └── LoginPage.jsx
│   ├── teacher/
│   │   ├── TeacherDashboard.jsx
│   │   ├── UploadEvaluationPage.jsx
│   │   ├── TeacherResultsPage.jsx
│   │   └── TeacherResultDetailPage.jsx
│   ├── student/
│   │   ├── StudentDashboard.jsx
│   │   ├── StudentResultsPage.jsx
│   │   ├── StudentResultDetailPage.jsx
│   │   ├── PerformanceAnalyticsPage.jsx
│   │   └── AIStudyAgentPage.jsx
│   └── agents/
│       ├── TrainerAgentPage.jsx
│       ├── ParentAgentPage.jsx
│       └── MemoryAgentPage.jsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   └── Navbar.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Loader.jsx
│   │   ├── Badge.jsx
│   │   ├── StatCard.jsx
│   │   └── ChartCard.jsx
│   ├── evaluation/
│   │   └── QuestionCard.jsx
│   ├── chat/
│   │   ├── ChatBox.jsx
│   │   └── MessageBubble.jsx
│   └── upload/
│       └── UploadBox.jsx
├── services/
│   ├── apiClient.js
│   ├── authService.js
│   ├── teacherService.js
│   ├── studentService.js
│   ├── evaluationService.js
│   └── studyAgentService.js
├── context/
│   └── AuthContext.jsx
├── routes/
│   └── AppRoutes.jsx
└── utils/
    └── helpers.js
```

### Component Interfaces

#### Layout Components

**Sidebar**
```jsx
// Props: none (reads role from AuthContext)
// Renders role-filtered navigation links
// Teacher links: Dashboard, Upload Evaluation, Results, Trainer Agent, Parent Agent, Memory Agent
// Student links: Dashboard, Results, Analytics, Study Agent, Trainer Agent, Parent Agent, Memory Agent
```

**Navbar**
```jsx
// Props: none (reads user from AuthContext)
// Renders app title and logout button
```

#### UI Components

**StatCard**
```jsx
// Props: { label: string, value: string | number, icon?: ReactNode }
// Renders a glassmorphism card with a metric label and value
```

**ChartCard**
```jsx
// Props: { title: string, children: ReactNode }
// Renders a glassmorphism card with title above children (chart)
```

**QuestionCard**
```jsx
// Props: {
//   questionNumber: number,
//   marks: number,
//   correctPoints: string[],
//   missingPoints: string[],
//   mistakes: string[],
//   suggestions: string[]
// }
// Renders per-question evaluation details in a styled card
```

**UploadBox**
```jsx
// Props: { label: string, onFileSelect: (file: File) => void, accept?: string }
// Handles click-to-browse and drag-and-drop file selection
// Invokes onFileSelect with the selected File object
```

**Badge**
```jsx
// Props: { level: 'gold' | 'silver' | 'bronze' }
// Renders achievement badge with corresponding color/style
// Gold: avgScore >= 80, Silver: 60 <= avgScore < 80, Bronze: avgScore < 60
```

**MessageBubble**
```jsx
// Props: { role: 'user' | 'agent', content: string }
// User messages: right-aligned, accent color
// Agent messages: left-aligned, muted color
```

**Loader**
```jsx
// Props: none
// Full-page centered animated spinner (Framer Motion or CSS)
```

#### Service Interfaces

**apiClient.js**
```js
// Axios instance configured with:
// - baseURL: import.meta.env.VITE_API_URL
// - Request interceptor: attaches Authorization: Bearer <token> from localStorage
// - Response interceptor: on 401, clears localStorage and redirects to /login
```

**authService.js**
```js
// login(email, password, role) → POST /api/login → { token, role }
// logout() → clears localStorage
```

**teacherService.js**
```js
// getDashboard() → GET /api/teacher/dashboard
// getResults() → GET /api/teacher/results
// getResultById(id) → GET /api/teacher/results/:id
```

**studentService.js**
```js
// getDashboard() → GET /api/student/dashboard
// getResults() → GET /api/student/results
// getResultById(id) → GET /api/student/results/:id
// getAnalytics() → GET /api/student/analytics
```

**evaluationService.js**
```js
// submitEvaluation(formData: FormData) → POST /api/evaluate (multipart/form-data)
```

**studyAgentService.js**
```js
// sendMessage(message: string) → POST /api/study-agent → { reply: string }
```

### Routing Structure

```jsx
// AppRoutes.jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<ProtectedRoute />}>
    <Route element={<Layout />}>
      {/* Teacher routes */}
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher/upload" element={<UploadEvaluationPage />} />
      <Route path="/teacher/results" element={<TeacherResultsPage />} />
      <Route path="/teacher/results/:id" element={<TeacherResultDetailPage />} />
      {/* Student routes */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/results" element={<StudentResultsPage />} />
      <Route path="/student/results/:id" element={<StudentResultDetailPage />} />
      <Route path="/student/analytics" element={<PerformanceAnalyticsPage />} />
      <Route path="/student/study-agent" element={<AIStudyAgentPage />} />
      {/* Shared agent routes */}
      <Route path="/agents/trainer" element={<TrainerAgentPage />} />
      <Route path="/agents/parent" element={<ParentAgentPage />} />
      <Route path="/agents/memory" element={<MemoryAgentPage />} />
    </Route>
  </Route>
</Routes>
```

**ProtectedRoute** checks for a token in localStorage; if absent, redirects to `/login` via `<Navigate>`.

### Page Component Pattern

All data-fetching pages follow this consistent pattern:

```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  serviceFunction()
    .then(setData)
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
}, []);

if (loading) return <Loader />;
if (error) return <ErrorMessage message={error} />;
return <PageContent data={data} />;
```

### Framer Motion Integration

Page transitions use `AnimatePresence` wrapping the route outlet:

```jsx
// Each page wraps its root element with motion.div
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {/* page content */}
</motion.div>
```

TrainerAgentPage technique sections use staggered entrance animations:

```jsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.1 }}
>
```

---

## Data Models

### Authentication

```ts
// Stored in localStorage
interface AuthState {
  token: string;       // JWT or session token
  role: 'teacher' | 'student';
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// AuthContext value shape
interface AuthContextValue {
  user: AuthState['user'] | null;
  token: string | null;
  role: 'teacher' | 'student' | null;
  login: (token: string, role: string, user: object) => void;
  logout: () => void;
}
```

### API Response Models

```ts
// POST /api/login response
interface LoginResponse {
  token: string;
  role: 'teacher' | 'student';
  user: { id: string; name: string; email: string };
}

// GET /api/teacher/dashboard response
interface TeacherDashboard {
  totalStudents: number;
  evaluationsDone: number;
  averageMarks: number;
  recentEvaluations: EvaluationSummary[];
}

interface EvaluationSummary {
  id: string;
  studentName: string;
  subject: string;
  marks: number;
  date: string; // ISO 8601
}

// GET /api/teacher/results and /api/student/results response
interface ResultSummary {
  id: string;
  studentName: string;
  subject: string;
  marks: number;
  date: string;
}

// GET /api/teacher/results/:id and /api/student/results/:id response
interface ResultDetail {
  id: string;
  studentName: string;
  subject: string;
  totalMarks: number;
  questions: QuestionResult[];
}

interface QuestionResult {
  questionNumber: number;
  marks: number;
  correctPoints: string[];
  missingPoints: string[];
  mistakes: string[];
  suggestions: string[];
}

// GET /api/student/dashboard response
interface StudentDashboard {
  totalMarks: number;
  averageScore: number;
  scoreProgression: { date: string; score: number }[];
  subjectDistribution: { subject: string; score: number }[];
}

// GET /api/student/analytics response
interface StudentAnalytics {
  weakAreas: string[];
  strongAreas: string[];
  performanceTrend: { date: string; score: number }[];
}

// POST /api/study-agent request/response
interface StudyAgentRequest {
  message: string;
}
interface StudyAgentResponse {
  reply: string;
}

// GET /api/agents/parent response
interface ParentAgentData {
  studentName: string;
  averageScore: number;
  subjectScores: { subject: string; score: number }[];
  overallProgress: string;
}

// GET /api/agents/memory response
interface MemoryAgentData {
  history: { date: string; score: number; subject: string }[];
  comparisonData: { period: string; score: number }[];
}
```

### Component State Models

```ts
// AIStudyAgentPage message state
interface ChatMessage {
  id: string;          // unique identifier (e.g., Date.now())
  role: 'user' | 'agent';
  content: string;
}

// UploadEvaluationPage file state
interface UploadState {
  questionPaper: File | null;
  rubrics: File | null;
  answerSheet: File | null;
}
```

### Badge Derivation Logic

```ts
// helpers.js
function getBadgeLevel(avgScore: number): 'gold' | 'silver' | 'bronze' {
  if (avgScore >= 80) return 'gold';
  if (avgScore >= 60) return 'silver';
  return 'bronze';
}
```

### Quick Action Prompts

```ts
// Predefined prompts for AIStudyAgentPage quick actions
const QUICK_ACTION_PROMPTS = {
  'Explain Topic': 'Please explain the topic I am currently studying in detail.',
  'Generate Quiz': 'Generate a quiz with 5 questions based on my recent study material.',
  'Create Study Plan': 'Create a personalized study plan for me based on my performance.',
} as const;
```

---

