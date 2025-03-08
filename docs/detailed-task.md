## Next.js Development Plan for Grooming Ledger Features

Here are the detailed Next.js development plans for each of the provided Grooming Ledger features.

---

### Feature 1: User Management

**Feature Description:** Allows administrators (PM/Coordinator) to manage user accounts, assign roles (PM, Coordinator, Assessor, Groomer, Candidate), and control access to different features based on roles.

**Task List:**

| Task ID | Task Description                                                                                                                                                               | Dependencies        | Estimated Time | Assigned Resources (Optional) |
| :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------ | :------------- | :---------------------------- |
| 1.1     | **Database Schema Design (Drizzle ORM):** Define user table schema in Drizzle ORM, including fields for user roles, credentials, and profile information.                      | None                | 4 hours        | Backend Dev                   |
| 1.2     | **User Model and Drizzle Setup:** Create Drizzle models for User and set up database connection using Neon DB.                                                                 | 1.1                 | 4 hours        | Backend Dev                   |
| 1.3     | **Authentication Implementation (NextAuth.js):** Integrate NextAuth.js for authentication, supporting username/password login and session management.                          | 1.2                 | 1 day          | Full-stack Dev                |
| 1.4     | **Role-Based Access Control (RBAC):** Implement RBAC logic using NextAuth.js session and custom middleware to protect routes and components based on user roles.               | 1.3                 | 1 day          | Full-stack Dev                |
| 1.5     | **User Admin Panel UI (React Components, Shadcn/ui):** Create UI components for user management admin panel (create, edit, delete user forms, user list).                      | 1.4                 | 2 days         | Frontend Dev                  |
| 1.6     | **Create User Server Action:** Implement server action to handle user creation, including input validation and database insertion using Drizzle.                               | 1.5, 1.2            | 1 day          | Full-stack Dev                |
| 1.7     | **Edit User Server Action:** Implement server action to handle user updates, including input validation and database update using Drizzle.                                     | 1.5, 1.2            | 1 day          | Full-stack Dev                |
| 1.8     | **Delete User Server Action:** Implement server action to handle user deletion using Drizzle.                                                                                  | 1.5, 1.2            | 0.5 day        | Full-stack Dev                |
| 1.9     | **List Users Server Component:** Create a server component to fetch and display a list of users for the admin panel.                                                           | 1.2                 | 0.5 day        | Full-stack Dev                |
| 1.10    | **Password Management (Reset/Change):** Implement password reset functionality (using password reset tokens and email) and password change functionality within user settings. | 1.3                 | 1.5 days       | Full-stack Dev                |
| 1.11    | **Testing (Unit & Integration):** Write unit tests for server actions and integration tests for user management functionality.                                                 | 1.6, 1.7, 1.8, 1.10 | 1 day          | QA/Dev                        |

**Task Dependencies:** 1.2 depends on 1.1, 1.3 depends on 1.2, 1.4 depends on 1.3, 1.5 depends on 1.4, 1.6-1.8 depends on 1.5 & 1.2, 1.9 depends on 1.2, 1.10 depends on 1.3, 1.11 depends on 1.6-1.8 & 1.10

**Total Estimated Time:** 14.5 days

**Assigned Resources (Optional):**

- Backend Dev: Tasks 1.1, 1.2
- Frontend Dev: Task 1.5
- Full-stack Dev: Tasks 1.3, 1.4, 1.6, 1.7, 1.8, 1.9, 1.10
- QA/Dev: Task 1.11

**Deployment Considerations (Next.js Specific):**

- **Environment Variables:** Securely manage database credentials, NextAuth.js secrets, and email service API keys using Vercel environment variables.
- **Serverless Functions (Server Actions):** User management operations will be handled by Next.js Server Actions, deployed as serverless functions on Vercel.
- **Database Connection:** Ensure Neon DB connection is properly configured in Vercel environment.

**Data Storage Considerations:**

- **Neon DB (PostgreSQL):** User data, including credentials, roles, and profile information, will be stored in Neon DB. Drizzle ORM will be used for database interactions.

---

### Feature 2: Candidate Profile Management

**Feature Description:** Enables creation and management of candidate profiles, including basic information and tracking of their grooming lifecycle.

**Task List:**

