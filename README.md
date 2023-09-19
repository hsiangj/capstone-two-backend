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
    - username: string
    - password: string
    - firstName: string
    - lastName: string
    - email: string

- Response: 
```
    {    
        user: {  
		    id: number,
		    username: string,
		    firstName: string,
		    lastName: string,
		    email: string
	    },
	token: string  
    }
```

**POST** `/auth/login`  
Endpoint for authenticating existing user. 
- Request:
    - username: string
    - password: string
- Response: 
```
{
    token: string
}
```

---
#### USERS ROUTES
**GET** `/users/:userId`   
Endpoint for getting a user. **Correct User Required.**  
- Response: 
```
{    
    user: {  
        id: number,
        username: string,
        firstName: string,
        lastName: string,
        email: string
    }   
}
```

**PATCH** `/users/:userId`   
Endpoint for editing a user. **Correct User Required.**  
- Request:  
    - username (optional): string
    - firstName (optional): string
    - lastName (optional): string
    - email (optional): string
    - password: string
- Response: 
```
{    
    user: {  
        id: number,
        username: string,
        firstName: string,
        lastName: string,
        email: string
    }   
}
```

**DELETE** `/users/:userId`   
Endpoint for removing a user. **Correct User Required.**  
- Response: `{ deleted: username }`

---
#### EXPENSES ROUTES
**GET** `/users/:userId/expenses`   
Endpoint for getting all expenses for a user. **Correct User Required.**  
- Response: 
```
{
    expenses: [
	{
		id: number,
		amount: string,
		date: string,
		vendor: string,
		description: string,
		category_id: number,
		category: string,
		transaction_id: string
	}, ...
    ]
}
```

**GET** `/users/:userId/expenses/:expenseId`   
Endpoint for getting a single expense for a user. **Correct User Required.**  
- Response: 
```
{
    expense: {  
        id: number,
	amount: string,
	date: string,
	vendor: string,
	description: string,
	category_id: number,
	category: string,
	user_id: number,
	transaction_id: string
    }   
}
```

**POST** `/users/:userId/expenses`  
Endpoint for creating an expense for a user. **Correct User Required.**     
- Request:  
    - amount: number
    - date: string
    - vendor (optional): string
    - description (optional): string
    - category_id: number
    - transaction_id (optional): string
- Response: 
```
{
    expense: {  
        id: number,
        amount: number,
        date: string,
        vendor: string,
        description: string,
        category_id: number,
        category: string,
        transaction_id: string
    }   
}
```

**PATCH** `/users/:userId/expenses/:expenseId`   
Endpoint for editing an expense for a user. **Correct User Required.**     
- Request:  
    - amount (optional): number
    - date (optional): string
    - vendor (optional): string
    - description (optional): string
    - category_id (optional): number
- Response: 
```
{
    expense: {  
        id: number,
        amount: string,
        date: string,
        vendor: string,
        description: string,
        category_id: number
    }   
}
```

**DELETE** `/users/:userId/expenses/:expenseId`   
Endpoint for removing an expense for a user. **Correct User Required.**     
- Response: `{ deleted: expenseId }`
---
#### BUDGETS ROUTES
**GET** `/users/:userId/budgets`   
Endpoint for getting all budgets for a user. **Correct User Required.**  
- Response: 
```
{
    budgets: [
	{
		budget_id: number,
		amount: string,
		category: string,
		category_id: number
	}, ...
    ]
}
```

**GET** `/users/:userId/budgets/:budgetId`   
Endpoint for getting a single budget for a user. **Correct User Required.**  
- Response: 
```
{
    budget: {  
        id: number,
	amount: number,
	category: string,
	category_id: number,
	user_id: number	
    }   
}
```

**POST** `/users/:userId/budgets`  
Endpoint for creating a budget for a user. **Correct User Required.**     
- Request:  
    - amount: number
    - category_id: number
- Response: 
```
{
    budget: {  
        budget_id: number,
        amount: number,
        category: string,
        category_id: number
    }   
}
```

**PATCH** `/users/:userId/budgets/:budgetId`   
Endpoint for editing a budget for a user. **Correct User Required.**     
- Request:  
    - amount: number
- Response: 
```
{
    budget: {  
        budget_id: number,
        amount: number,
        category_id: number
    }   
}
```

**DELETE** `/users/:userId/budgets/:budgetId`   
Endpoint for removing a budget for a user. **Correct User Required.**     
- Response: `{ deleted: budgetId }`

---
#### ACCOUNTS ROUTES
**GET** `/users/:userId/accounts`   
Endpoint for getting all accounts for a user. **Correct User Required.**  
- Response: 
```
{
    accounts: [
	{
		id: number,
		access_token: string,
		item_id: string,
		account_id: string,
		institution_name: string,
		account_type: string
	}, ...
    ]
}
```

**DELETE** `/users/:userId/accounts/:accountId`   
Endpoint for removing a budget for a user. **Correct User Required.**     
- Response: `{ deleted: accountId }`

### Tests
Tests are contained in the folder that the JS file belongs to and can be run with `npm test` at the root directory. 



