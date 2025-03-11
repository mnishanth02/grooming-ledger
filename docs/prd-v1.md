## Product Requirements Document: Grooming Ledger

**1. Introduction**

**1.1. Purpose:**

This document outlines the requirements for the Grooming Ledger, a web-based application designed to streamline and manage the candidate grooming process within the company. The Grooming Ledger will provide a centralized platform to track candidate progress, facilitate communication between Project Managers, Coordinators, Assessors, Groomers, and Candidates, and ensure a structured and efficient grooming lifecycle. This system aims to improve candidate readiness for client interviews and ultimately increase the success rate of candidate placements.

**1.2. Scope:**

The Grooming Ledger will encompass the entire candidate grooming lifecycle, from initial profile creation to final client interview outcomes.

**Included:**

- User management and role-based access for Project Managers, Coordinators, Assessors, Groomers, and Candidates.
- Candidate profile creation and management.
- Grooming lifecycle management, including initiation and tracking.
- Pre and Post Assessment functionality for Assessors with feedback capture.
- Grooming topic management and assignment.
- Groomer topic tracking and progress updates.
- Candidate self-service features to view progress, topics, and feedback.
- Reporting and dashboard functionalities for PMs and Coordinators.
- AI-powered search for previous interview questions.

**Excluded:**

- Direct integration with external calendar systems for scheduling meetings (meeting scheduling is mentioned but not calendar integration).
- Payroll or HR system integrations (unless explicitly requested later as future considerations).
- Detailed content for grooming topics (the system will manage topics, not provide the learning material itself).
- Video conferencing or communication tools within the platform (communication is assumed to happen via other channels, with updates in the system).

**1.3. Goals:**

**Business Goals:**

- **Improve Candidate Quality:** Enhance the effectiveness of the grooming process, leading to better-prepared candidates for client interviews.
- **Increase Client Interview Success Rate:** By systematically tracking and addressing candidate skill gaps, increase the likelihood of candidates clearing client interviews.
- **Optimize Grooming Efficiency:** Streamline the grooming process, reduce administrative overhead, and improve communication and collaboration among stakeholders.
- **Data-Driven Insights:** Provide data and reports on grooming effectiveness to identify areas for process improvement and resource allocation.
- **Reduce Candidate Turnover:** By providing structured grooming and clear expectations, reduce candidate attrition during the grooming phase.

**User Goals:**

- **Project Manager:** Easily monitor the overall grooming process, track candidate progress, and manage team resources effectively.
- **Coordinator:** Efficiently manage candidate grooming lifecycles, assign resources, schedule assessments, and generate reports.
- **Assessor:** Conduct standardized assessments, provide structured feedback, and contribute to informed decisions about candidate readiness.
- **Groomer:** Effectively guide candidates through the grooming process, track topic coverage, and provide targeted support.
- **Candidate:** Understand grooming expectations, track progress, access learning resources, and receive constructive feedback to improve skills.

**2. Target Audience**

**2.1. User Personas:**

- **Persona 1: Project Manager (PM) - "Process Overseer"**

  - **Demographics:** Experienced project manager, responsible for multiple grooming cycles and team performance.
  - **Needs:** High-level overview of all ongoing grooming activities, ability to track key metrics, identify bottlenecks, manage team workload, and generate reports for management.
  - **Pain Points:** Lack of visibility across grooming processes, difficulty in tracking candidate progress, manual reporting, inefficient resource allocation.
  - **Goals in Grooming Ledger:** Efficiently monitor all grooming lifecycles, identify successful and struggling candidates early, and optimize resource allocation.

- **Persona 2: Coordinator - "Operations Hub"**

  - **Demographics:** Detail-oriented individual, responsible for the daily operations of the grooming process.
  - **Needs:** Tools to manage candidate profiles, schedule assessments, assign groomers and assessors, track progress at a granular level, communicate with stakeholders, and generate operational reports.
  - **Pain Points:** Manual scheduling and assignment processes, scattered information across emails and documents, lack of a central system to track progress, time-consuming report generation.
  - **Goals in Grooming Ledger:** Streamline scheduling and assignment, centralize all grooming information, automate reporting, and improve communication efficiency.

