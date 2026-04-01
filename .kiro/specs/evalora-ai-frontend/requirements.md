# Requirements Document

## Introduction

Evalora AI is an AI-powered smart evaluation and learning system with a React-based frontend. The system supports two roles — Teacher and Student — and provides AI-driven evaluation, performance analytics, and personalized study assistance. The frontend communicates with a Node.js/Express backend via REST APIs and presents a modern SaaS dark-themed UI with glassmorphism cards, Framer Motion animations, and Recharts-based data visualizations.

## Glossary

- **App**: The complete Evalora AI React frontend application
- **Auth_Service**: The client-side module responsible for authentication API calls and token management
- **Teacher**: A user with the teacher role who uploads evaluations and reviews results
- **Student**: A user with the student role who views results, analytics, and interacts with the AI study agent
- **Evaluation**: The process of submitting a question paper, rubrics, and answer sheet for AI-based grading
- **Result**: The graded output of an evaluation containing question-wise marks, mistakes, and suggestions
- **Study_Agent**: The AI-powered chat interface that provides study assistance to students
- **Trainer_Agent**: The page presenting structured study techniques to students
- **Parent_Agent**: The page summarizing student performance for parent/guardian review
- **Memory_Agent**: The page displaying historical performance comparisons
- **Router**: The React Router instance managing client-side navigation
- **Auth_Context**: The React context providing authentication state and actions across the App
- **Sidebar**: The role-aware navigation component rendered on authenticated pages
- **Navbar**: The top navigation bar rendered on authenticated pages
- **Stat_Card**: A UI component displaying a single metric with a label and value
- **Chart_Card**: A UI component wrapping a Recharts chart with a title
- **Question_Card**: A UI component displaying per-question evaluation details
- **Upload_Box**: A UI component handling file selection and drag-and-drop for document uploads
- **Chat_Box**: A UI component rendering the AI study agent conversation thread
- **Message_Bubble**: A UI component rendering a single chat message
- **Badge**: A UI component displaying achievement level (Gold, Silver, Bronze)
- **Loader**: A UI component displaying an animated loading indicator
- **API_Client**: The configured Axios instance used by all service modules

---

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to log in with my email, password, and role so that I am redirected to the correct role-based dashboard.

#### Acceptance Criteria

1. THE App SHALL provide a `/login` route rendering the LoginPage component.
2. WHEN a user submits valid credentials, THE Auth_Service SHALL send a POST request to `/api/login` with email, password, and role fields.
3. WHEN the `/api/login` response contains a token and role, THE Auth_Context SHALL store the token and role in localStorage.
4. WHEN the stored role is `teacher`, THE Router SHALL redirect the user to `/teacher/dashboard`.
5. WHEN the stored role is `student`, THE Router SHALL redirect the user to `/student/dashboard`.
6. IF the `/api/login` response returns an error status, THEN THE LoginPage SHALL display a descriptive error message to the user.
7. WHEN a user accesses a protected route without a valid token, THE Router SHALL redirect the user to `/login`.
8. THE LoginPage SHALL provide a role selection control with exactly two options: `Teacher` and `Student`.

---

### Requirement 2: Application Routing and Layout

**User Story:** As an authenticated user, I want consistent navigation and layout so that I can move between pages without losing context.

#### Acceptance Criteria

1. THE Router SHALL define routes for `/login`, `/teacher/dashboard`, `/teacher/upload`, `/teacher/results`, `/teacher/results/:id`, `/student/dashboard`, `/student/results`, `/student/results/:id`, `/student/analytics`, `/student/study-agent`, `/agents/trainer`, `/agents/parent`, and `/agents/memory`.
2. WHILE a user is authenticated, THE App SHALL render the Sidebar and Navbar on all routes except `/login`.
3. THE Sidebar SHALL render navigation links filtered to the routes permitted for the authenticated user's role.
4. WHEN a Teacher is authenticated, THE Sidebar SHALL display links to `/teacher/dashboard`, `/teacher/upload`, `/teacher/results`, `/agents/trainer`, `/agents/parent`, and `/agents/memory`.
5. WHEN a Student is authenticated, THE Sidebar SHALL display links to `/student/dashboard`, `/student/results`, `/student/analytics`, `/student/study-agent`, `/agents/trainer`, `/agents/parent`, and `/agents/memory`.
6. THE App SHALL apply a dark SaaS theme with gradient backgrounds and glassmorphism card styles globally via Tailwind CSS.

