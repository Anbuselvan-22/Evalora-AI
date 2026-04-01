# Implementation Plan: Evalora AI Frontend

## Overview

Incremental implementation of the Evalora AI React + Node.js/Express full-stack application. Tasks follow the priority order: scaffolding → API layer → auth/routing → UI components → layout → pages → backend → environment → polish → deployment.

## Tasks

- [x] 1. Project scaffolding
  - Initialise Vite + React project under `Evalora-AI/client/` with TypeScript template
  - Install dependencies: `react-router-dom`, `axios`, `framer-motion`, `recharts`, `tailwindcss`, `postcss`, `autoprefixer`
  - Configure `tailwind.config.js` with dark mode and custom glassmorphism utility classes
  - Create `Evalora-AI/server/` directory with `package.json` and install: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `multer`, `cors`, `dotenv`, `tesseract.js`
  - Create base directory structure matching the design's project tree
  - _Requirements: 22.1_

- [x] 2. API client and service modules
  - [x] 2.1 Implement `apiClient.js`
    - Create Axios instance with `baseURL: import.meta.env.VITE_API_URL`
    - Add request interceptor to attach `Authorization: Bearer <token>` from localStorage
    - Add response interceptor: on 401, clear localStorage and redirect to `/login`
    - _Requirements: 15.1, 15.2, 15.7_

  - [ ]* 2.2 Write property test for apiClient token injection
    - **Property 1: Token injection consistency** — for any non-null token in localStorage, every outgoing request header must contain `Authorization: Bearer <token>`
    - **Validates: Requirements 15.2**

  - [x] 2.3 Implement `authService.js`
    - `login(email, password, role)` → POST `/api/login` → returns `{ token, role, user }`
    - `logout()` → clears localStorage keys `token`, `role`, `user`
    - _Requirements: 15.3_

  - [x] 2.4 Implement `evaluationService.js`
    - `submitEvaluation(formData: FormData)` → POST `/api/evaluate` with multipart/form-data
    - `getResults()` → GET `/api/teacher/results`
    - `getResultById(id)` → GET `/api/teacher/results/:id`
    - _Requirements: 15.4_

  - [x] 2.5 Implement `studentService.js`
    - `getDashboard()` → GET `/api/student/dashboard`
    - `getResults()` → GET `/api/student/results`
    - `getResultById(id)` → GET `/api/student/results/:id`
    - `getAnalytics()` → GET `/api/student/analytics`
    - _Requirements: 15.5_

  - [x] 2.6 Implement `studyAgentService.js`
    - `sendMessage(message: string)` → POST `/api/study-agent` → returns `{ reply: string }`
    - _Requirements: 15.6_

  - [x] 2.7 Implement `teacherService.js`
    - `getDashboard()` → GET `/api/teacher/dashboard`
    - `getResults()` → GET `/api/teacher/results`
    - `getResultById(id)` → GET `/api/teacher/results/:id`
    - _Requirements: 15.4_

- [x] 3. Auth context, routing, and protected routes
  - [x] 3.1 Implement `AuthContext.jsx`
    - Expose `{ user, token, role, login, logout }` via React Context
    - `login(token, role, user)` persists to localStorage and updates state
    - `logout()` clears localStorage and resets state
    - Initialise state from localStorage on mount
    - _Requirements: 24.1, 24.2, 24.3, 1.3_

  - [ ]* 3.2 Write property test for AuthContext state transitions
    - **Property 2: Login/logout symmetry** — after `login(t, r, u)` followed by `logout()`, all context values must be null/undefined and localStorage must be empty
    - **Validates: Requirements 24.2, 24.3**

  - [x] 3.3 Implement `AppRoutes.jsx` with `ProtectedRoute`
    - Define all 13 routes from requirements 2.1
    - `ProtectedRoute` reads token from AuthContext; redirects to `/login` if absent
    - Wrap route outlet in `AnimatePresence` for page transitions
    - _Requirements: 2.1, 1.7, 16.8_

  - [x] 3.4 Wire `AuthContext` provider and `AppRoutes` into `main.jsx` / `App.jsx`
    - _Requirements: 2.1, 24.1_

