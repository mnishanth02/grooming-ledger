## Product Features from Grooming Ledger PRD

Here is a detailed list of product features extracted from the 'Product Features' section of the Grooming Ledger PRD:

**1. Feature Name:** User Management

- **Feature Description:** Allows administrators (PM/Coordinator) to manage user accounts, assign roles (PM, Coordinator, Assessor, Groomer, Candidate), and control access to different features based on roles.
- **User Stories:**
  - As a **Project Manager**, I want to be able to add new Coordinators, Assessors, and Groomers to the system so that I can manage the team effectively.
  - As a **Coordinator**, I want to be able to add new Candidates to the system so that we can start the grooming process.
  - As an **Administrator**, I want to be able to assign roles to users so that they only have access to the features relevant to their responsibilities.
- **Acceptance Criteria:**
  - Administrators can create, edit, and delete user accounts.
  - Five distinct roles (PM, Coordinator, Assessor, Groomer, Candidate) are available for assignment.
  - Users can log in with their assigned credentials and access features based on their roles.
  - Password management (reset, change) functionality is implemented.
- **Priority:** Must Have

**2. Feature Name:** Candidate Profile Management

- **Feature Description:** Enables creation and management of candidate profiles, including basic information and tracking of their grooming lifecycle.
- **User Stories:**
  - As a **Coordinator**, I want to create a new candidate profile with their name, contact details, and assigned team so that I can initiate the grooming process.
  - As a **Project Manager**, I want to view candidate profiles to understand their assigned team and current grooming status.
- **Acceptance Criteria:**
  - Coordinator can create new candidate profiles with fields for name, contact details, and team.
  - All roles (PM, Coordinator, Assessor, Groomer, Candidate) can view basic candidate profile information relevant to their role.
  - Coordinator can edit candidate profile information if needed.
- **Priority:** Must Have

**3. Feature Name:** Grooming Lifecycle Management

- **Feature Description:** Manages the 15-day grooming lifecycle, tracking stages and candidate progress through each stage.
- **User Stories:**
  - As a **Coordinator**, I want to initiate the grooming lifecycle for a candidate so that the process can begin.
  - As a **Project Manager**, I want to track the current stage of each candidate in their grooming lifecycle to monitor overall progress.
  - As a **Candidate**, I want to see my current stage in the grooming lifecycle to understand where I am in the process.
- **Acceptance Criteria:**
  - Coordinator can initiate the grooming lifecycle for a candidate, setting the start date.
  - The system tracks and displays the current stage of each candidate's grooming lifecycle (Pre-Assessment, Grooming, Post-Assessment, Client Interview).
  - Visual representation of the grooming lifecycle progress is available (e.g., progress bar).
- **Priority:** Must Have

**4. Feature Name:** Grooming Topics Management

- **Feature Description:** Allows authorized users to define and manage grooming topics and subtopics, categorizing them for different aspects of grooming.
- **User Stories:**
  - As a **Project Manager**, I want to add new grooming topics and subtopics so that we can keep the grooming content up-to-date.
  - As an **Assessor**, I want to be able to select relevant topics and subtopics when providing feedback.
  - As a **Candidate**, I want to view the list of grooming topics and subtopics so that I know what I need to learn.
- **Acceptance Criteria:**
  - PM, Coordinator, Assessor, and Groomer roles can add, update, and delete grooming topics and subtopics.
  - Topics and subtopics can be categorized (Assessment Feedback, Generic Topic, Hands-on, Previous Interview Questions).
  - Topics and subtopics can be associated with specific grooming lifecycles or roles, if needed.
  - Candidates can view the list of grooming topics and subtopics.
- **Priority:** Must Have

**5. Feature Name:** Pre and Post Assessment

- **Feature Description:** Facilitates pre and post assessments conducted by Assessors, allowing them to provide structured feedback on candidates.
- **User Stories:**
  - As an **Assessor**, I want to see a list of candidates assigned to me for pre/post assessment so that I know who I need to evaluate.
  - As an **Assessor**, I want to provide feedback on topics and subtopics, rating the candidate and adding comments, so that I can give a clear evaluation.
  - As a **Coordinator**, I want to see the assessment feedback for each candidate so that I can track their progress and next steps.
