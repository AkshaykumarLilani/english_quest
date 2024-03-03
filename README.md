
## Problem Statement

Create a web interface with secure APIs, protected by JWT authentication and role-based access control, for efficient book management.

**Tech Stack:** MongoDB, Express.js, React.js, Node.js

**Design System:** Ant Design

### Deployment Links

API Docs: [https://english-quest-backend.onrender.com/api-docs](https://english-quest-backend.onrender.com/api-docs "API Docs")

Frontend: [https://singular-panda-c399c9.netlify.app/](https://singular-panda-c399c9.netlify.app/ "Frontend")


### Web Interface

- **Login/Signup Screen:** Secure login & Signup screen for user authentication.
- **Book Listing:** Display all books in a tabular format with filtering and sorting options.
- **Time-based Filtering:** Option to view books created within the last 10 minutes and beyond
- **Backend Pagination**: Lists 10 pages per page and data is fetched from backend when user requests for the next page.

### Book Management APIs

- **CRUD Operations:** Users with the "CREATOR" role can create, view, and delete books via the "/books" endpoint.
- **Viewing Books:** Users with the "VIEW_ALL" role can view all created books.
- **Delete Books:** Deletion of books by "CREATOR" role users is possible through the "/books/delete" API.
- **Role-based Access:** Users can have multiple roles, granting flexible access to functionalities.

## Technical Expectations

- **Database:** Utilizes MongoDB for data storage, ensuring compatibility with any MongoDB instance.
- **Environment Flexibility:** Connection information stored in environment properties for flexibility.
- **UI Validations:** Basic UI validations implemented to enhance user experience.
- **Error Handling:** Minimized console warnings/errors, with API call tracking facilitated by a logger.

## Getting Started

To run the project locally, follow these steps:

1. Clone this repository.
2. Navigate to frontend directory and backend directories in separate terminals.
3. Install dependencies: `npm install` in both the directories.
4. Copy .env.dev in backend directory .env file. Add mongo atlas or local mongodb instance url to MONGO_URL. Enter a JWT Secret to JWT_SECRET and input a number in PAGINATION_SIZE which controls the books listed per page.
5. Run npm start.
6. Copy .env.dev in frontend to .env file. Replace the VITE_BASE_URL variable to point to the local backend server which we ran in step 5.
7. Start the server: `npm start`.
8. Access the web interface at `http://localhost:3000`.

## Contributors

- [Akshaykumar Lilani]([link-to-your-github-profile](https://github.com/AkshaykumarLilani)): Project Lead