| Task ID | Task Description                                                                                                                                                                                                 | Dependencies                       | Estimated Time | Assigned Resources (Optional) |
| :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------- | :------------- | :---------------------------- |
| 2.1     | **Database Schema Design (Drizzle ORM):** Define candidate profile table schema in Drizzle ORM, including fields for name, contact details, assigned team, and lifecycle status.                                 | None                               | 3 hours        | Backend Dev                   |
| 2.2     | **Candidate Model and Drizzle Setup:** Create Drizzle models for Candidate Profile.                                                                                                                              | 2.1                                | 2 hours        | Backend Dev                   |
| 2.3     | **Candidate Profile Creation UI (React Components, Shadcn/ui):** Create UI form for Coordinator to create new candidate profiles.                                                                                | 1.4 (RBAC - Coordinator role)      | 1 day          | Frontend Dev                  |
| 2.4     | **Create Candidate Profile Server Action:** Implement server action to handle candidate profile creation, including input validation and database insertion using Drizzle.                                       | 2.3, 2.2                           | 1 day          | Full-stack Dev                |
| 2.5     | **View Candidate Profile UI (React Components, Shadcn/ui):** Create UI components to display candidate profile information, accessible to PM, Coordinator, Assessor, Groomer, and Candidate (role-based access). | 1.4, 2.2                           | 1.5 days       | Frontend Dev                  |
| 2.6     | **Get Candidate Profile Server Component:** Create server components to fetch and display candidate profile details based on user role and permissions.                                                          | 2.2                                | 1 day          | Full-stack Dev                |
| 2.7     | **Edit Candidate Profile UI (React Components, Shadcn/ui):** Create UI form for Coordinator to edit candidate profile information.                                                                               | 1.4 (RBAC - Coordinator role), 2.5 | 1 day          | Frontend Dev                  |
| 2.8     | **Edit Candidate Profile Server Action:** Implement server action to handle candidate profile updates, including input validation and database update using Drizzle.                                             | 2.7, 2.2                           | 1 day          | Full-stack Dev                |
| 2.9     | **Testing (Unit & Integration):** Write unit tests for server actions and integration tests for candidate profile management.                                                                                    | 2.4, 2.8                           | 0.5 day        | QA/Dev                        |

**Task Dependencies:** 2.2 depends on 2.1, 2.3 depends on 1.4, 2.4 depends on 2.3 & 2.2, 2.5 depends on 1.4 & 2.2, 2.6 depends on 2.2, 2.7 depends on 1.4 & 2.5, 2.8 depends on 2.7 & 2.2, 2.9 depends on 2.4 & 2.8

**Total Estimated Time:** 9 days

**Assigned Resources (Optional):**

- Backend Dev: Tasks 2.1, 2.2
- Frontend Dev: Tasks 2.3, 2.5, 2.7
- Full-stack Dev: Tasks 2.4, 2.6, 2.8
- QA/Dev: Task 2.9

**Deployment Considerations (Next.js Specific):**

- **Serverless Functions (Server Actions):** Candidate profile operations will be handled by Next.js Server Actions.
- **Data Fetching (Server Components):** Candidate profile data will be fetched in Server Components for efficient rendering.

**Data Storage Considerations:**

- **Neon DB (PostgreSQL):** Candidate profile data will be stored in Neon DB, linked to user accounts where applicable.

---

### Feature 3: Grooming Lifecycle Management

**Feature Description:** Manages the 15-day grooming lifecycle, tracking stages and candidate progress through each stage.

**Task List:**

| Task ID | Task Description                                                                                                                                                                                               | Dependencies | Estimated Time | Assigned Resources (Optional) |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------- | :------------- | :---------------------------- |
| 3.1     | **Database Schema Design (Drizzle ORM):** Define grooming lifecycle table schema, including fields for candidate ID, start date, current stage, and stage history. Define stages as enum.                      | 2.2          | 3 hours        | Backend Dev                   |
| 3.2     | **Lifecycle Model and Drizzle Setup:** Create Drizzle models for Grooming Lifecycle.                                                                                                                           | 3.1          | 2 hours        | Backend Dev                   |
| 3.3     | **Initiate Lifecycle Server Action:** Implement server action for Coordinator to initiate grooming lifecycle for a candidate, setting start date and initial stage (Pre-Assessment).                           | 2.4, 3.2     | 1 day          | Full-stack Dev                |
| 3.4     | **Track Lifecycle Stage Server Action:** Implement server action to update candidate's current lifecycle stage. (Triggered automatically or manually by coordinator).                                          | 3.2          | 1 day          | Full-stack Dev                |
| 3.5     | **View Lifecycle Progress UI (React Components, Shadcn/ui):** Create UI component to display candidate's current stage and overall lifecycle progress (e.g., progress bar) for PM, Coordinator, and Candidate. | 2.5, 3.2     | 1.5 days       | Frontend Dev                  |
| 3.6     | **Get Lifecycle Progress Server Component:** Create server component to fetch and provide lifecycle progress data for display.                                                                                 | 3.2          | 0.5 day        | Full-stack Dev                |
| 3.7     | **Lifecycle Admin Panel UI (React Components, Shadcn/ui):** (Optional) Create admin UI for managing and visualizing all candidate lifecycles for PM/Coordinator.                                               | 3.5          | 1 day          | Frontend Dev                  |
| 3.8     | **Testing (Unit & Integration):** Write unit tests for server actions and integration tests for lifecycle management.                                                                                          | 3.3, 3.4     | 0.5 day        | QA/Dev                        |