---

### Requirement 3: Teacher Dashboard

**User Story:** As a teacher, I want to see summary statistics and recent evaluations so that I can monitor overall class performance at a glance.

#### Acceptance Criteria

1. WHEN the TeacherDashboard mounts, THE TeacherDashboard SHALL fetch summary data from the teacher dashboard API endpoint using a GET request.
2. THE TeacherDashboard SHALL render a Stat_Card for Total Students, a Stat_Card for Evaluations Done, and a Stat_Card for Average Marks.
3. THE TeacherDashboard SHALL render a table of recent evaluations containing at minimum the columns: Student Name, Subject, Marks, and Date.
4. WHILE the dashboard data is loading, THE TeacherDashboard SHALL display the Loader component.
5. IF the dashboard API request fails, THEN THE TeacherDashboard SHALL display a descriptive error message.

---

### Requirement 4: Upload Evaluation

**User Story:** As a teacher, I want to upload a question paper, rubrics, and answer sheet so that the AI can evaluate the submission and return results.

#### Acceptance Criteria

1. THE UploadEvaluationPage SHALL render three Upload_Box components: one for the Question Paper, one for the Rubrics, and one for the Answer Sheet.
2. THE Upload_Box SHALL accept file selection via both a click-to-browse interaction and a drag-and-drop interaction.
3. WHEN a teacher submits all three files, THE UploadEvaluationPage SHALL send a POST request to `/api/evaluate` with the files as multipart form data.
4. WHILE the evaluation request is in progress, THE UploadEvaluationPage SHALL display the Loader component and disable the submit control.
5. WHEN the evaluation response is received successfully, THE Router SHALL navigate the teacher to the TeacherResultsPage.
6. IF the evaluation API request fails, THEN THE UploadEvaluationPage SHALL display a descriptive error message and re-enable the submit control.
7. IF a teacher attempts to submit without selecting all three files, THEN THE UploadEvaluationPage SHALL display a validation message identifying the missing files.

---

### Requirement 5: Teacher Results

**User Story:** As a teacher, I want to browse all evaluation results so that I can review student performance across submissions.

#### Acceptance Criteria

1. WHEN the TeacherResultsPage mounts, THE TeacherResultsPage SHALL fetch all results from the teacher results API endpoint using a GET request.
2. THE TeacherResultsPage SHALL render a table with columns: Student Name, Subject, Marks, and Date.
3. WHEN a teacher clicks a result row, THE Router SHALL navigate to `/teacher/results/:id` for the selected result.
4. WHILE results data is loading, THE TeacherResultsPage SHALL display the Loader component.
5. IF the results API request fails, THEN THE TeacherResultsPage SHALL display a descriptive error message.

---

### Requirement 6: Teacher Result Detail

**User Story:** As a teacher, I want to view question-wise marks, mistakes, and suggestions for a specific result so that I can give targeted feedback.

#### Acceptance Criteria

1. WHEN the TeacherResultDetailPage mounts, THE TeacherResultDetailPage SHALL fetch the result identified by the route parameter `id` from the result detail API endpoint.
2. THE TeacherResultDetailPage SHALL render one Question_Card per question in the result.
3. THE Question_Card SHALL display the question number, awarded marks, identified mistakes, and improvement suggestions.
4. WHILE the result detail is loading, THE TeacherResultDetailPage SHALL display the Loader component.
5. IF the result detail API request fails, THEN THE TeacherResultDetailPage SHALL display a descriptive error message.

