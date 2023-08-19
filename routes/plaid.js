/** Routes for Plaid API. */

const express = require("express");
const router = express.Router();
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const Account = require("../models/account");

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

router.post('/create_link_token', async function (req, res, next) {
  // Get the client_user_id by searching for the current user
  //// const user = await User.find();
  //// const clientUserId = user.id;
  const plaidRequest = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: 'user',
    },
    client_name: 'Plaid Test App',
    products: ['auth', 'transactions'],
    language: 'en',
    redirect_uri: 'http://localhost:3000/',
    country_codes: ['US'],
  };
  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    return res.json(createTokenResponse.data);
  } catch (err) {
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
      user_id: 1,
      access_token: accessToken,
      item_id: itemID,
      account_id: accID,
      institution_id: institution_id,
      institution_name: name,
      account_type: accType
    }

    const account = await Account.create(accData);
    console.log(account)
   
    return res.json({ accessToken, public_token_exchange: 'complete' });
  } catch (error) {
    // handle error
    return res.status(500).send('Public Token Exchange Failed:', error)
  }
});

router.post('/transactions/sync', async function (req, res) {
  const access_token = req.body.access_token;
  const request = {
    access_token: access_token,
    options: {
      include_personal_finance_category: true,
    },
  };
  try {
    const transactionResult = await plaidClient.transactionsSync(request);
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