**Task Dependencies:** 3.2 depends on 3.1 & 2.2, 3.3 depends on 2.4 & 3.2, 3.4 depends on 3.2, 3.5 depends on 2.5 & 3.2, 3.6 depends on 3.2, 3.7 depends on 3.5, 3.8 depends on 3.3 & 3.4

**Total Estimated Time:** 7.5 days (+ 1 day optional for admin panel)

**Assigned Resources (Optional):**

- Backend Dev: Tasks 3.1, 3.2
- Frontend Dev: Tasks 3.5, 3.7
- Full-stack Dev: Tasks 3.3, 3.4, 3.6
- QA/Dev: Task 3.8

**Deployment Considerations (Next.js Specific):**

- **Serverless Functions (Server Actions):** Lifecycle initiation and updates will be handled by Server Actions.
- **Real-time Updates (Optional):** For dynamic progress updates, consider using WebSockets or Server-Sent Events with Next.js API routes, if needed for a more real-time feel in the future, but for now, simple server component refresh will suffice.

**Data Storage Considerations:**

- **Neon DB (PostgreSQL):** Grooming lifecycle data will be stored in Neon DB, linked to candidate profiles.

---

### Feature 4: Grooming Topics Management

**Feature Description:** Allows authorized users to define and manage grooming topics and subtopics, categorizing them for different aspects of grooming.

**Task List:**

| Task ID | Task Description                                                                                                                                                                                                                | Dependencies                                       | Estimated Time | Assigned Resources (Optional) |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------- | :------------- | :---------------------------- |
| 4.1     | **Database Schema Design (Drizzle ORM):** Define grooming topics and subtopics table schemas, including fields for topic name, description, category, and parent-child relationship (for subtopics). Define categories as enum. | None                                               | 4 hours        | Backend Dev                   |
| 4.2     | **Topic & Subtopic Models and Drizzle Setup:** Create Drizzle models for Grooming Topic and Subtopic.                                                                                                                           | 4.1                                                | 3 hours        | Backend Dev                   |
| 4.3     | **Topic Management Admin UI (React Components, Shadcn/ui):** Create UI components for admin panel to manage topics and subtopics (create, edit, delete forms, topic/subtopic list, categorization).                             | 1.4 (RBAC - PM/Coordinator/Assessor/Groomer roles) | 2 days         | Frontend Dev                  |
| 4.4     | **Create Topic Server Action:** Implement server action to handle topic creation, including input validation and database insertion using Drizzle.                                                                              | 4.3, 4.2                                           | 1 day          | Full-stack Dev                |
| 4.5     | **Edit Topic Server Action:** Implement server action to handle topic updates.                                                                                                                                                  | 4.3, 4.2                                           | 1 day          | Full-stack Dev                |
| 4.6     | **Delete Topic Server Action:** Implement server action to handle topic deletion.                                                                                                                                               | 4.3, 4.2                                           | 0.5 day        | Full-stack Dev                |
| 4.7     | **Create Subtopic Server Action:** Implement server action to handle subtopic creation.                                                                                                                                         | 4.3, 4.2                                           | 1 day          | Full-stack Dev                |
| 4.8     | **Edit Subtopic Server Action:** Implement server action to handle subtopic updates.                                                                                                                                            | 4.3, 4.2                                           | 1 day          | Full-stack Dev                |
| 4.9     | **Delete Subtopic Server Action:** Implement server action to handle subtopic deletion.                                                                                                                                         | 4.3, 4.2                                           | 0.5 day        | Full-stack Dev                |
| 4.10    | **List Topics and Subtopics Server Component:** Create server component to fetch and display lists of topics and subtopics, potentially with filtering and categorization.                                                      | 4.2                                                | 1 day          | Full-stack Dev                |
| 4.11    | **Topic/Subtopic Selection Components (React Components, Shadcn/ui):** Create reusable components for selecting topics and subtopics (e.g., dropdowns, checkboxes) for use in assessment and progress tracking features.        | 4.10                                               | 1 day          | Frontend Dev                  |
| 4.12    | **Testing (Unit & Integration):** Write unit tests for server actions and integration tests for topic management.                                                                                                               | 4.4-4.9                                            | 1 day          | QA/Dev                        |