- [x] 4. Reusable UI component library
  - [x] 4.1 Implement `Loader.jsx`
    - Animated spinner using Framer Motion or CSS animation, full-page centered
    - _Requirements: 16.1_

  - [x] 4.2 Implement `StatCard.jsx`
    - Props: `{ label: string, value: string | number, icon?: ReactNode }`
    - Glassmorphism card styling via Tailwind
    - _Requirements: 16.2_

  - [x] 4.3 Implement `ChartCard.jsx`
    - Props: `{ title: string, children: ReactNode }`
    - Glassmorphism card with title above children
    - _Requirements: 16.3_

  - [x] 4.4 Implement `QuestionCard.jsx`
    - Props: `{ questionNumber, marks, correctPoints, missingPoints, mistakes, suggestions }`
    - Renders all evaluation fields in a styled card
    - _Requirements: 16.4, 6.3, 9.3_

  - [x] 4.5 Implement `UploadBox.jsx`
    - Props: `{ label: string, onFileSelect: (file: File) => void, accept?: string }`
    - Support click-to-browse and drag-and-drop; invoke `onFileSelect` with selected File
    - _Requirements: 16.5, 4.2_

  - [x] 4.6 Implement `Badge.jsx` and `getBadgeLevel` helper
    - Props: `{ level: 'gold' | 'silver' | 'bronze' }`
    - Implement `getBadgeLevel(avgScore)` in `utils/helpers.js`
    - Gold ≥ 80, Silver 60–79, Bronze < 60
    - _Requirements: 16.6, 13.4_

  - [ ]* 4.7 Write property test for `getBadgeLevel`
    - **Property 3: Badge level exhaustiveness** — for any numeric avgScore in [0, 100], `getBadgeLevel` must return exactly one of `'gold'`, `'silver'`, or `'bronze'`
    - **Property 4: Badge level monotonicity** — if `a >= b` then `getBadgeLevel(a)` must be at least as high a tier as `getBadgeLevel(b)`
    - **Validates: Requirements 13.4, 16.6**

  - [x] 4.8 Implement `MessageBubble.jsx`
    - Props: `{ role: 'user' | 'agent', content: string }`
    - User: right-aligned accent color; Agent: left-aligned muted color
    - _Requirements: 16.7_

  - [x] 4.9 Implement `ChatBox.jsx`
    - Renders list of `MessageBubble` components from a `messages` prop
    - Shows loading indicator when `isLoading` prop is true
    - Shows welcome empty state when messages array is empty
    - _Requirements: 11.1, 11.2, 11.4, 23.3_

- [x] 5. Layout components
  - [x] 5.1 Implement `Sidebar.jsx`
    - Reads role from `AuthContext`
    - Teacher links: Dashboard, Upload Evaluation, Results, Trainer Agent, Parent Agent, Memory Agent
    - Student links: Dashboard, Results, Analytics, Study Agent, Trainer Agent, Parent Agent, Memory Agent
    - _Requirements: 2.3, 2.4, 2.5_

  - [x] 5.2 Implement `Navbar.jsx`
    - Reads user from `AuthContext`; renders app title and logout button
    - Logout button calls `AuthContext.logout()` and navigates to `/login`
    - _Requirements: 2.2_

  - [x] 5.3 Create `Layout.jsx` wrapper
    - Renders `Sidebar` + `Navbar` + `<Outlet />` for all authenticated routes
    - Apply global dark SaaS theme and gradient background
    - _Requirements: 2.2, 2.6_

- [x] 6. Auth pages
  - [x] 6.1 Implement `LoginPage.jsx`
    - Form with email, password, and role selector (Teacher / Student — exactly two options)
    - On submit: call `authService.login()`, then `AuthContext.login()`, then navigate to role dashboard
    - Display descriptive error message on API failure
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.6, 1.8_

  - [ ]* 6.2 Write unit tests for LoginPage form validation
    - Test that submitting with empty fields shows validation errors
    - Test that API error response surfaces error message in UI
    - _Requirements: 1.6_

