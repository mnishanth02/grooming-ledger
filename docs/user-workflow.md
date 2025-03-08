# Grooming Ledger workflows

**1. User Login**

- **Workflow Title:** User Login
- **User Goal:** To securely access the Grooming Ledger application with their assigned role and permissions.

  - **Step 1: Login Screen**

    - **Screen Name/Title:** Grooming Ledger - Login
    - **Key UI Elements:**
      - Email Address Input Field (text field, email type)
      - Password Input Field (password type, masked input)
      - "Login" Button (primary button)
      - "Forgot Password?" Link (text link)
      - Company Logo (image, top left)
    - **Data displayed on the screen:**
      - Company Logo
      - Application Title ("Grooming Ledger")
      - Login form labels ("Email Address", "Password")
    - **User actions available on the screen:**

      - Enter Email Address
      - Enter Password
      - Click "Login" Button
      - Click "Forgot Password?" Link

    - **User Navigation:**

      - Initial screen upon accessing the Grooming Ledger web application.
      - Clicking "Login" button navigates to the Dashboard based on user role upon successful login.
      - Clicking "Forgot Password?" link navigates to the "Forgot Password" screen.

    - **Error Handling:**

      - **Error Scenario:** Incorrect Email or Password entered.
        - **System Response:** Display an error message near the login form, e.g., "Invalid email or password. Please try again." The input fields should remain populated with the user's entries for easy correction.
      - **Error Scenario:** Account not found for the entered email.
        - **System Response:** Display an error message, e.g., "Account not found for this email address. Please check your email or contact your administrator."
      - **Error Scenario:** Network connectivity issues preventing login.
        - **System Response:** Display a generic error message, e.g., "Unable to connect to the server. Please check your internet connection and try again."

    - **Success Scenario:** User enters correct credentials.
      - **System Response:** User is successfully logged in and redirected to their role-based dashboard (PM Dashboard, Coordinator Dashboard, Assessor Dashboard, Groomer Dashboard, or Candidate Dashboard).

  - **Step 2: [Role-Based] Dashboard Screen**

    - **Screen Name/Title:** (e.g., Project Manager Dashboard, Coordinator Dashboard, etc.)
    - **Key UI Elements:** (These will vary based on the role, see PRD 4.2 & 4.3)
      - Navigation Menu (left sidebar or top navigation) with links to relevant sections (e.g., Candidates, Assessments, Topics, Reports, User Management (for PM/Coordinator)).
      - Role-Specific Dashboard Widgets/Cards displaying key information and summaries (e.g., Candidate Status Overview, Upcoming Assessments, Assigned Candidates, Grooming Progress).
      - User Profile Dropdown/Menu (top right) with options like "Profile," "Settings," "Logout."
    - **Data displayed on the screen:** Role-specific data as described in PRD 4.2 and 4.3.
    - **User actions available on the screen:**

      - Navigate using the Navigation Menu.
      - Interact with Dashboard Widgets (e.g., click on a widget to see details).
      - Access User Profile Menu.

    - **User Navigation:**

      - Successful login from Login Screen navigates to this dashboard.
      - Navigation Menu allows users to access other sections of the application.
      - User Profile Menu provides access to account-related actions.

    - **Error Handling:** (Dashboard level errors are less likely on initial login, but could occur later e.g., data loading errors within widgets)

      - **Error Scenario:** Data loading failure for a dashboard widget.
        - **System Response:** Display an error message within the widget area, e.g., "Error loading candidate data. Please refresh or try again later." The rest of the dashboard should remain functional.

    - **Success Scenario:** User is successfully logged in and lands on their personalized dashboard, able to access relevant features.

  - **Visualization (Text-Based):**
    - Login Screen -> [Role-Based] Dashboard Screen

**2. Candidate Grooming Lifecycle Initiation (Coordinator)**

