const { BadRequestError } = require("../expressErrors");

/**
 * Helper for converting data to update into selective SQL queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSqlFields {Object} maps js-style data fields to database column names, eg. { firstName: "first_name"}
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {firstName: 'Sam', age: 32} =>
 *   { setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Sam', 32] }
 */


function partialUpdateSql(dataToUpdate, jsToSqlFields) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data to update.");

  const setColsFormat = keys.map((col, i) => 
    `${jsToSqlFields[col] || col} = $${i+1}`)

  return {
    setCols: setColsFormat.join(", "),
    values: Object.values(dataToUpdate)
  }
}

module.exports = { partialUpdateSql };