- **Persona 3: Assessor - "Skill Evaluator"**

  - **Demographics:** Subject matter expert, responsible for evaluating candidate skills through pre and post assessments.
  - **Needs:** Standardized assessment templates, easy-to-use feedback forms, clear assignment notifications, and a system to track assessment history and feedback.
  - **Pain Points:** Inconsistent assessment processes, cumbersome feedback methods, difficulty in accessing candidate information quickly, lack of a historical view of assessments.
  - **Goals in Grooming Ledger:** Conduct consistent and efficient assessments, provide structured and impactful feedback, easily access candidate information, and contribute to accurate candidate evaluation.

- **Persona 4: Groomer - "Skill Developer"**

  - **Demographics:** Experienced trainer or mentor, responsible for guiding candidates through the grooming process and developing their skills.
  - **Needs:** Clear grooming topic guidelines, tools to track topic coverage, a platform to provide progress updates and feedback, and a way to communicate candidate readiness for assessment.
  - **Pain Points:** Lack of a structured way to track grooming progress, difficulty in communicating progress effectively, inconsistent topic coverage, and limited visibility into candidate strengths and weaknesses.
  - **Goals in Grooming Ledger:** Effectively manage grooming sessions, track topic coverage systematically, provide timely feedback, and clearly communicate candidate progress and readiness.

- **Persona 5: Candidate - "Skill Seeker"**
  - **Demographics:** Individuals undergoing grooming to enhance their skills for client interviews.
  - **Needs:** Clear understanding of grooming topics, access to learning resources (interview questions), visibility into their progress, feedback from assessors and groomers, and clarity on the next steps.
  - **Pain Points:** Lack of clarity on grooming expectations, difficulty accessing relevant learning materials, limited visibility into progress, and inconsistent feedback.
  - **Goals in Grooming Ledger:** Understand grooming expectations, easily access learning resources, track personal progress, receive clear and constructive feedback, and prepare effectively for client interviews.

**2.2. Market Analysis:** (Internal Tool - Less Applicable in the traditional sense)

While not a public-facing product, the "market" here is the internal need to improve the efficiency and effectiveness of the candidate grooming process within the company. The current state likely involves manual tracking, spreadsheets, emails, and inconsistent communication. The Grooming Ledger addresses this internal "market" need by providing a centralized, structured, and data-driven solution. Success will be measured by internal adoption, improved grooming outcomes, and positive feedback from users.

**3. Product Features**

**3.1. Feature List:**

1.  **User Management:**

    - Role-based access control (PM, Coordinator, Assessor, Groomer, Candidate).
    - User profile creation, management, and deletion.
    - User role assignment.

2.  **Candidate Profile Management:**

    - Create new candidate profiles.
    - View and edit candidate information (name, contact details, team, assigned roles).
    - Track candidate grooming lifecycle status.

3.  **Grooming Lifecycle Management:**

    - Initiate grooming lifecycle for a candidate.
    - Define grooming lifecycle period (15 days).
    - Track lifecycle stages (Pre-Assessment, Grooming, Post-Assessment, Client Interview).
    - Visualize candidate progress through the lifecycle.

4.  **Grooming Topics Management:**

    - Admin (PM/Coordinator/Assessor/Groomer) can add, update, and delete grooming topics and subtopics.
    - Categorize topics (Assessment Feedback, Generic Topic, Hands-on, Previous Interview Questions).
    - Ability to assign topics to specific grooming lifecycles or roles.