- **Acceptance Criteria:**
  - Assessors can view a list of candidates assigned to them for pre/post assessments.
  - Assessors can access a feedback form with fields for topic selection, subtopic selection, rating (out of 5), and comments.
  - Assessment feedback is stored and linked to the candidate profile.
  - Candidate status is updated based on post-assessment feedback (Positive/Negative).
  - Coordinators and PMs can view assessment feedback reports for candidates.
- **Priority:** Must Have

**6. Feature Name:** Grooming Progress Tracking

- **Feature Description:** Allows Groomers to track daily grooming progress, topic coverage, and candidate assessment readiness within each topic.
- **User Stories:**
  - As a **Groomer**, I want to update the topics covered with a candidate each day so that we can track grooming progress.
  - As a **Groomer**, I want to indicate whether I have assessed the candidate on a specific topic and add comments on their performance, so that we have a record of their learning.
  - As a **Candidate**, I want to update my topic completion status and readiness for assessment, so that the groomer knows my self-perceived progress.
- **Acceptance Criteria:**
  - Groomers can update topics covered daily for each assigned candidate.
  - Groomers can indicate topic assessment status (Assessed/Not Assessed) and add comments.
  - Candidates can update their topic completion status (Ready for Assessment).
  - Grooming progress information is stored and linked to the candidate profile.
- **Priority:** Must Have

**7. Feature Name:** Interview Question Search (AI-Powered)

- **Feature Description:** Provides a search interface for candidates to find previous client interview questions, leveraging AI for improved search relevance.
- **User Stories:**
  - As a **Candidate**, I want to search for previous interview questions using keywords or topics so that I can prepare for my client interview.
  - As a **Candidate**, I want the search results to be relevant and easy to understand so that I can quickly find the questions I need.
- **Acceptance Criteria:**
  - Candidates can access a search interface for interview questions.
  - The search functionality uses AI to improve search result relevance based on keywords or topics.
  - Search results are displayed in a clear and user-friendly format.
  - The system handles various search queries and provides relevant results.
- **Priority:** Should Have

**8. Feature Name:** Dashboard and Reporting

- **Feature Description:** Provides role-based dashboards for different users to monitor grooming activities, track progress, and generate reports.
- **User Stories:**
  - As a **Project Manager**, I want a dashboard that shows me the overall status of all grooming lifecycles so that I can get a high-level view of progress.
  - As a **Coordinator**, I want reports on candidate progress and assessment outcomes so that I can track operational efficiency.
  - As a **Groomer**, I want a dashboard showing my assigned candidates and their grooming progress so that I can manage my grooming sessions effectively.
- **Acceptance Criteria:**
  - Role-based dashboards are available for PM, Coordinator, Groomer, and Candidate roles, displaying relevant information.
  - Dashboards provide summaries and visualizations of key grooming metrics.
  - Reporting functionality allows users to generate reports on candidate progress, assessment outcomes, and lifecycle metrics.
  - Reports can be exported in common formats (e.g., CSV, Excel).
- **Priority:** Must Have (Basic PM/Coord), Should Have (Groomer/Candidate) - _(Note: Priority is split based on dashboard type as per PRD)_

**9. Feature Name:** Notifications and Communication

- **Feature Description:** Provides automated notifications for key events in the grooming process to keep users informed.
- **User Stories:**
  - As a **Coordinator**, I want to be automatically notified when a new candidate is assigned to me so that I can take action.
  - As an **Assessor**, I want to receive notifications when I am assigned to conduct an assessment for a candidate so that I am aware of my tasks.
  - As a **Candidate**, I want to be notified when my assessment feedback is updated so that I can review it.
- **Acceptance Criteria:**
  - Automated notifications are triggered for role assignments (Assessor, Groomer).
  - Notifications are sent for assessment scheduling (Coordinator to Candidate/Assessor).
  - Notifications are sent when assessment feedback is updated and available for viewing.
  - Users can configure notification preferences (in-app, email).
- **Priority:** Should Have