---

### Requirement 7: Student Dashboard

**User Story:** As a student, I want to see my total marks, average score, progress over time, and subject-wise breakdown so that I can understand my overall performance.

#### Acceptance Criteria

1. WHEN the StudentDashboard mounts, THE StudentDashboard SHALL fetch dashboard data from `/api/student/dashboard` using a GET request.
2. THE StudentDashboard SHALL render a Stat_Card for Total Marks and a Stat_Card for Average Score.
3. THE StudentDashboard SHALL render a Chart_Card containing a line chart showing the student's score progression over time.
4. THE StudentDashboard SHALL render a Chart_Card containing a pie chart showing subject-wise score distribution.
5. WHILE the dashboard data is loading, THE StudentDashboard SHALL display the Loader component.
6. IF the dashboard API request fails, THEN THE StudentDashboard SHALL display a descriptive error message.

---

### Requirement 8: Student Results

**User Story:** As a student, I want to browse my subject-wise results so that I can track marks per subject.

#### Acceptance Criteria

1. WHEN the StudentResultsPage mounts, THE StudentResultsPage SHALL fetch the student's results from the student results API endpoint using a GET request.
2. THE StudentResultsPage SHALL render a list of results grouped or labeled by subject, showing subject name and marks.
3. WHEN a student clicks a result item, THE Router SHALL navigate to `/student/results/:id` for the selected result.
4. WHILE results data is loading, THE StudentResultsPage SHALL display the Loader component.
5. IF the results API request fails, THEN THE StudentResultsPage SHALL display a descriptive error message.

---

### Requirement 9: Student Result Detail

**User Story:** As a student, I want to see per-question correct points, missing points, mistakes, and suggestions so that I can learn from my evaluation.

#### Acceptance Criteria

1. WHEN the StudentResultDetailPage mounts, THE StudentResultDetailPage SHALL fetch the result identified by the route parameter `id` from the student result detail API endpoint.
2. THE StudentResultDetailPage SHALL render one Question_Card per question in the result.
3. THE Question_Card SHALL display the question number, correct points earned, missing points, identified mistakes, improvement suggestions, and marks awarded.
4. WHILE the result detail is loading, THE StudentResultDetailPage SHALL display the Loader component.
5. IF the result detail API request fails, THEN THE StudentResultDetailPage SHALL display a descriptive error message.

---

### Requirement 10: Performance Analytics

**User Story:** As a student, I want to view my weak areas, strong areas, and performance trends so that I can focus my study efforts effectively.

#### Acceptance Criteria

1. WHEN the PerformanceAnalyticsPage mounts, THE PerformanceAnalyticsPage SHALL fetch analytics data from the student analytics API endpoint using a GET request.
2. THE PerformanceAnalyticsPage SHALL render a section listing the student's identified weak areas.
3. THE PerformanceAnalyticsPage SHALL render a section listing the student's identified strong areas.
4. THE PerformanceAnalyticsPage SHALL render a Chart_Card containing a performance trend chart over time.
5. WHILE analytics data is loading, THE PerformanceAnalyticsPage SHALL display the Loader component.
6. IF the analytics API request fails, THEN THE PerformanceAnalyticsPage SHALL display a descriptive error message.

---

### Requirement 11: AI Study Agent

**User Story:** As a student, I want to chat with an AI study agent and use quick actions so that I can get personalized study help.

#### Acceptance Criteria

