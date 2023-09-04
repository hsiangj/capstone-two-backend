const { partialUpdateSql } = require("./sql");
const { BadRequestError } = require("../expressErrors");

describe('partialUpdateSql', () => {
  it('should generate setCols and values correctly', () => {
    const dataToUpdate = {
      firstName: 'Sam',
      age: 30
    }

    const jsToSqlFields = {
      firstName: 'first_name',
    }

    const result = partialUpdateSql(dataToUpdate, jsToSqlFields);
    expect(result.setCols).toBe("first_name = $1, age = $2");
    expect(result.values).toEqual(['Sam', 30]);
  });  

  it('should handle missing jsToSqlfields with no error', () => {
    const dataToUpdate = {
      firstName: 'Sam',
      age: 30
    }

    const jsToSqlFields = {}

    const result = partialUpdateSql(dataToUpdate, jsToSqlFields);
    expect(result.setCols).toBe("firstName = $1, age = $2");
    expect(result.values).toEqual(['Sam', 30]);
  }); 

  it('should throw BadRequestError when given empty dataToUpdate', () => {
    const dataToUpdate = {};
    const jsToSqlFields = {};

    expect(() => partialUpdateSql(dataToUpdate,jsToSqlFields)).toThrow(BadRequestError);
  });


});