**Task Dependencies:** 4.2 depends on 4.1, 4.3 depends on 1.4, 4.4-4.9 depends on 4.3 & 4.2, 4.10 depends on 4.2, 4.11 depends on 4.10, 4.12 depends on 4.4-4.9

**Total Estimated Time:** 13 days

**Assigned Resources (Optional):**

- Backend Dev: Tasks 4.1, 4.2
- Frontend Dev: Tasks 4.3, 4.11
- Full-stack Dev: Tasks 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10
- QA/Dev: Task 4.12

**Deployment Considerations (Next.js Specific):**

- **Serverless Functions (Server Actions):** Topic management operations will be handled by Server Actions.
- **Data Caching (Server Components):** Consider caching topic and subtopic lists in Server Components for improved performance if the data is not frequently updated.

**Data Storage Considerations:**

- **Neon DB (PostgreSQL):** Grooming topic and subtopic data will be stored in Neon DB.

---

### Feature 5: Pre and Post Assessment

**Feature Description:** Facilitates pre and post assessments conducted by Assessors, allowing them to provide structured feedback on candidates.

**Task List:**

| Task ID | Task Description                                                                                                                                                                                                                                                             | Dependencies                           | Estimated Time | Assigned Resources (Optional) |
| :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------- | :------------- | :---------------------------- |
| 5.1     | **Database Schema Design (Drizzle ORM):** Define assessment table schema, including fields for assessor ID, candidate ID, assessment type (pre/post), topic ID, subtopic ID, rating, comments, and timestamp.                                                                | 2.2, 4.2                               | 4 hours        | Backend Dev                   |
| 5.2     | **Assessment Model and Drizzle Setup:** Create Drizzle models for Assessment.                                                                                                                                                                                                | 5.1                                    | 2 hours        | Backend Dev                   |
| 5.3     | **Assessor Candidate List UI (React Components, Shadcn/ui):** Create UI to display a list of candidates assigned to the logged-in Assessor for assessment.                                                                                                                   | 1.4 (RBAC - Assessor role), 2.5        | 1 day          | Frontend Dev                  |
| 5.4     | **Get Assessor Candidate List Server Component:** Create server component to fetch and filter candidates assigned to the assessor.                                                                                                                                           | 5.2, 2.6, 1.4                          | 1 day          | Full-stack Dev                |
| 5.5     | **Assessment Feedback Form UI (React Components, Shadcn/ui):** Create feedback form with topic/subtopic selection (using components from 4.11), rating input, and comments textarea.                                                                                         | 4.11                                   | 1.5 days       | Frontend Dev                  |
| 5.6     | **Submit Assessment Feedback Server Action:** Implement server action to handle submission of assessment feedback, including data validation and database insertion using Drizzle.                                                                                           | 5.5, 5.2, 4.2, 2.2                     | 1 day          | Full-stack Dev                |
| 5.7     | **View Assessment Feedback UI (React Components, Shadcn/ui):** Create UI to display assessment feedback for a candidate, accessible to Coordinator and PM.                                                                                                                   | 1.4 (RBAC - Coordinator/PM roles), 5.2 | 1 day          | Frontend Dev                  |
| 5.8     | **Get Assessment Feedback Server Component:** Create server component to fetch and display assessment feedback for a given candidate.                                                                                                                                        | 5.2, 2.6, 1.4                          | 0.5 day        | Full-stack Dev                |
| 5.9     | **Update Candidate Status (Post-Assessment):** Implement logic within the "Submit Assessment Feedback" server action to update candidate status based on post-assessment feedback (Positive/Negative). This might involve updating the candidate profile or lifecycle stage. | 5.6, 3.4, 2.8                          | 1 day          | Full-stack Dev                |
| 5.10    | **Testing (Unit & Integration):** Write unit tests for server actions and integration tests for assessment functionality.                                                                                                                                                    | 5.6, 5.9                               | 1 day          | QA/Dev                        |