1. THE AIStudyAgentPage SHALL render a Chat_Box displaying the conversation history between the student and the Study_Agent.
2. THE Chat_Box SHALL render each message as a Message_Bubble distinguishing between student messages and Study_Agent responses visually.
3. WHEN a student submits a message, THE AIStudyAgentPage SHALL send a POST request to `/api/study-agent` with the message content.
4. WHILE the Study_Agent response is pending, THE AIStudyAgentPage SHALL display a loading indicator within the Chat_Box.
5. WHEN the Study_Agent response is received, THE Chat_Box SHALL append the response as a new Message_Bubble.
6. THE AIStudyAgentPage SHALL render three quick action buttons: "Explain Topic", "Generate Quiz", and "Create Study Plan".
7. WHEN a student activates a quick action button, THE AIStudyAgentPage SHALL send a POST request to `/api/study-agent` with a pre-defined prompt corresponding to the selected action.
8. IF the study agent API request fails, THEN THE AIStudyAgentPage SHALL display a descriptive error message within the Chat_Box.
9. THE AIStudyAgentPage SHALL preserve the full conversation history in component state for the duration of the session.

---

### Requirement 12: Trainer Agent Page

**User Story:** As a user, I want to learn about structured study techniques so that I can improve my learning efficiency.

#### Acceptance Criteria

1. THE TrainerAgentPage SHALL render content sections for exactly five study techniques: Active Recall, Spaced Repetition, Pomodoro, Blurting, and Feynman Technique.
2. THE TrainerAgentPage SHALL display a title, description, and actionable steps for each study technique.
3. THE TrainerAgentPage SHALL apply Framer Motion entrance animations to each technique section.

---

### Requirement 13: Parent Agent Page

**User Story:** As a parent or guardian, I want to see a student performance summary and achievement badges so that I can monitor my child's progress.

#### Acceptance Criteria

1. WHEN the ParentAgentPage mounts, THE ParentAgentPage SHALL fetch the student performance summary from the parent agent API endpoint using a GET request.
2. THE ParentAgentPage SHALL render a performance summary section displaying subject scores and overall progress.
3. THE ParentAgentPage SHALL render a Badge component reflecting the student's achievement level: Gold, Silver, or Bronze.
4. THE Badge SHALL display Gold when the average score meets or exceeds 80%, Silver when the average score is between 60% and 79% inclusive, and Bronze when the average score is below 60%.
5. WHILE the performance summary is loading, THE ParentAgentPage SHALL display the Loader component.
6. IF the parent agent API request fails, THEN THE ParentAgentPage SHALL display a descriptive error message.

---

### Requirement 14: Memory Agent Page

**User Story:** As a user, I want to view historical performance data and comparison charts so that I can track improvement over time.

#### Acceptance Criteria

1. WHEN the MemoryAgentPage mounts, THE MemoryAgentPage SHALL fetch historical performance data from the memory agent API endpoint using a GET request.
2. THE MemoryAgentPage SHALL render a performance history list showing past evaluation scores with dates.
3. THE MemoryAgentPage SHALL render a Chart_Card containing a comparison chart contrasting performance across multiple time periods.
4. WHILE historical data is loading, THE MemoryAgentPage SHALL display the Loader component.
5. IF the memory agent API request fails, THEN THE MemoryAgentPage SHALL display a descriptive error message.

---

### Requirement 15: API Client and Service Modules

**User Story:** As a developer, I want all API calls to use a centralized Axios instance and typed service modules so that authentication headers and base URLs are applied consistently.

#### Acceptance Criteria

1. THE API_Client SHALL be configured with a base URL read from an environment variable.
2. THE API_Client SHALL attach the stored authentication token as a Bearer token in the Authorization header for every request where a token exists in localStorage.
3. THE Auth_Service SHALL expose functions for login and logout operations.
4. THE App SHALL provide an `evaluationService` module exposing functions for submitting evaluations and fetching teacher results.
5. THE App SHALL provide a `studentService` module exposing functions for fetching student dashboard data, results, and analytics.
6. THE App SHALL provide a `studyAgentService` module exposing a function for sending messages to the Study_Agent.
7. WHEN the API_Client receives a 401 response, THE API_Client SHALL clear the stored token and role from localStorage and redirect the user to `/login`.

---

### Requirement 16: UI Component Library

**User Story:** As a developer, I want a set of reusable UI components so that the interface is consistent and maintainable across all pages.

#### Acceptance Criteria

