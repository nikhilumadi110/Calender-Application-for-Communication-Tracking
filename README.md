# Communication Tracking Application

## Description

This application is designed to streamline the tracking of communications with various companies. It provides a centralized platform for logging past interactions, planning future communications, and managing engagement frequency based on predefined schedules. The application features separate modules for administrators and regular users, along with reporting capabilities for actionable insights.

## Key Features

*   **Admin Module:**
    *   **Company Management:** Add, edit, and delete company records, including names, locations, LinkedIn profiles, email addresses, phone numbers, communication periodicity, and notes.
    *   **Communication Method Management:** Define available communication methods, including name, description, sequence, and whether the method is mandatory. Default methods include LinkedIn Post, LinkedIn Message, Email, Phone Call, and Other.
*   **User Module:**
    *   **Dashboard:** A grid view displaying companies, their recent communications, and scheduled future communications.
    *   **Color-Coded Highlights:** Red for overdue communications and yellow for communications due today.
    *   **Communication Logging:** Log new communications for selected companies, specifying the communication type, date, and notes.
    *   **Notifications:** Dedicated section displaying overdue and due communications.
    *   **Calendar View:** View past and scheduled future communications on a calendar.
    *   **Interactive Tooltips:** Hover effect on past communications to display notes.
*   **Reporting & Analytics Module (Optional):**
    *   **Communication Frequency Report:** A bar chart showing the frequency of each communication method.
    *   **Overdue Communication Trend:** A line chart displaying the number of overdue communications over time.
    *   **Real-time Activity Log:** Table view displaying all communication activities, sortable by date.

## Technologies Used

*   **React:** For building the user interface.
*   **Material UI (MUI):** For UI components and styling.
*   **Formik:** For form handling.
*   **Yup:** For form validation.
*   **React Router:** For navigation.
*   **Date-fns:** For date formatting and manipulation.
*   **FullCalendar:** For the calendar component.
*    **Chart.js & react-chartjs-2:** For creating charts.
*   **Local Storage:** For persisting data.
*   **UUID:** For generating unique IDs.
*   **Tailwind CSS:** For additional styling.
*   **react-toastify:** For displaying notifications

## Installation Instructions

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**

    ```bash
    cd <project-directory>
    ```
3.  **Install dependencies:**

    ```bash
    npm install
    ```

## Usage Instructions

1.  **Start the development server:**

    ```bash
    npm start
    ```
2.  **Open the application in your browser:**

    Open your web browser and go to `http://localhost:3000` or the address provided by the development server.
3.  **Login:**

    *   Use the provided credentials to log in as either an admin or a regular user.
4. **Admin User**:
    * Use the `Admin Dashboard` to create, update or delete companies and communication methods.
5. **Regular User**
    * Use the `User Dashboard` to view the communication with the companies, log new communication and view the past communication from the calendar.

##  Notes on Application Functionality and Known Limitations

*   This application uses local storage to persist data. This means that the data will be stored in the user's browser and will not be accessible across different devices.
*   The application is currently designed for single-user access and does not support multi-user collaboration.
*   The Reporting and Analytics Module offers basic reporting capabilities. Future enhancements could include more advanced filtering options, custom date ranges, and a dashboard with aggregated statistics.
*   Currently all the data is stored on the local storage, so once clear the local storage data will be lost.
*   The validation for the phone number is added as per the mentioned format in requirement document.
*   The number of emails and phone numbers are restricted to 5, for better UI handling.