const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { authenticateJWT } = require("./middleware/auth");
const { NotFoundError } = require("./expressErrors");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const expensesRoutes = require("./routes/expenses");
const budgetsRoutes = require("./routes/budgets");
const accountsRoutes = require("./routes/accounts"); 
const plaidRoutes = require("./routes/plaid");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/plaid", plaidRoutes);
app.use("/users", usersRoutes);
app.use("/users/:userId/expenses", expensesRoutes);
app.use("/users/:userId/budgets", budgetsRoutes);
app.use("/users/:userId/accounts", accountsRoutes); 



/** Handle 404 errors */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: {message, status}
  });
});


module.exports = app;