1. THE Loader SHALL render an animated spinner using Framer Motion or a CSS animation.
2. THE Stat_Card SHALL accept a label prop and a value prop and render both within a glassmorphism-styled card.
3. THE Chart_Card SHALL accept a title prop and a children prop and render the title above the children within a glassmorphism-styled card.
4. THE Question_Card SHALL accept question data as props and render all evaluation fields within a styled card.
5. THE Upload_Box SHALL accept an `onFileSelect` callback prop and invoke it with the selected File object when a file is chosen.
6. THE Badge SHALL accept a level prop with values `gold`, `silver`, or `bronze` and render the corresponding visual style.
7. THE Message_Bubble SHALL accept a `role` prop with values `user` or `agent` and apply distinct visual alignment and color styles for each role.
8. THE App SHALL apply Framer Motion page transition animations when navigating between routes.

---

### Requirement 17: Database Schema Design

**User Story:** As a developer, I want well-defined MongoDB schemas so that data is stored consistently and relationships between users, evaluations, and results are clear.

#### Acceptance Criteria

1. THE App SHALL define a User schema containing the fields: id, email, password (hashed), role (teacher or student), and createdAt.
2. THE App SHALL define an Evaluation schema containing the fields: id, teacherId, studentId, subject, questionPaperPath, rubricsPath, answerSheetPath, totalMarks, status, and createdAt.
3. THE App SHALL define a Result schema containing the fields: id, evaluationId, questionWiseData array (each entry containing questionNumber, correctPoints, missingPoints, and marks), mistakes array, and suggestions array.
4. WHEN an Evaluation document is created, THE App SHALL store the teacherId as a reference to the User collection.
5. WHEN a Result document is created, THE App SHALL store the evaluationId as a reference to the Evaluation collection.

---

### Requirement 18: AI Evaluation Pipeline

**User Story:** As a teacher, I want uploaded answer sheets to be processed through an AI pipeline so that each answer is evaluated against the rubric and structured feedback is generated.

#### Acceptance Criteria

1. WHEN an answer sheet file is received, THE App SHALL perform OCR on the file using Tesseract or an equivalent library to extract raw text.
2. WHEN raw text is extracted, THE App SHALL normalize and clean the text to remove artifacts introduced by OCR processing.
3. WHEN cleaned text is available, THE App SHALL split the text into per-question segments aligned with the question paper structure.
4. WHEN per-question segments are available, THE App SHALL compare each segment against the corresponding rubric entry using an LLM or AI scoring model to assign marks.
5. WHEN marks are assigned, THE App SHALL detect mistakes and generate improvement suggestions for each question segment.
6. WHEN evaluation and feedback are complete, THE App SHALL persist a Result document to MongoDB containing all question-wise data, mistakes, and suggestions.

---

### Requirement 19: File Processing Flow

**User Story:** As a developer, I want a defined file processing flow so that uploaded documents are reliably stored, processed, and linked to evaluation results.

#### Acceptance Criteria

1. WHEN a file is uploaded, THE App SHALL receive it via Multer middleware and store it in the `/uploads` directory on the server.
2. WHEN a file is stored, THE App SHALL perform OCR processing to convert the PDF or image file into extracted text.
3. WHEN OCR processing is complete, THE App SHALL pass the extracted text through the AI evaluation pipeline.
4. WHEN the AI evaluation pipeline completes, THE App SHALL save the Result document to MongoDB and return the result identifier to the caller.

---

### Requirement 20: Security Design

**User Story:** As a developer, I want JWT-based authentication middleware and role-based access control so that protected routes are accessible only to authorized users with the correct role.

#### Acceptance Criteria