- [x] 7. Teacher pages
  - [x] 7.1 Implement `TeacherDashboard.jsx`
    - Fetch from `teacherService.getDashboard()` on mount
    - Render StatCards for Total Students, Evaluations Done, Average Marks
    - Render recent evaluations table (Student Name, Subject, Marks, Date)
    - Show `Loader` while loading; show error message on failure
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 7.2 Implement `UploadEvaluationPage.jsx`
    - Render three `UploadBox` components (Question Paper, Rubrics, Answer Sheet)
    - Validate all three files selected before submit; show missing-file message if not
    - On submit: build `FormData`, call `evaluationService.submitEvaluation()`, navigate to results on success
    - Show `Loader` and disable submit while in progress; show error on failure
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [x] 7.3 Implement `TeacherResultsPage.jsx`
    - Fetch from `evaluationService.getResults()` on mount
    - Render results table (Student Name, Subject, Marks, Date); clicking a row navigates to `/teacher/results/:id`
    - Show `Loader` while loading; show error on failure; show empty state when no results
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 23.1_

  - [x] 7.4 Implement `TeacherResultDetailPage.jsx`
    - Fetch result by route param `id` via `evaluationService.getResultById(id)` on mount
    - Render one `QuestionCard` per question
    - Show `Loader` while loading; show error on failure
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 8. Student pages
  - [ ] 8.1 Implement `StudentDashboard.jsx`
    - Fetch from `studentService.getDashboard()` on mount
    - Render StatCards for Total Marks and Average Score
    - Render `ChartCard` with Recharts LineChart for score progression
    - Render `ChartCard` with Recharts PieChart for subject distribution
    - Show `Loader` while loading; show error on failure
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ] 8.2 Implement `StudentResultsPage.jsx`
    - Fetch from `studentService.getResults()` on mount
    - Render results list grouped/labeled by subject; clicking navigates to `/student/results/:id`
    - Show `Loader` while loading; show error on failure; show empty state when no results
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 23.1_

  - [ ] 8.3 Implement `StudentResultDetailPage.jsx`
    - Fetch result by route param `id` via `studentService.getResultById(id)` on mount
    - Render one `QuestionCard` per question (correct points, missing points, mistakes, suggestions, marks)
    - Show `Loader` while loading; show error on failure
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 8.4 Implement `PerformanceAnalyticsPage.jsx`
    - Fetch from `studentService.getAnalytics()` on mount
    - Render weak areas section, strong areas section, and `ChartCard` with performance trend chart
    - Show `Loader` while loading; show error on failure
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 8.5 Implement `AIStudyAgentPage.jsx`
    - Maintain `messages: ChatMessage[]` in state; render via `ChatBox`
    - On message submit: append user message, call `studyAgentService.sendMessage()`, append agent reply
    - Render three quick action buttons (Explain Topic, Generate Quiz, Create Study Plan) using `QUICK_ACTION_PROMPTS`
    - Show loading indicator in ChatBox while awaiting reply; show error in ChatBox on failure
    - Preserve full conversation history in component state for session duration
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9_

- [ ] 9. Agent pages
  - [ ] 9.1 Implement `TrainerAgentPage.jsx`
    - Render content sections for exactly five techniques: Active Recall, Spaced Repetition, Pomodoro, Blurting, Feynman Technique
    - Each section shows title, description, and actionable steps
    - Apply Framer Motion staggered entrance animations (`delay: index * 0.1`)
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 9.2 Implement `ParentAgentPage.jsx`
    - Fetch from parent agent API endpoint on mount
    - Render performance summary (subject scores, overall progress)
    - Derive badge level via `getBadgeLevel(averageScore)` and render `Badge` component
    - Show `Loader` while loading; show error on failure
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [ ] 9.3 Implement `MemoryAgentPage.jsx`
    - Fetch from memory agent API endpoint on mount
    - Render performance history list (date, score, subject)
    - Render `ChartCard` with Recharts BarChart for comparison across time periods
    - Show `Loader` while loading; show error on failure
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 10. Checkpoint — frontend complete
  - Ensure all frontend components render without errors, routing works end-to-end, and auth flow redirects correctly. Ask the user if questions arise.

- [ ] 11. Backend: Express server setup and MongoDB connection
  - Create `Evalora-AI/server/index.js` with Express app, CORS, JSON body parser, and `dotenv` config
  - Connect to MongoDB via Mongoose using `MONGODB_URI` env var
  - Mount route files and start server on `PORT` env var
  - _Requirements: 22.2, 22.3_

- [ ] 12. Backend: MongoDB schemas
  - [ ] 12.1 Create `models/User.js` — fields: email, password (hashed), role, createdAt
    - _Requirements: 17.1_
  - [ ] 12.2 Create `models/Evaluation.js` — fields: teacherId (ref User), studentId (ref User), subject, questionPaperPath, rubricsPath, answerSheetPath, totalMarks, status, createdAt
    - _Requirements: 17.2, 17.4_
  - [ ] 12.3 Create `models/Result.js` — fields: evaluationId (ref Evaluation), questionWiseData[], mistakes[], suggestions[]
    - _Requirements: 17.3, 17.5_