5.  **Pre and Post Assessment:**

    - Assessor assignment to candidates.
    - Assessor to view assigned candidates for pre/post assessment.
    - Standardized feedback form for Assessors:
      - Topic selection.
      - Subtopic selection.
      - Rating (out of 5).
      - Comments.
    - Update candidate status based on assessment feedback (Positive/Negative).
    - Record assessment history and feedback.

6.  **Grooming Progress Tracking:**

    - Groomer assignment to candidates.
    - Groomer to update daily topics covered for assigned candidates.
    - Groomer to indicate topic assessment status (Assessed/Not Assessed).
    - Groomer comments on topic progress.
    - Candidate self-update on topic completion status.

7.  **Interview Question Search (AI-Powered):**

    - Central repository for previous client interview questions.
    - AI-powered search functionality to find relevant interview questions based on keywords or topics.
    - Display search results in a user-friendly format.

8.  **Dashboard and Reporting:**

    - **PM Dashboard:** Overview of all grooming lifecycles, candidate status summaries, team performance metrics.
    - **Coordinator Dashboard:** Candidate grooming lifecycle management, assignment overviews, reporting on candidate progress and assessment status.
    - **Groomer Dashboard:** List of assigned candidates, grooming progress tracking, and assessment status.
    - **Candidate Dashboard:** Team details, assigned roles, grooming lifecycle overview, topic list, feedback view, and interview question search.
    - Generate reports on candidate progress, assessment outcomes, and grooming lifecycle metrics (e.g., time spent in each stage).

9.  **Notifications and Communication:**
    - Automated notifications for role assignments (Assessor, Groomer).
    - Notifications for assessment scheduling (Coordinator to Candidate/Assessor).
    - In-app notifications and/or email notifications for important updates (e.g., feedback updates).

**3.2. Feature Descriptions:**

**3.2.1. User Management:**

- **Functionality:** Allows administrators (PM/Coordinator) to manage user accounts, assign roles (PM, Coordinator, Assessor, Groomer, Candidate), and control access to different features based on roles.
- **User Stories:**
  - As a **Project Manager**, I want to be able to add new Coordinators, Assessors, and Groomers to the system so that I can manage the team effectively.
  - As a **Coordinator**, I want to be able to add new Candidates to the system so that we can start the grooming process.
  - As an **Administrator**, I want to be able to assign roles to users so that they only have access to the features relevant to their responsibilities.
- **Acceptance Criteria:**
  - Administrators can create, edit, and delete user accounts.
  - Five distinct roles (PM, Coordinator, Assessor, Groomer, Candidate) are available for assignment.
  - Users can log in with their assigned credentials and access features based on their roles.
  - Password management (reset, change) functionality is implemented.

**3.2.2. Candidate Profile Management:**

- **Functionality:** Enables creation and management of candidate profiles, including basic information and tracking of their grooming lifecycle.
- **User Stories:**
  - As a **Coordinator**, I want to create a new candidate profile with their name, contact details, and assigned team so that I can initiate the grooming process.
  - As a **Project Manager**, I want to view candidate profiles to understand their assigned team and current grooming status.
- **Acceptance Criteria:**
  - Coordinator can create new candidate profiles with fields for name, contact details, and team.
  - All roles (PM, Coordinator, Assessor, Groomer, Candidate) can view basic candidate profile information relevant to their role.
  - Coordinator can edit candidate profile information if needed.

**3.2.3. Grooming Lifecycle Management:**

- **Functionality:** Manages the 15-day grooming lifecycle, tracking stages and candidate progress through each stage.
- **User Stories:**
  - As a **Coordinator**, I want to initiate the grooming lifecycle for a candidate so that the process can begin.
  - As a **Project Manager**, I want to track the current stage of each candidate in their grooming lifecycle to monitor overall progress.
  - As a **Candidate**, I want to see my current stage in the grooming lifecycle to understand where I am in the process.
- **Acceptance Criteria:**
  - Coordinator can initiate the grooming lifecycle for a candidate, setting the start date.
  - The system tracks and displays the current stage of each candidate's grooming lifecycle (Pre-Assessment, Grooming, Post-Assessment, Client Interview).
  - Visual representation of the grooming lifecycle progress is available (e.g., progress bar).