1. THE App SHALL apply a JWT authentication middleware to every protected route that verifies the token and attaches the decoded user object to the request.
2. IF a request to a protected route contains an invalid or missing token, THEN THE App SHALL return a 401 Unauthorized response.
3. THE App SHALL apply a role middleware to teacher-specific routes that restricts access to users whose role is `teacher`.
4. THE App SHALL apply a role middleware to student-specific routes that restricts access to users whose role is `student`.
5. IF a user with an incorrect role attempts to access a role-restricted route, THEN THE App SHALL return a 403 Forbidden response.
6. WHEN a user password is stored, THE App SHALL hash the password using bcrypt before persisting it to the database.

---

### Requirement 21: Standardized API Response Format

**User Story:** As a developer, I want all API responses to follow a consistent structure so that the frontend can handle success and error cases uniformly.

#### Acceptance Criteria

1. WHEN an API request succeeds, THE App SHALL return a response body containing `{ success: true, data: { ... } }`.
2. WHEN an API request fails, THE App SHALL return a response body containing `{ success: false, message: "<descriptive message>", code: "<ERROR_CODE>" }`.
3. THE App SHALL use the standardized error response format for all error conditions including validation errors, authentication failures, and server errors.

---

### Requirement 22: Environment Configuration

**User Story:** As a developer, I want all environment-specific values defined as environment variables so that the application can be configured without code changes across environments.

#### Acceptance Criteria

1. THE App's client build SHALL read the backend API base URL from the environment variable `VITE_API_URL` with a default value of `http://localhost:5000/api`.
2. THE App's server SHALL read the listening port from the environment variable `PORT`.
3. THE App's server SHALL read the MongoDB connection string from the environment variable `MONGODB_URI`.
4. THE App's server SHALL read the JWT signing secret from the environment variable `JWT_SECRET`.
5. THE App's server SHALL read the JWT expiration duration from the environment variable `JWT_EXPIRES_IN`.
6. THE App's server SHALL read the file upload directory path from the environment variable `UPLOAD_DIR`.

---

### Requirement 23: Loading and Empty States

**User Story:** As a user, I want informative empty and loading states on all data-driven pages so that I always understand the current state of the interface.

#### Acceptance Criteria

1. WHEN a list or table page contains no data, THE App SHALL display a friendly empty-state message and an illustrative graphic.
2. WHEN a chart component receives no data, THE App SHALL render a graceful no-data indicator in place of the chart.
3. WHEN the AIStudyAgentPage is opened before any message has been sent, THE App SHALL display a welcome empty state within the Chat_Box.
4. WHILE any page-level data fetch is in progress, THE App SHALL display the Loader component for that page.

---

### Requirement 24: State Management Strategy

**User Story:** As a developer, I want a defined state management approach so that authentication state is globally accessible and page-level state is managed locally without an external library.

#### Acceptance Criteria

1. THE Auth_Context SHALL store and expose the authentication token, user role, user object, and login and logout action functions to all descendant components.
2. WHEN a user logs in, THE Auth_Context SHALL update the token, role, and user object in both context state and localStorage.
3. WHEN a user logs out, THE Auth_Context SHALL clear the token, role, and user object from both context state and localStorage.
4. THE App SHALL manage page-level data including results, loading state, and error state using React useState hooks within each page component.
5. THE App SHALL not require an external state management library such as Redux or Zustand.

---

### Requirement 25: Deployment Configuration

**User Story:** As a developer, I want a defined deployment plan so that the frontend, backend, and database can each be deployed to their respective platforms with the correct configuration.

#### Acceptance Criteria

1. THE App's frontend SHALL be deployable to Vercel using `npm run build` as the build command with `VITE_API_URL` configured as an environment variable in the Vercel dashboard.
2. THE App's backend SHALL be deployable to Render or Railway with all required environment variables configured in the platform dashboard.
3. THE App SHALL use MongoDB Atlas as the database provider with the connection string supplied via the `MONGODB_URI` environment variable.

---

### Requirement 26: Global Error Boundary

**User Story:** As a user, I want the app to recover gracefully from unexpected runtime errors so that a single component crash does not bring down the entire application.

#### Acceptance Criteria