- [ ] 13. Backend: Auth routes, JWT middleware, and role middleware
  - [ ] 13.1 Implement `POST /api/login` route in `routes/auth.js`
    - Validate email/password/role, compare bcrypt hash, sign JWT, return `{ success: true, data: { token, role, user } }`
    - Return standardised error response on failure
    - _Requirements: 1.2, 20.6, 21.1, 21.2_

  - [ ]* 13.2 Write property test for standardised API response format
    - **Property 5: Success response shape** — every successful handler response must contain `{ success: true, data: {...} }`
    - **Property 6: Error response shape** — every error handler response must contain `{ success: false, message: string, code: string }`
    - **Validates: Requirements 21.1, 21.2, 21.3**

  - [ ] 13.3 Implement `middleware/auth.js` JWT verification middleware
    - Verify token from `Authorization: Bearer` header; attach decoded user to `req.user`; return 401 if invalid/missing
    - _Requirements: 20.1, 20.2_

  - [ ] 13.4 Implement `middleware/role.js` role-checking middleware factory
    - `requireRole(role)` returns middleware that returns 403 if `req.user.role !== role`
    - _Requirements: 20.3, 20.4, 20.5_

- [ ] 14. Backend: Evaluation routes and Multer file upload
  - Configure Multer middleware to store files in `UPLOAD_DIR` env var path
  - Implement `POST /api/evaluate` in `routes/evaluation.js`
    - Accept three files (questionPaper, rubrics, answerSheet) via Multer
    - Create Evaluation document, trigger AI pipeline, return result id
    - Apply JWT auth middleware and teacher role middleware
  - Implement `GET /api/teacher/results` and `GET /api/teacher/results/:id`
  - Implement `GET /api/teacher/dashboard`
  - _Requirements: 4.3, 5.1, 6.1, 19.1, 20.3, 22.6_

- [ ] 15. Backend: AI evaluation pipeline
  - [ ] 15.1 Implement OCR extraction in `services/ocrService.js`
    - Use Tesseract.js to extract raw text from uploaded PDF/image file
    - _Requirements: 18.1, 19.2_

  - [ ] 15.2 Implement text cleaning in `services/textCleanService.js`
    - Normalise and remove OCR artifacts from raw extracted text
    - _Requirements: 18.2_

  - [ ] 15.3 Implement question splitter in `services/questionSplitter.js`
    - Split cleaned text into per-question segments aligned with question paper structure
    - _Requirements: 18.3_

  - [ ] 15.4 Implement AI scoring in `services/evaluationEngine.js`
    - Compare each segment against rubric entry using LLM/AI model to assign marks
    - Detect mistakes and generate improvement suggestions per question
    - _Requirements: 18.4, 18.5_

  - [ ] 15.5 Wire pipeline and persist result in `services/pipelineService.js`
    - Orchestrate OCR → clean → split → evaluate → feedback
    - Persist Result document to MongoDB; return result id
    - _Requirements: 18.6, 19.3, 19.4_

- [ ] 16. Backend: Student routes and analytics
  - Implement `GET /api/student/dashboard` in `routes/student.js`
  - Implement `GET /api/student/results` and `GET /api/student/results/:id`
  - Implement `GET /api/student/analytics` — derive weak/strong areas and performance trend from Result documents
  - Apply JWT auth middleware and student role middleware to all student routes
  - _Requirements: 7.1, 8.1, 9.1, 10.1, 20.4_

- [ ] 17. Backend: Agent routes
  - Implement `GET /api/agents/parent` in `routes/agents.js` — return student performance summary and average score
  - Implement `GET /api/agents/memory` — return historical scores and comparison data
  - Implement `POST /api/study-agent` — forward message to LLM and return `{ reply }`
  - Apply JWT auth middleware to all agent routes
  - _Requirements: 11.3, 13.1, 14.1_

- [ ] 18. Checkpoint — backend complete
  - Ensure all API routes return standardised responses, auth middleware rejects invalid tokens, and role middleware returns 403 for wrong roles. Ask the user if questions arise.