**Task Dependencies:** 5.2 depends on 5.1 & 2.2 & 4.2, 5.3 depends on 1.4 & 2.5, 5.4 depends on 5.2 & 2.6 & 1.4, 5.5 depends on 4.11, 5.6 depends on 5.5 & 5.2 & 4.2 & 2.2, 5.7 depends on 1.4 & 5.2, 5.8 depends on 5.2 & 2.6 & 1.4, 5.9 depends on 5.6 & 3.4 & 2.8, 5.10 depends on 5.6 & 5.9

**Total Estimated Time:** 10 days

**Assigned Resources (Optional):**

- Backend Dev: Tasks 5.1, 5.2
- Frontend Dev: Tasks 5.3, 5.5, 5.7
- Full-stack Dev: Tasks 5.4, 5.6, 5.8, 5.9
- QA/Dev: Task 5.10

**Deployment Considerations (Next.js Specific):**

- **Serverless Functions (Server Actions):** Assessment submission and retrieval will be handled by Server Actions.
- **Form Handling (Server Actions):** Utilize Server Actions for secure and efficient form handling in the assessment feedback form.

**Data Storage Considerations:**

- **Neon DB (PostgreSQL):** Assessment data, including feedback and ratings, will be stored in Neon DB, linked to candidate profiles and grooming topics.

---

### Feature 6: Grooming Progress Tracking

**Feature Description:** Allows Groomers to track daily grooming progress, topic coverage, and candidate assessment readiness within each topic.

**Task List:**

| Task ID | Task Description                                                                                                                                                                                                                         | Dependencies                                | Estimated Time | Assigned Resources (Optional) |
| :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------ | :------------- | :---------------------------- |
| 6.1     | **Database Schema Design (Drizzle ORM):** Define grooming progress table schema, including fields for groomer ID, candidate ID, topic ID, date, assessment status (Assessed/Not Assessed), groomer comments, candidate readiness status. | 2.2, 4.2                                    | 4 hours        | Backend Dev                   |
| 6.2     | **Progress Model and Drizzle Setup:** Create Drizzle models for Grooming Progress.                                                                                                                                                       | 6.1                                         | 2 hours        | Backend Dev                   |
| 6.3     | **Groomer Candidate List UI (React Components, Shadcn/ui):** Create UI to display a list of candidates assigned to the logged-in Groomer.                                                                                                | 1.4 (RBAC - Groomer role), 2.5              | 1 day          | Frontend Dev                  |
| 6.4     | **Get Groomer Candidate List Server Component:** Create server component to fetch and filter candidates assigned to the groomer.                                                                                                         | 6.2, 2.6, 1.4                               | 1 day          | Full-stack Dev                |
| 6.5     | **Grooming Progress Form UI (React Components, Shadcn/ui):** Create UI form for Groomers to update topics covered daily, indicate assessment status, and add comments for each candidate. Use topic selection components from 4.11.      | 4.11, 6.3                                   | 2 days         | Frontend Dev                  |
| 6.6     | **Update Grooming Progress Server Action:** Implement server action to handle updates to grooming progress, including data validation and database insertion/update using Drizzle.                                                       | 6.5, 6.2, 4.2, 2.2                          | 1.5 days       | Full-stack Dev                |
| 6.7     | **Candidate Topic Completion Status UI (React Components, Shadcn/ui):** Create UI for Candidates to update their topic completion status (Ready for Assessment).                                                                         | 1.4 (RBAC - Candidate role), 4.11           | 1 day          | Frontend Dev                  |
| 6.8     | **Update Candidate Readiness Server Action:** Implement server action for candidates to update their topic readiness.                                                                                                                    | 6.7, 6.2, 4.2, 2.2                          | 1 day          | Full-stack Dev                |
| 6.9     | **View Grooming Progress UI (React Components, Shadcn/ui):** Create UI to display grooming progress for Groomers and Coordinators.                                                                                                       | 1.4 (RBAC - Groomer/Coordinator roles), 6.2 | 1.5 days       | Frontend Dev                  |
| 6.10    | **Get Grooming Progress Data Server Component:** Create server component to fetch and display grooming progress data.                                                                                                                    | 6.2, 2.6, 1.4                               | 0.5 day        | Full-stack Dev                |
| 6.11    | **Testing (Unit & Integration):** Write unit tests for server actions and integration tests for progress tracking.                                                                                                                       | 6.6, 6.8                                    | 1 day          | QA/Dev                        |

