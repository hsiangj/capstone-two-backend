# ExpenseBud - Backend

This repository is completed as part of Springboard Software Engineering Career Track capstone two. The frontend can be found [here](https://github.com/hsiangj/capstone-two-frontend "ExpenseBud Frontend"). 

### Application Description
"ExpenseBud" is a web app for users to easily track their expenses and budget goals. Aside from manual entries of expenses, users could connect with their financial institutions to import transactions via the [Plaid API](https://plaid.com/docs/). Both the expenses and budgets data are visualized in a simple to understand dashboard for high level overview. 

View the application [here](https://expensebud.onrender.com/ "ExpenseBud") on Render. Best viewed on desktop. 

### Technology Stack & Tools
#### Frontend
* React
* Material UI
* Chart.js
* React Chart.js
#### Backend
* Express
* Node.js
#### Database
* PostgreSQL
#### Others
* Axios
* JWT

### API Endpoints
Base URL: `https://expensebud-backend.onrender.com` 

**Token is required** in the header for all routes after Authentication Routes. 

---
#### AUTHENTICATION ROUTES
**POST** `/auth/register`   
Endpoint for creating a new user. 
- Request:
    - username
    - password
    - firstName
    - lastName
    - email

- Response: 
`{ user, token }`

**POST** `/auth/login`  
Endpoint for authenticating existing user. 
- Request:
    - username
    - password
- Response: 
`{ token }`

---
#### USERS ROUTES
**GET** `/users/:userId`   
Endpoint for getting a user. **Correct User Required.**  
- Response: 
`{ username, firstName, lastName, email, password }`

**PATCH** `/users/:userId`   
Endpoint for editing a user. **Correct User Required.**  
- Request:  
    - username (optional)
    - firstName (optional)
    - lastName (optional)
    - email (optional)
    - password
- Response: `{ id, username, firstName, lastName, email }`

**DELETE** `/users/:userId`   
Endpoint for removing a user. **Correct User Required.**  
- Response: `{ deleted: username }`

---
#### EXPENSES ROUTES
**GET** `/users/:userId/expenses`   
Endpoint for getting all expenses for a user. **Correct User Required.**  
- Response: `{ expenses: [{id, amount, date, vendor, description, category_id, category, transaction_id},...] }`

**GET** `/users/:userId/expenses/:expenseId`   
Endpoint for getting a single expense for a user. **Correct User Required.**  
- Response: `{ id, amount, date, vendor, description, category_id, category, user_id, transaction_id }`

**POST** `/users/:userId/expenses`  
Endpoint for creating an expense for a user. **Correct User Required.**     
- Request:  
    - amount
    - date 
    - vendor (optional)
    - description (optional)
    - category_id
    - transaction_id (optional)
- Response: `{ id, amount, date, vendor, description, category_id, user_id, transaction_id } `

**PATCH** `/users/:userId/expenses/:expenseId`   
Endpoint for editing an expense for a user. **Correct User Required.**     
- Request:  
    - amount (optional)
    - date (optional)
    - vendor (optional)
    - description (optional)
    - category_id (optional)
- Response: `{ id, amount, date, vendor, description, category_id }`

**DELETE** `/users/:userId/expenses/:expenseId`   
Endpoint for removing an expense for a user. **Correct User Required.**     
- Response: `{ deleted: expenseId }`
---
#### BUDGETS ROUTES
**GET** `/users/:userId/budgets`   
Endpoint for getting all budgets for a user. **Correct User Required.**  
- Response: `{ budgets: [{ budget_id, amount, category_id, category },...] }`

**GET** `/users/:userId/budgets/:budgetId`   
Endpoint for getting a single budget for a user. **Correct User Required.**  
- Response: `{ id, amount, category_id, category, user_id }`

**POST** `/users/:userId/budgets`  
Endpoint for creating a budget for a user. **Correct User Required.**     
- Request:  
    - amount
    - category_id
- Response: `{ budget_id, amount, category_id, user_id }  `

**PATCH** `/users/:userId/budgets/:budgetId`   
Endpoint for editing a budget for a user. **Correct User Required.**     
- Request:  
    - amount 
- Response: `{ budget_id, amount, category_id }`

**DELETE** `/users/:userId/budgets/:budgetId`   
Endpoint for removing a budget for a user. **Correct User Required.**     
- Response: `{ deleted: budgetId }`

---
#### ACCOUNTS ROUTES
**GET** `/users/:userId/accounts`   
Endpoint for getting all accounts for a user. **Correct User Required.**  
- Response: `{ accounts: [{ id, access_token, item_id, account_id, institution_name, account)type }, ...] }`

**DELETE** `/users/:userId/accounts/:accountId`   
Endpoint for removing a budget for a user. **Correct User Required.**     
- Response: `{ deleted: accountId }`

### Tests
Tests are contained in the folder that the JS file belongs to and can be run with `npm test` at the root directory. 



