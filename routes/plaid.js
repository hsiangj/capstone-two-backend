/** Routes for Plaid API. */

const express = require("express");
const router = express.Router();
const { plaidClient } = require("../config");

const Account = require("../models/account");
const Expense = require("../models/expense");
const { mapCategory } = require("../helpers/category");

router.post('/create_link_token', async function (req, res, next) {
  // Get the client_user_id by searching for the current user
  const userId = String(res.locals.user.id) || null;
  const plaidRequest = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: userId
    },
    client_name: 'Plaid App',
    products: ['auth', 'transactions'],
    language: 'en',
    redirect_uri: 'http://localhost:3000/',
    country_codes: ['US'],
  };
  
  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    return res.json(createTokenResponse.data);
  } catch (err) {
    console.error('create_link_token error')
    return next(err);
  }
});

router.post('/exchange_public_token', async function (req, res, next
) {
  const publicToken = req.body.public_token;
  const { name, institution_id } = req.body.metadata.institution; 
  const { id: accID, name: accType } = req.body.metadata.account;
   
  try {
    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    const accessToken = plaidResponse.data.access_token;
    const itemID = plaidResponse.data.item_id;

    const accData = {
      user_id: res.locals.user.id,
      access_token: accessToken,
      item_id: itemID,
      account_id: accID,
      institution_id: institution_id,
      institution_name: name,
      account_type: accType
    }

    const account = await Account.create(accData);

    return res.json({ accessToken });
  } catch (error) {
    return next(error);
  }
});

router.post('/transactions/sync', async function (req, res, next) {
  const access_token = req.body.access_token;
  const account_id = req.body.accountId;
  const request = {
    access_token: access_token,
    options: {
      include_personal_finance_category: true,
    },
  };
  try {
    const transactionResult = await plaidClient.transactionsSync(request);
    let newTransactions = transactionResult.data.added || [];
   
    if (newTransactions.length > 0) {
      for (let transaction of newTransactions) {
        let convertedId = mapCategory(transaction.personal_finance_category.primary);
        
        let data = {
          amount: transaction.amount,
          date: transaction.date,
          vendor: transaction.merchant_name,
          description: transaction.name,
          category_id: convertedId,
          user_id: res.locals.user.id,
          transaction_id: transaction.transaction_id,
          account_id: account_id
        };
      
        try {
          await Expense.create(res.locals.user.id, data);
        } catch (err) {
          console.debug('/transactions/sync await expense error at data:', data)
          return next(err);
        }
      }
    }
    return res.json(transactionResult.data);
  } catch (err) {
    return next(err);
  }
});
 
router.post('/auth/get', async function (req, res, next) {
  const access_token = req.body.access_token;
  const request = {
    access_token: access_token,
  };
  try {
    const authResult = await plaidClient.authGet(request);
    return res.json(authResult.data);
  } catch (err) {
    return next(err);
  }
});





module.exports = router;