**3.2.4. Grooming Topics Management:**

- **Functionality:** Allows authorized users to define and manage grooming topics and subtopics, categorizing them for different aspects of grooming.
- **User Stories:**
  - As a **Project Manager**, I want to add new grooming topics and subtopics so that we can keep the grooming content up-to-date.
  - As an **Assessor**, I want to be able to select relevant topics and subtopics when providing feedback.
  - As a **Candidate**, I want to view the list of grooming topics and subtopics so that I know what I need to learn.
- **Acceptance Criteria:**
  - PM, Coordinator, Assessor, and Groomer roles can add, update, and delete grooming topics and subtopics.
  - Topics and subtopics can be categorized (Assessment Feedback, Generic Topic, Hands-on, Previous Interview Questions).
  - Topics and subtopics can be associated with specific grooming lifecycles or roles, if needed.
  - Candidates can view the list of grooming topics and subtopics.

**3.2.5. Pre and Post Assessment:**

- **Functionality:** Facilitates pre and post assessments conducted by Assessors, allowing them to provide structured feedback on candidates.
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

**3.2.6. Grooming Progress Tracking:**

- **Functionality:** Allows Groomers to track daily grooming progress, topic coverage, and candidate assessment readiness within each topic.
- **User Stories:**
  - As a **Groomer**, I want to update the topics covered with a candidate each day so that we can track grooming progress.
  - As a **Groomer**, I want to indicate whether I have assessed the candidate on a specific topic and add comments on their performance, so that we have a record of their learning.
  - As a **Candidate**, I want to update my topic completion status and readiness for assessment, so that the groomer knows my self-perceived progress.
- **Acceptance Criteria:**
  - Groomers can update topics covered daily for each assigned candidate.
  - Groomers can indicate topic assessment status (Assessed/Not Assessed) and add comments.
  - Candidates can update their topic completion status (Ready for Assessment).
  - Grooming progress information is stored and linked to the candidate profile.

**3.2.7. Interview Question Search (AI-Powered):**

- **Functionality:** Provides a search interface for candidates to find previous client interview questions, leveraging AI for improved search relevance.
- **User Stories:**
  - As a **Candidate**, I want to search for previous interview questions using keywords or topics so that I can prepare for my client interview.
  - As a **Candidate**, I want the search results to be relevant and easy to understand so that I can quickly find the questions I need.
- **Acceptance Criteria:**
  - Candidates can access a search interface for interview questions.
  - The search functionality uses AI to improve search result relevance based on keywords or topics.
  - Search results are displayed in a clear and user-friendly format.
  - The system handles various search queries and provides relevant results.

**3.2.8. Dashboard and Reporting:**

- **Functionality:** Provides role-based dashboards for different users to monitor grooming activities, track progress, and generate reports.
- **User Stories:**
  - As a **Project Manager**, I want a dashboard that shows me the overall status of all grooming lifecycles so that I can get a high-level view of progress.
  - As a **Coordinator**, I want reports on candidate progress and assessment outcomes so that I can track operational efficiency.
  - As a **Groomer**, I want a dashboard showing my assigned candidates and their grooming progress so that I can manage my grooming sessions effectively.
- **Acceptance Criteria:**
  - Role-based dashboards are available for PM, Coordinator, Groomer, and Candidate roles, displaying relevant information.
  - Dashboards provide summaries and visualizations of key grooming metrics.
  - Reporting functionality allows users to generate reports on candidate progress, assessment outcomes, and lifecycle metrics.
  - Reports can be exported in common formats (e.g., CSV, Excel).

**3.2.9. Notifications and Communication:**