**Task Dependencies:** 6.2 depends on 6.1 & 2.2 & 4.2, 6.3 depends on 1.4 & 2.5, 6.4 depends on 6.2 & 2.6 & 1.4, 6.5 depends on 4.11 & 6.3, 6.6 depends on 6.5 & 6.2 & 4.2 & 2.2, 6.7 depends on 1.4 & 4.11, 6.8 depends on 6.7 & 6.2 & 4.2 & 2.2, 6.9 depends on 1.4 & 6.2, 6.10 depends on 6.2 & 2.6 & 1.4, 6.11 depends on 6.6 & 6.8

**Total Estimated Time:** 12 days

**Assigned Resources (Optional):**

- Backend Dev: Tasks 6.1, 6.2
- Frontend Dev: Tasks 6.3, 6.5, 6.7, 6.9
- Full-stack Dev: Tasks 6.4, 6.6, 6.8, 6.10
- QA/Dev: Task 6.11

**Deployment Considerations (Next.js Specific):**

- **Serverless Functions (Server Actions):** Progress updates and retrieval will be handled by Server Actions.
- **Optimistic Updates (UI):** Consider implementing optimistic updates in the UI for a smoother user experience when Groomers and Candidates update progress.

**Data Storage Considerations:**

- **Neon DB (PostgreSQL):** Grooming progress data will be stored in Neon DB, linked to candidate profiles, groomers, and grooming topics.

---

### Feature 7: Interview Question Search (AI-Powered)

**Feature Description:** Provides a search interface for candidates to find previous client interview questions, leveraging AI for improved search relevance.

**Task List:**

| Task ID | Task Description                                                                                                                                                                                                                                                                                                                     | Dependencies                | Estimated Time | Assigned Resources (Optional) |
| :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------- | :------------- | :---------------------------- |
| 7.1     | **Database Schema Design (Drizzle ORM):** Define interview question table schema, including fields for question text, topics, and potentially metadata for AI indexing.                                                                                                                                                              | 4.2                         | 3 hours        | Backend Dev                   |
| 7.2     | **Interview Question Model and Drizzle Setup:** Create Drizzle models for Interview Question.                                                                                                                                                                                                                                        | 7.1                         | 2 hours        | Backend Dev                   |
| 7.3     | **Seed Interview Questions Data:** (Initial data population) Prepare and seed initial interview question data into the database.                                                                                                                                                                                                     | 7.2                         | 1 day          | Data Entry/Backend Dev        |
| 7.4     | **Interview Question Search UI (React Components, Shadcn/ui):** Create search bar and results display UI for Candidates to search interview questions.                                                                                                                                                                               | 1.4 (RBAC - Candidate role) | 1.5 days       | Frontend Dev                  |
| 7.5     | **AI-Powered Search Implementation (Server Action):** Integrate an AI-powered search service (e.g., using a vector database or a cloud AI service like OpenAI Embeddings + Pinecone/Weaviate or similar). Implement a server action to handle search queries, interact with the AI service, and return relevant interview questions. | 7.2                         | 3 days         | AI/Backend Dev                |
| 7.6     | **Get Search Results Server Component:** Create server component to fetch and display search results from the server action.                                                                                                                                                                                                         | 7.5                         | 0.5 day        | Full-stack Dev                |
| 7.7     | **Search Result Display UI (React Components, Shadcn/ui):** Design and implement UI for displaying search results in a user-friendly format.                                                                                                                                                                                         | 7.6, 7.4                    | 1 day          | Frontend Dev                  |
| 7.8     | **Testing (Unit & Integration):** Write unit tests for search server action and integration tests for search functionality.                                                                                                                                                                                                          | 7.5                         | 1 day          | QA/Dev                        |

**Task Dependencies:** 7.2 depends on 7.1, 7.3 depends on 7.2, 7.4 depends on 1.4, 7.5 depends on 7.2, 7.6 depends on 7.5, 7.7 depends on 7.6 & 7.4, 7.8 depends on 7.5

**Total Estimated Time:** 10.5 days

**Assigned Resources (Optional):**

- Backend Dev: Tasks 7.1, 7.2, 7.3
- Frontend Dev: Tasks 7.4, 7.7
- AI/Backend Dev: Task 7.5
- Full-stack Dev: Task 7.6
- QA/Dev: Task 7.8
- Data Entry: Task 7.3 (initial data seeding)

**Deployment Considerations (Next.js Specific):**

- **Serverless Functions (Server Actions):** Search queries and AI interaction will be handled by Server Actions.
- **API Keys Management:** Securely manage API keys for the AI service using Vercel environment variables.
- **AI Service Deployment:** Consider the deployment and scalability of the chosen AI search service.

**Data Storage Considerations:**

