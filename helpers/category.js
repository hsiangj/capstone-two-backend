const { BadRequestError } = require("../expressErrors");

/** Maps Plaid personal_finance_category string to database category
 *  Returns category_id. */

function mapCategory(plaidCategory) {
  let regex = /\s+|_+/g;

  plaidCategory =  plaidCategory.replace(regex, ' ').toLowerCase()

  let dbCategory = {
    'entertainment' : 1,
    'food and drink': 2,
    'medical': 3,
    'rent and utilities': 4,
    'transportation': 5,
    'travel': 6,
    'other': 7
  }

  if (!dbCategory[plaidCategory]) throw new BadRequestError(`${plaidCategory} does not exist`);

  return dbCategory[plaidCategory];
}

module.exports = { mapCategory };