- **Workflow Title:** Initiate Candidate Grooming Lifecycle
- **User Goal:** As a Coordinator, to start the grooming process for a newly added candidate.

  - **Step 1: Coordinator Dashboard Screen**

    - **Screen Name/Title:** Coordinator Dashboard
    - **Key UI Elements:**
      - Navigation Menu (with "Candidates" or similar option)
      - Candidate List Widget/Section (potentially showing a summary list)
      - "Add Candidate" Button (primary or secondary button, depending on dashboard layout)
    - **Data displayed on the screen:**
      - Summary of candidate statuses (e.g., counts per lifecycle stage)
      - Potentially a list of candidates with basic info (Name, Status, Team)
    - **User actions available on the screen:**

      - Navigate to "Candidates" section from the Navigation Menu.
      - Click "Add Candidate" Button.

    - **User Navigation:**
      - Accessed after successful login as a Coordinator.
      - Clicking "Candidates" in Navigation Menu navigates to "Candidate Management Screen".
      - Clicking "Add Candidate" Button navigates to "Add New Candidate Screen".

  - **Step 2: Candidate Management Screen**

    - **Screen Name/Title:** Candidate Management
    - **Key UI Elements:**
      - Candidate List Table (with columns: Name, Team, Status, Actions)
      - "Add Candidate" Button (prominent button, top right or above table)
      - Search/Filter Options for Candidate List (text field, dropdowns for team, status)
    - **Data displayed on the screen:**
      - List of all candidates (or filtered list) with details like Name, Team, Current Grooming Status.
    - **User actions available on the screen:**

      - Click "Add Candidate" Button.
      - Search/Filter the Candidate List.
      - Select a candidate from the list to view details or initiate grooming. (This step is implied in the PRD workflow description, but could be part of initiating grooming). For now, let's assume "Initiate Grooming" action is on the Candidate Details screen. We will adjust if needed.

    - **User Navigation:**
      - Accessed from Coordinator Dashboard via Navigation Menu ("Candidates").
      - Clicking "Add Candidate" Button navigates to "Add New Candidate Screen".
      - Selecting a candidate (if applicable in this screen for initiating grooming - based on current assumption, it's not, but could be via a context menu) would navigate to "Candidate Details Screen".

  - **Step 3: Add New Candidate Screen**

    - **Screen Name/Title:** Add New Candidate
    - **Key UI Elements:**
      - "Name" Input Field (text field, required)
      - "Contact Details" Input Fields (Email, Phone - text/email/phone type fields, required)
      - "Team" Dropdown/Selection (dropdown or autocomplete, required)
      - "Save" Button (primary button)
      - "Cancel" Button (secondary button/link)
    - **Data displayed on the screen:**
      - Labels for input fields (e.g., "Candidate Name", "Email Address", "Team").
    - **User actions available on the screen:**

      - Enter Candidate Name.
      - Enter Contact Details (Email, Phone).
      - Select Team.
      - Click "Save" Button.
      - Click "Cancel" Button.

    - **User Navigation:**

      - Accessed from Coordinator Dashboard or Candidate Management Screen via "Add Candidate" button.
      - Clicking "Save" Button, upon successful creation, navigates back to "Candidate Management Screen" (or Candidate Details screen) and displays a success message.
      - Clicking "Cancel" Button navigates back to the previous screen (Candidate Management Screen or Coordinator Dashboard) without saving.

    - **Error Handling:**

      - **Error Scenario:** Required fields are empty upon clicking "Save".
        - **System Response:** Display error messages next to or above the empty required fields, e.g., "Candidate Name is required.", "Email is required.", "Team is required." Prevent saving until all required fields are filled.
      - **Error Scenario:** Invalid email format entered.
        - **System Response:** Display error message next to the email field, e.g., "Invalid email format."
      - **Error Scenario:** Duplicate candidate entry (e.g., email already exists).
        - **System Response:** Display error message, e.g., "Candidate with this email already exists."

    - **Success Scenario:** All required fields are correctly filled and "Save" is clicked.
      - **System Response:** Candidate profile is created successfully. System navigates back to "Candidate Management Screen" and displays a success message, e.g., "Candidate [Candidate Name] added successfully."

  - **Step 4: Candidate Details Screen** (Assuming we navigate here after creating or selecting a candidate to initiate grooming)

    - **Screen Name/Title:** Candidate Details - [Candidate Name]
    - **Key UI Elements:**
      - Candidate Information Section (displaying Name, Team, Contact details, Current Status)
      - "Initiate Grooming Lifecycle" Button (prominent button, potentially in an "Actions" section)
      - Grooming Lifecycle Status Indicator (visual progress bar or stage labels)
      - Tabs or sections for different aspects of the candidate (e.g., "Assessments", "Grooming Progress", "Feedback").
    - **Data displayed on the screen:**
      - Candidate profile information.
      - Current grooming lifecycle stage.
    - **User actions available on the screen:**

      - Click "Initiate Grooming Lifecycle" Button.
      - View Candidate Details.
      - Navigate to other tabs/sections (Assessments, Grooming Progress, etc.).

    - **User Navigation:**
      - Accessed from Candidate Management Screen by selecting a candidate (or potentially directly after saving a new candidate).
      - Clicking "Initiate Grooming Lifecycle" Button transitions to the next step.

  - **Step 5: Confirmation Modal/Popup (for Initiate Grooming)** (Optional but good UX practice)

    - **Screen Name/Title:** Confirm Grooming Lifecycle Initiation
    - **Key UI Elements:**
      - Confirmation Message (e.g., "Are you sure you want to initiate the grooming lifecycle for [Candidate Name]? This will start the 15-day grooming process.")
      - "Initiate" Button (primary confirmation button)
      - "Cancel" Button (secondary button/link)
    - **Data displayed on the screen:**
      - Confirmation message and candidate name.
    - **User actions available on the screen:**

      - Click "Initiate" Button.
      - Click "Cancel" Button.

    - **User Navigation:**
      - Accessed from Candidate Details Screen upon clicking "Initiate Grooming Lifecycle" Button.
      - Clicking "Initiate" Button (in modal) confirms initiation and closes the modal, updating the Candidate Details screen.
      - Clicking "Cancel" Button (in modal) closes the modal and returns to the Candidate Details Screen without initiating.

  - **Step 6: Candidate Details Screen (Updated)**

    - **Screen Name/Title:** Candidate Details - [Candidate Name] (Updated)
    - **Key UI Elements:**
      - Candidate Information Section (updated Status to "Pre-Assessment")
      - "Initiate Grooming Lifecycle" Button - might be disabled or changed to "Grooming in Progress" or similar status indicator.
      - Grooming Lifecycle Status Indicator - updated to show "Pre-Assessment" as the current stage.
      - Tabs/sections (Assessments, Grooming Progress, Feedback) are now active and relevant.
    - **Data displayed on the screen:**

      - Updated Candidate Status (e.g., "Pre-Assessment").
      - Updated Grooming Lifecycle Stage.

    - **User Navigation:**

      - After successful grooming lifecycle initiation, the user remains on the updated Candidate Details Screen.
      - The user can now proceed to manage assessments, track grooming progress, etc., for this candidate.

    - **Success Scenario:** Grooming lifecycle is successfully initiated.
      - **System Response:** Candidate's grooming status is updated to "Pre-Assessment". The Candidate Details screen reflects the updated status and lifecycle stage. Potentially a success message is briefly displayed, e.g., "Grooming lifecycle initiated for [Candidate Name]."

  - **Visualization (Text-Based):**
    - Coordinator Dashboard -> Candidate Management Screen -> Add New Candidate Screen -> Candidate Management Screen -> Candidate Details Screen -> Confirmation Modal -> Candidate Details Screen (Updated)

**3. Assessor Pre-Assessment (Assessor)**

- **Workflow Title:** Assessor Completes Pre-Assessment
- **User Goal:** As an Assessor, to conduct and submit a pre-assessment for an assigned candidate, providing feedback on specific topics and subtopics.

  - **Step 1: Assessor Dashboard Screen**

    - **Screen Name/Title:** Assessor Dashboard
    - **Key UI Elements:**
      - Navigation Menu (with "Assessments" or similar option)
      - "Pending Assessments" Widget/Section (listing candidates assigned for pre/post assessment)
    - **Data displayed on the screen:**
      - List of candidates assigned for assessment (Name, Team, Assessment Type (Pre/Post), Status).
    - **User actions available on the screen:**

      - Navigate to "Assessments" section using the Navigation Menu.
      - Click on a candidate in the "Pending Assessments" list to start the assessment.

    - **User Navigation:**
      - Accessed after successful login as an Assessor.
      - Clicking "Assessments" in Navigation Menu navigates to "Assessment List Screen".
      - Clicking on a candidate in the "Pending Assessments" list (or from Assessment List Screen) navigates to "Assessment Form Screen".

  - **Step 2: Assessment List Screen** (If a separate screen is needed to list all assessments, otherwise Step 1 can directly link to forms)

    - **Screen Name/Title:** Assessments
    - **Key UI Elements:**
      - Assessment List Table (columns: Candidate Name, Assessment Type, Status, Date Assigned, Actions)
      - Filters for Assessment Type (Pre/Post), Status (Pending, Completed)
      - Search Bar for Candidates
    - **Data displayed on the screen:**
      - List of assessments assigned to the Assessor, with details.
    - **User actions available on the screen:**

      - Filter and search assessments.
      - Click "Start Assessment" or "View Assessment" (depending on status) action for a candidate.

    - **User Navigation:**
      - Accessed from Assessor Dashboard via Navigation Menu ("Assessments").
      - Clicking "Start Assessment" action for a candidate navigates to "Assessment Form Screen".

  - **Step 3: Assessment Form Screen**

    - **Screen Name/Title:** Pre-Assessment Form - [Candidate Name]
    - **Key UI Elements:**

      - Candidate Information Section (Name, Team)
      - Assessment Form Section - Repeated section for each topic/subtopic to be assessed.
        - "Topic" Dropdown/Selection (list of grooming topics)
        - "Subtopic" Dropdown/Selection (list of subtopics under selected topic, dynamically updated)
        - "Rating" Dropdown/Radio Buttons (scale of 1-5)
        - "Comments" Text Area (for feedback)
        - "Add Topic/Subtopic" Button (to add more feedback items)
      - "Submit Assessment" Button (primary button)
      - "Save as Draft" Button (secondary button) - Optional, but good practice.
      - "Cancel" Button (secondary button/link)

    - **Data displayed on the screen:**
      - Candidate information.
      - Lists of Topics and Subtopics (dynamically loaded, potentially categorized as per PRD).
      - Existing assessment data if editing a draft or viewing a completed assessment.
    - **User actions available on the screen:**

      - Select Topic and Subtopic for assessment.
      - Provide Rating (1-5).
      - Enter Comments.
      - Click "Add Topic/Subtopic" to add more feedback items.
      - Click "Submit Assessment" Button.
      - Click "Save as Draft" Button (if implemented).
      - Click "Cancel" Button.

    - **User Navigation:**

      - Accessed from Assessor Dashboard or Assessment List Screen by clicking "Start Assessment" or similar action.
      - Clicking "Submit Assessment" Button, upon successful submission, navigates back to Assessor Dashboard or Assessment List Screen and displays a success message.
      - Clicking "Save as Draft" Button (if implemented) saves progress and may navigate back to Assessment List Screen or remain on the form with a "Draft Saved" message.
      - Clicking "Cancel" Button may prompt for confirmation if data is entered and then navigate back to the previous screen without saving.

    - **Error Handling:**

      - **Error Scenario:** Required fields (Topic, Subtopic, Rating - depending on requirements) are missing upon "Submit".
        - **System Response:** Display error messages next to or above the missing required fields, e.g., "Topic is required.", "Rating is required for [Topic]."
      - **Error Scenario:** No topics/subtopics assessed (if at least one is required).
        - **System Response:** Display error message, e.g., "Please provide assessment for at least one topic/subtopic."
      - **Error Scenario:** Network error during submission.
        - **System Response:** Display generic error message, e.g., "Error submitting assessment. Please check your internet connection and try again."

    - **Success Scenario:** All required assessment data is provided and "Submit Assessment" is clicked.
      - **System Response:** Assessment is successfully submitted and saved. System navigates back to Assessor Dashboard or Assessment List Screen and displays a success message, e.g., "Pre-Assessment for [Candidate Name] submitted successfully." Candidate status may be updated based on assessment outcome (though the PRD only mentions status update post _Post_-Assessment, this could be adjusted workflow).

  - **Step 4: Assessor Dashboard or Assessment List Screen (Updated)**

    - **Screen Name/Title:** Assessor Dashboard or Assessments (Updated)
    - **Key UI Elements:**
      - "Pending Assessments" widget/list - updated to reflect the completed assessment (candidate removed from pending, or status updated to "Completed").
      - Assessment List Table - updated to show the completed assessment (status changed to "Completed").
    - **Data displayed on the screen:**

      - Updated lists and summaries reflecting the completed assessment.

    - **User Navigation:**

      - After successful assessment submission, the user is returned to this screen.

    - **Success Scenario:** Assessor can see that the assessment is successfully submitted in their dashboard/assessment list.

  - **Visualization (Text-Based):**
    - Assessor Dashboard -> Assessment List Screen (Optional) -> Assessment Form Screen -> Assessment List Screen or Assessor Dashboard (Updated)