- **Neon DB (PostgreSQL):** Interview question data will be stored in Neon DB.
- **Vector Database (Optional):** If using vector embeddings for semantic search, consider a dedicated vector database (like Pinecone or Weaviate) for efficient vector storage and querying.

---

### Feature 8: Dashboard and Reporting

**Feature Description:** Provides role-based dashboards for different users to monitor grooming activities, track progress, and generate reports.

**Task List:**

| Task ID | Task Description                                                                                                                                                                                                  | Dependencies                 | Estimated Time | Assigned Resources (Optional) |
| :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------- | :------------- | :---------------------------- |
| 8.1     | **Dashboard Data Requirements Analysis:** Define data points and metrics required for each role-based dashboard (PM, Coordinator, Groomer, Candidate).                                                            | 1.2, 2.2, 3.2, 5.2, 6.2      | 1 day          | Business Analyst/PM           |
| 8.2     | **Dashboard UI Design (React Components, Shadcn/ui):** Design UI layouts and components for each role-based dashboard, including charts, graphs, and summary widgets.                                             | 8.1                          | 2 days         | UI/UX Designer/Frontend Dev   |
| 8.3     | **PM Dashboard Implementation (React Components, Shadcn/ui):** Implement PM dashboard, displaying overall grooming lifecycle status, key metrics, and summaries. Fetch data using server components.              | 8.2, 1.2, 2.2, 3.2, 5.2, 6.2 | 2 days         | Frontend Dev/Full-stack Dev   |
| 8.4     | **Coordinator Dashboard Implementation (React Components, Shadcn/ui):** Implement Coordinator dashboard, displaying candidate progress, assessment outcomes, and operational efficiency metrics.                  | 8.2, 1.2, 2.2, 3.2, 5.2, 6.2 | 2 days         | Frontend Dev/Full-stack Dev   |
| 8.5     | **Groomer Dashboard Implementation (React Components, Shadcn/ui):** Implement Groomer dashboard, showing assigned candidates and their grooming progress.                                                         | 8.2, 1.2, 2.2, 6.2           | 1.5 days       | Frontend Dev/Full-stack Dev   |
| 8.6     | **Candidate Dashboard Implementation (React Components, Shadcn/ui):** Implement Candidate dashboard, showing their own lifecycle stage and progress.                                                              | 8.2, 1.4, 2.2, 3.2, 6.2      | 1 day          | Frontend Dev/Full-stack Dev   |
| 8.7     | **Reporting Functionality (Server Actions):** Implement server actions to generate reports on candidate progress, assessment outcomes, and lifecycle metrics. Define report parameters and data extraction logic. | 1.2, 2.2, 3.2, 5.2, 6.2      | 2 days         | Full-stack Dev                |
| 8.8     | **Report Export Functionality (Server Action):** Implement server action to export generated reports in CSV or Excel formats.                                                                                     | 8.7                          | 1 day          | Full-stack Dev                |
| 8.9     | **Report UI (React Components, Shadcn/ui):** Create UI to trigger report generation and download reports.                                                                                                         | 8.7, 8.8                     | 1 day          | Frontend Dev                  |
| 8.10    | **Testing (Unit & Integration):** Write tests for dashboard data fetching and reporting functionality.                                                                                                            | 8.3-8.8                      | 1 day          | QA/Dev                        |

**Task Dependencies:** 8.2 depends on 8.1, 8.3-8.6 depends on 8.2 & data features (1.2, 2.2, 3.2, 5.2, 6.2), 8.7 depends on data features, 8.8 depends on 8.7, 8.9 depends on 8.7 & 8.8, 8.10 depends on 8.3-8.8

**Total Estimated Time:** 14.5 days

**Assigned Resources (Optional):**

- Business Analyst/PM: Task 8.1
- UI/UX Designer/Frontend Dev: Task 8.2
- Frontend Dev/Full-stack Dev: Tasks 8.3, 8.4, 8.5, 8.6, 8.9
- Full-stack Dev: Tasks 8.7, 8.8
- QA/Dev: Task 8.10

**Deployment Considerations (Next.js Specific):**

- **Server Components for Dashboards:** Dashboards will be implemented using Server Components for efficient data fetching and rendering.
- **Serverless Functions (Server Actions):** Report generation and export will be handled by Server Actions.
- **Data Aggregation (Server-side):** Data aggregation and calculations for dashboards and reports will be performed server-side in Next.js.

**Data Storage Considerations:**

- **Neon DB (PostgreSQL):** Dashboard and reporting data will be retrieved from Neon DB.

---