- [ ] 19. Environment configuration
  - Create `Evalora-AI/client/.env` with `VITE_API_URL=http://localhost:5000/api`
  - Create `Evalora-AI/server/.env` with `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `UPLOAD_DIR`
  - Create `.env.example` files for both client and server documenting all required variables
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6_

- [ ] 20. Empty and loading state polish
  - Add friendly empty-state message + illustrative graphic to all list/table pages when data array is empty
  - Add graceful no-data indicator to all `ChartCard` instances when data is empty
  - Verify `AIStudyAgentPage` shows welcome empty state in `ChatBox` before first message
  - Verify `Loader` is shown on every page-level data fetch
  - _Requirements: 23.1, 23.2, 23.3, 23.4_

- [ ] 21. Deployment configuration
  - Add `vercel.json` to `Evalora-AI/client/` configuring build command `npm run build` and output directory `dist`; document `VITE_API_URL` as required Vercel env var
  - Add `Procfile` or `render.yaml` to `Evalora-AI/server/` for Render/Railway deployment; document all required server env vars
  - Document MongoDB Atlas setup and `MONGODB_URI` format in README
  - _Requirements: 25.1, 25.2, 25.3_

- [ ] 23. Global Error Boundary
  - Create ErrorBoundary class component in `components/ErrorBoundary.jsx`
  - Wrap AppRoutes in ErrorBoundary in App.jsx
  - Render fallback UI with error message and reload/home button on caught error
  - _Requirements: 26.1, 26.2, 26.3_

- [ ] 24. Request cancellation in all data-fetching pages
  - Update all useEffect data-fetch hooks in TeacherDashboard, TeacherResultsPage, TeacherResultDetailPage, StudentDashboard, StudentResultsPage, StudentResultDetailPage, PerformanceAnalyticsPage, ParentAgentPage, MemoryAgentPage to use AbortController
  - Pass signal to service function calls; call controller.abort() in cleanup
  - Suppress AbortError from triggering error state
  - _Requirements: 27.1, 27.2, 27.3_

- [ ] 25. Chart UX enhancements
  - Add Recharts Tooltip to all LineChart, PieChart, and BarChart instances
  - Add activeShape or activeDot hover animation to charts
  - Add "No data available" fallback inside ChartCard when data prop is empty/null
  - _Requirements: 28.1, 28.2, 28.3_

- [ ] 26. Chat typing indicator
  - Add animated typing indicator (three pulsing dots) to ChatBox shown when isLoading is true
  - Style indicator as a distinct left-aligned bubble separate from MessageBubble
  - Replace indicator with agent MessageBubble when response arrives
  - _Requirements: 29.1, 29.2, 29.3_

- [ ] 27. Token expiry pre-check in apiClient
  - In the Axios request interceptor, decode the JWT using atob or a lightweight decoder
  - Compare exp claim against Date.now(); if expired, clear localStorage and redirect to /login before the request fires
  - _Requirements: 30.1, 30.2, 30.3_

- [ ] 28. Responsive layout
  - Update Sidebar to collapse into a hidden drawer on mobile with a hamburger toggle button
  - Apply responsive Tailwind classes (sm:, md:, lg:) to Layout, all page grids, and stat card rows
  - Test layout at 375px (mobile), 768px (tablet), and 1280px (desktop) breakpoints
  - _Requirements: 31.1, 31.2, 31.3, 31.4_

- [ ] 29. Development mode logging
  - In the Axios response interceptor, add conditional console.log(response) guarded by import.meta.env.DEV
  - Ensure no logging occurs when DEV is false
  - _Requirements: 32.1, 32.2, 32.3_

- [ ]* 30. Optional caching layer
  - Implement a simple Map-based in-memory cache in a shared cacheService.js
  - Wrap getDashboard, getResults, and getAnalytics service calls to check cache before fetching
  - Clear cache on AuthContext logout
  - _Requirements: 33.1, 33.2, 33.3_

- [ ] 22. Final checkpoint
  - Ensure all tests pass, all routes are reachable, auth flow works end-to-end, and deployment configs are valid. Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties (badge logic, API shape, token injection, auth state)
- Unit tests validate specific examples and edge cases
- Checkpoints at tasks 10, 18, and 22 ensure incremental validation
- Tasks 23–30 cover advanced improvements: error boundary, request cancellation, chart UX, typing indicator, token expiry, responsive layout, dev logging, and optional caching