- **Functionality:** Provides automated notifications for key events in the grooming process to keep users informed.
- **User Stories:**
  - As a **Coordinator**, I want to be automatically notified when a new candidate is assigned to me so that I can take action.
  - As an **Assessor**, I want to receive notifications when I am assigned to conduct an assessment for a candidate so that I am aware of my tasks.
  - As a **Candidate**, I want to be notified when my assessment feedback is updated so that I can review it.
- **Acceptance Criteria:**
  - Automated notifications are triggered for role assignments (Assessor, Groomer).
  - Notifications are sent for assessment scheduling (Coordinator to Candidate/Assessor).
  - Notifications are sent when assessment feedback is updated and available for viewing.
  - Users can configure notification preferences (in-app, email).

**3.3. Prioritization:**

| Feature Category                         | Feature                                     | Priority    |
| :--------------------------------------- | :------------------------------------------ | :---------- |
| **Core Functionality (Must Have)**       | User Management                             | Must Have   |
|                                          | Candidate Profile Management                | Must Have   |
|                                          | Grooming Lifecycle Management               | Must Have   |
|                                          | Grooming Topics Management                  | Must Have   |
|                                          | Pre and Post Assessment                     | Must Have   |
|                                          | Grooming Progress Tracking                  | Must Have   |
|                                          | Dashboard and Reporting (Basic PM/Coord)    | Must Have   |
| **Important Enhancements (Should Have)** | Interview Question Search (AI-Powered)      | Should Have |
|                                          | Notifications and Communication             | Should Have |
|                                          | Dashboard and Reporting (Groomer/Candidate) | Should Have |
| **Nice to Have (Could Have)**            | Advanced Reporting & Analytics              | Could Have  |
|                                          | Customizable Dashboards                     | Could Have  |
|                                          | Integration with Communication Tools        | Could Have  |
| **Out of Scope (Won't Have)**            | Calendar Integration                        | Won't Have  |
|                                          | Payroll/HR System Integration               | Won't Have  |

**4. User Interface (UI) and User Experience (UX)**

**4.1. Design Considerations:**

- **Clean and Intuitive Interface:** The UI should be clean, modern, and easy to navigate for all user roles, even those with varying levels of technical expertise.
- **Role-Based Dashboards:** Each role should have a personalized dashboard displaying relevant information and actions, minimizing clutter and maximizing efficiency.
- **Clear Visual Hierarchy:** Information should be presented in a structured manner with clear visual hierarchy, making it easy to scan and understand.
- **Responsive Design:** The application should be responsive and accessible across different devices (desktops, laptops, tablets) and screen sizes.
- **Accessibility:** Adhere to accessibility guidelines to ensure usability for users with disabilities.
- **Consistent Design Language:** Maintain a consistent design language throughout the application for a cohesive and professional user experience.

**4.2. Basic Wireframes/Mockups Description:**

_(Textual Descriptions - Actual wireframes would be visual)_

- **Login Page:** Simple login screen with fields for username/email and password. Role selection might be implicitly determined after login.
- **PM Dashboard:** Overview screen with key metrics like total candidates in grooming, candidates in each lifecycle stage, team performance summaries, and quick links to candidate lists and reports. Cards or widgets will display summary information visually.
- **Coordinator Dashboard:** Focus on operational tasks. Sections for candidate management (list, create), assessment scheduling, groomer/assessor assignment overviews, and links to relevant reports. Tables and lists will be prominent.
- **Assessor Dashboard:** List of assigned candidates for assessment (pre/post), links to assessment forms for each candidate, and a history of completed assessments. Simple list views and actionable buttons will be key.
- **Groomer Dashboard:** List of assigned candidates, progress tracking for each candidate (topics covered, assessment status), and quick links to update progress and view candidate details. Progress indicators and lists will be used.
- **Candidate Dashboard:** Personalized view with team details, assigned roles (PM, Coordinator, etc.), grooming lifecycle progress visualization, list of grooming topics, links to view feedback, and the interview question search bar prominently placed.

**4.3. User Flows:**

- **Candidate Grooming Lifecycle Initiation (Coordinator):**

  1.  Coordinator logs in and navigates to Candidate Management.
  2.  Coordinator selects "Create New Candidate" and enters candidate details.
  3.  Coordinator saves candidate profile.
  4.  Coordinator selects "Initiate Grooming Lifecycle" for the newly created candidate.
  5.  System marks the candidate as "Pre-Assessment" stage.

- **Assessor Pre-Assessment (Assessor):**

  1.  Assessor logs in and navigates to Assessor Dashboard.
  2.  Assessor sees a list of candidates ready for Pre-Assessment.
  3.  Assessor selects a candidate and clicks "Start Pre-Assessment".
  4.  Assessor fills out the assessment form (topics, subtopics, ratings, comments).
  5.  Assessor submits the assessment.
  6.  System saves feedback and updates candidate status (potentially to "Grooming" stage depending on workflow).

- **Grooming Progress Update (Groomer):**

  1.  Groomer logs in and navigates to Groomer Dashboard.
  2.  Groomer selects a candidate from their assigned list.
  3.  Groomer navigates to the "Grooming Progress" section.
  4.  Groomer updates topics covered for the day, marks assessment status for topics, and adds comments.
  5.  Groomer saves progress updates.

- **Candidate Interview Question Search (Candidate):**
  1.  Candidate logs in and navigates to Candidate Dashboard.
  2.  Candidate locates the "Interview Question Search" bar.
  3.  Candidate enters keywords or topics in the search bar and submits the query.
  4.  System displays relevant interview questions based on the AI-powered search.

**5. Technical Requirements**

**5.1. Platform and Technology:**

- **Platform:** Web-based application, accessible via modern web browsers (Chrome, Firefox, Safari, Edge).
- **Technology Stack:**
  - **Frontend:** React, Next.js, shadcn/ui, Typescript.
  - **Backend:** for MVP we go with Next.js as a Backend (Server action)
  - **Database:** PostgreSQL (Neon DB)
  - **AI Search Integration:** Integration with a suitable AI search service or library (e.g., Elasticsearch with relevant NLP plugins, or cloud-based AI search services).
- **Hosting:** Vercel or Azure or Self-Hosting.

**5.2. Performance Requirements:**

- **Page Load Time:** Page load times should be under 3 seconds for key pages (dashboards, forms).
- **Responsiveness:** The application should be responsive and provide quick feedback to user actions.
- **Scalability:** The system should be scalable to handle a growing number of users and candidates without performance degradation.
- **Concurrency:** The system should handle concurrent access from multiple users without issues.

**6. Future Considerations**

**6.1. Potential Future Enhancements:**

- **Automated Scheduling:** Integrate with calendar systems to automate the scheduling of assessments and grooming sessions.
- **In-App Communication:** Implement in-app messaging or communication features to facilitate direct communication between users within the platform.
- **Advanced Analytics and Reporting:** Develop more sophisticated analytics and reporting capabilities to provide deeper insights into grooming effectiveness and identify areas for improvement.
- **Gamification:** Introduce gamification elements to motivate candidates and track their progress in a more engaging way.
- **Personalized Grooming Plans:** Develop features to create personalized grooming plans for candidates based on their assessment feedback and skill gaps.
- **Content Recommendation:** Integrate content recommendation engine to suggest relevant learning materials based on candidate's grooming topics and progress.

**6.2. Potential Future Integrations:**

- **HR System Integration:** Integrate with HR systems for seamless candidate onboarding and data synchronization.
- **Learning Management System (LMS) Integration:** Integrate with an LMS to provide direct access to learning resources and track candidate learning activities.
- **Video Conferencing Integration:** Integrate with video conferencing tools (e.g., Zoom, Google Meet) for online assessments and grooming sessions.
- **Feedback Integration:** Integrate feedback from client interviews back into the system to further refine the grooming process.