### Feature 9: Notifications and Communication

**Feature Description:** Provides automated notifications for key events in the grooming process to keep users informed.

**Task List:**

| Task ID | Task Description                                                                                                                                                                                                                                                                     | Dependencies  | Estimated Time | Assigned Resources (Optional) |
| :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------ | :------------- | :---------------------------- |
| 9.1     | **Notification System Design:** Define notification events (role assignments, assessment scheduling, feedback updates), notification types (in-app, email), and user notification preferences.                                                                                       | 1.2, 2.2, 5.2 | 1 day          | Backend Dev/PM                |
| 9.2     | **Database Schema Design (Drizzle ORM):** Define notification table schema, including fields for user ID, notification type, event details, timestamp, read status, and delivery method.                                                                                             | 9.1, 1.2      | 3 hours        | Backend Dev                   |
| 9.3     | **Notification Model and Drizzle Setup:** Create Drizzle models for Notification.                                                                                                                                                                                                    | 9.2           | 2 hours        | Backend Dev                   |
| 9.4     | **Notification Service Implementation (Server Actions/API Routes):** Implement a notification service using Server Actions or dedicated API routes to handle sending notifications (in-app and email). For email, integrate with an email service provider (e.g., SendGrid, Resend). | 9.3, 1.3      | 3 days         | Backend Dev/Full-stack Dev    |
| 9.5     | **Role Assignment Notification Trigger:** Implement logic to trigger notifications when roles are assigned to users (using Server Actions in User Management feature - Feature 1).                                                                                                   | 1.6, 1.7, 9.4 | 1 day          | Full-stack Dev                |
| 9.6     | **Assessment Scheduling Notification Trigger:** Implement logic to trigger notifications for assessment scheduling (requires assessment scheduling functionality, if separate from pre/post assessment in Feature 5, else trigger on assessment creation).                           | 5.6, 9.4      | 1 day          | Full-stack Dev                |
| 9.7     | **Feedback Update Notification Trigger:** Implement logic to trigger notifications when assessment feedback is updated (using Server Actions in Assessment feature - Feature 5).                                                                                                     | 5.6, 9.4      | 1 day          | Full-stack Dev                |
| 9.8     | **In-App Notification UI (React Components, Shadcn/ui):** Create UI component to display in-app notifications (e.g., notification bell icon, notification list).                                                                                                                     | 1.4           | 1.5 days       | Frontend Dev                  |
| 9.9     | **Get In-App Notifications Server Component:** Create server component to fetch and display in-app notifications for the logged-in user.                                                                                                                                             | 9.3, 1.4      | 0.5 day        | Full-stack Dev                |
| 9.10    | **Notification Preferences UI (React Components, Shadcn/ui):** (Optional) Create UI for users to configure notification preferences (in-app, email).                                                                                                                                 | 1.4           | 1 day          | Frontend Dev                  |
| 9.11    | **Testing (Unit & Integration):** Write unit tests for notification service and integration tests for notification triggers.                                                                                                                                                         | 9.4-9.7       | 1 day          | QA/Dev                        |

**Task Dependencies:** 9.2 depends on 9.1 & 1.2, 9.3 depends on 9.2, 9.4 depends on 9.3 & 1.3, 9.5 depends on 1.6 & 1.7 & 9.4, 9.6 depends on 5.6 & 9.4, 9.7 depends on 5.6 & 9.4, 9.8 depends on 1.4, 9.9 depends on 9.3 & 1.4, 9.10 depends on 1.4, 9.11 depends on 9.4-9.7

**Total Estimated Time:** 12 days (+ 1 day optional for notification preferences UI)

**Assigned Resources (Optional):**

- Backend Dev/PM: Task 9.1
- Backend Dev: Tasks 9.2, 9.3, 9.4
- Frontend Dev: Tasks 9.8, 9.10
- Full-stack Dev: Tasks 9.5, 9.6, 9.7, 9.9
- QA/Dev: Task 9.11

**Deployment Considerations (Next.js Specific):**

- **Serverless Functions (Server Actions/API Routes):** Notification sending logic will be handled by Server Actions or API routes.
- **Email Service Integration:** Configure and secure API keys for the chosen email service provider in Vercel environment variables.
- **Background Tasks (Optional):** For more robust email sending, consider using a background task queue (e.g., BullMQ, if needed for higher volume or reliability in the future, but initial implementation can be directly within server actions).

**Data Storage Considerations:**

- **Neon DB (PostgreSQL):** Notification data, including notification content and user preferences, will be stored in Neon DB.

---
