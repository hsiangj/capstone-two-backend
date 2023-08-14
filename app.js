const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

app.post('/plaid/create_link_token', async function (request, response) {
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
    return response.json(createTokenResponse.data);
  } catch (error) {
    return response.status(500).send("error:", error)
  }
});

app.post('/plaid/exchange_public_token', async function (
  request,
  response,
  next,
) {
  const publicToken = request.body.public_token;
  try {
    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    const accessToken = plaidResponse.data.access_token;
    const itemID = plaidResponse.data.item_id;
    return response.json({ accessToken, public_token_exchange: 'complete' });
  } catch (error) {
    // handle error
    return response.status(500).send('Public Token Exchange Failed:', error)
  }
});

app.post('/plaid/transactions/sync', async function (req, res) {
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
  } catch (e) {
    return res.status(500).send('transactions/sync failed', e)
  }
});

// Get Plaid 
app.post('/plaid/auth/get', async function (req, res) {
  const access_token = req.body.access_token;
  const request = {
    access_token: access_token,
  };
  try {
    const authResult = await plaidClient.authGet(request);
    return res.json(authResult.data);
  } catch (e) {
    return res.status(500).send('auth/get failed', e)
  }
});




module.exports = app;