1. THE App SHALL wrap the AppRoutes component in a React ErrorBoundary component.
2. WHEN an unhandled runtime error is thrown within any route component, THE ErrorBoundary SHALL catch the error and render a fallback UI instead of crashing the app.
3. THE fallback UI SHALL display a user-friendly error message and a button to reload or navigate home.

---

### Requirement 27: Request Cancellation

**User Story:** As a developer, I want in-flight API requests to be cancelled when a component unmounts so that stale responses do not cause memory leaks or state updates on unmounted components.

#### Acceptance Criteria

1. WHEN a page component mounts and initiates an API request, THE component SHALL create an AbortController and pass its signal to the API call.
2. WHEN the component unmounts before the API response is received, THE component SHALL call controller.abort() in the useEffect cleanup function.
3. WHEN an aborted request error is received, THE component SHALL NOT update state or display an error message.

---

### Requirement 28: Chart UX Enhancements

**User Story:** As a user, I want charts to have tooltips, hover animations, and graceful empty states so that data visualisations are informative and polished.

#### Acceptance Criteria

1. THE App SHALL render a Recharts Tooltip on all LineChart, PieChart, and BarChart instances.
2. WHEN a user hovers over a chart data point, THE chart SHALL display an animated highlight effect.
3. WHEN a chart component receives an empty or null data array, THE ChartCard SHALL render a "No data available" message in place of the chart.

---

### Requirement 29: Chat Typing Indicator and Streaming UX

**User Story:** As a student, I want to see a typing indicator while the AI study agent is generating a response so that the chat feels responsive and alive.

#### Acceptance Criteria

1. WHILE the Study_Agent response is pending, THE ChatBox SHALL display an animated typing indicator bubble (e.g., three pulsing dots).
2. THE typing indicator SHALL be visually distinct from regular Message_Bubble components.
3. WHEN the Study_Agent response is received, THE typing indicator SHALL be replaced by the response Message_Bubble.

---

### Requirement 30: Token Expiry Handling

**User Story:** As a user, I want expired JWT tokens to be detected before API calls are made so that I am redirected to login proactively rather than receiving a confusing error.

#### Acceptance Criteria

1. BEFORE each API request, THE API_Client SHALL decode the stored JWT and check its expiry timestamp.
2. IF the token is expired, THEN THE API_Client SHALL clear localStorage and redirect to /login without making the API call.
3. THE token expiry check SHALL be performed in the Axios request interceptor.

---

### Requirement 31: Responsive Layout

**User Story:** As a user, I want the application layout to adapt to mobile, tablet, and desktop screen sizes so that I can use the app on any device.

#### Acceptance Criteria

1. ON mobile viewports (< 768px), THE Sidebar SHALL collapse to a hidden drawer toggled by a hamburger menu button.
2. ON tablet viewports (768px–1024px), THE App SHALL apply reduced padding and a compact layout.
3. ON desktop viewports (> 1024px), THE App SHALL render the full Sidebar and Navbar layout.
4. ALL page components SHALL use responsive Tailwind CSS classes to adapt their grid and flex layouts across breakpoints.

---

### Requirement 32: Development Mode Logging

**User Story:** As a developer, I want API responses and errors to be logged to the console in development mode so that debugging is easier without polluting production logs.

#### Acceptance Criteria

1. WHEN the app is running in development mode (import.meta.env.DEV is true), THE API_Client SHALL log each response object to the console.
2. WHEN the app is running in production mode, THE API_Client SHALL NOT log any response data to the console.
3. THE development logging SHALL be implemented in the Axios response interceptor.

---

### Requirement 33: Caching Layer (Optional)

**User Story:** As a developer, I want frequently accessed API responses to be cached so that repeated navigation does not trigger redundant network requests.

#### Acceptance Criteria

1. THE App MAY implement a simple in-memory cache in the service layer that stores responses keyed by endpoint URL.
2. WHEN a cached response exists for a request, THE service SHALL return the cached value without making a network call.
3. THE cache SHALL be invalidated when the user logs out.
