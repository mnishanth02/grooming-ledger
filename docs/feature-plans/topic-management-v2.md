# Feature Plan: Topic Management Screen (v2 - Table Layout)

This document outlines the plan for building the Topic Management screen located at `app/admin/[teamId]/(routes)/topics/page.tsx`, based on user feedback and reference images provided. This version uses a table-based layout and a unified modal for CRUD operations.

## 1. UI Concept: Table-Based Management with Enhanced Modal

*   **Main View (`Topics Management` Screen):**
    *   **Layout:** Use the Shadcn `DataTable` component.
    *   **Header:** `PageHeading` ("Topics Management"), search `Input` ("Search by Topic Name..."), "Add New Topic" `Button`.
    *   **Table Columns:**
        *   "Topic Name": Displays the main topic name.
        *   "Subtopics": Displays associated subtopics using Shadcn `Badge` components. (Consider tooltip/limit for many subtopics).
        *   "Actions": Contains Edit/Delete triggers (potentially via `DropdownMenu`).
    *   **Filtering:** Search input filters the table by Topic Name.
*   **Add/Edit Modal (`Dialog`):**
    *   **Trigger:** "Add New Topic" button or "Edit" action in the table row.
    *   **Content:**
        *   Title: "Add New Topic" or "Edit Topic".
        *   Fields: Topic `name`, `description`, `category`.
        *   Dynamic List: "Subtopics" section using `Input` fields for each subtopic name, with a "Remove" (X) button.
        *   "Add Subtopic" button to dynamically add new subtopic inputs.
        *   Action Buttons: "Cancel", "Save Topic" / "Update Topic".
    *   **Interaction:** Manages topic and *all* its subtopics (add/edit/remove) within this single modal.

## 2. Implementation Plan

*   **Step 1: Data Access Layer (`data/data-access/topic.queries.ts`)**
    *   Use existing `getTopicsWithSubtopics` function to fetch data for the table.
*   **Step 2: Validation Schemas (`lib/validator/topic-validator.ts`)**
    *   Modify `createTopicSchema` and `updateTopicSchema` to include validation for an array of subtopics (e.g., `subtopics: z.array(z.object({ id: z.string().optional(), name: z.string().min(1), description: z.string().optional() })).optional()`).
    *   Remove separate subtopic schemas.
*   **Step 3: Server Actions (`data/actions/topic.actions.ts`)**
    *   Modify `createTopic`: Handle topic data + subtopic array insertion within a transaction.
    *   Modify `updateTopic`: Handle topic field updates + subtopic array processing (add/update/delete) within a transaction.
    *   Remove separate subtopic actions.
    *   Ensure `revalidatePath` is used.
*   **Step 4: Core UI Components (`components/admin/topics/`)**
    *   **`topic-form.tsx` (`'use client'`):** Primary modal form using `react-hook-form` and `useFieldArray` for dynamic subtopics. Handles submission to server actions.
    *   **`topic-columns.tsx` (`'use client'`):** Defines `DataTable` columns (Topic Name, Subtopics (Badges), Actions (DropdownMenu -> Edit/Delete)).
    *   **`topic-data-table.tsx` (`'use client'`):** Renders `DataTable`, handles search filtering, pagination (if needed).
*   **Step 5: Page Implementation (`app/admin/[teamId]/(routes)/topics/page.tsx`)**
    *   `async` component.
    *   Fetch data via `getTopicsWithSubtopics()`.
    *   Render layout: `PageHeading`, top bar (Add Button, Search Input).
    *   Render `TopicDataTable` with data and columns.
    *   Manage Add/Edit `Dialog` state.

## 3. Mermaid Diagram (Plan Overview)

```mermaid
graph LR
    subgraph "Data Layer"
        Q[topic.queries.ts: getTopicsWithSubtopics]
        SA[topic.actions.ts: create/update/delete Topic (handles Subtopics)]
        V[topic-validator.ts: Zod Schemas (incl. subtopic arrays)]
        DB[(Database: topics, subTopics)]
        Q --> DB;
        SA --> V;
        SA --> DB;
    end

    subgraph "UI Layer (Components)"
        P[topics/page.tsx (RSC)]
        DT[admin/topics/topic-data-table.tsx ('use client')]
        Cols[admin/topics/topic-columns.tsx ('use client')]
        TF[admin/topics/topic-form.tsx ('use client', uses useFieldArray)]
        Modal[Shadcn Dialog/AlertDialog]
        Search[Shadcn Input (for search)]
        AddBtn[Shadcn Button (Add New Topic)]
    end

    subgraph "Interaction Flow"
        P -- Fetches --> Q;
        P -- Renders --> AddBtn;
        P -- Renders --> Search;
        P -- Renders & Passes Data --> DT;
        DT -- Uses --> Cols;
        DT -- Filters Data based on --> Search;
        AddBtn -- Triggers --> Modal -- Contains --> TF;
        Cols -- Defines Actions --> DT;
        DT -- Edit Action triggers --> Modal -- Contains --> TF (with data);
        DT -- Delete Action triggers --> Modal[AlertDialog];
        TF -- Calls --> SA;
        Modal[AlertDialog] -- Calls Delete --> SA;
        SA -- Revalidates --> P;
    end