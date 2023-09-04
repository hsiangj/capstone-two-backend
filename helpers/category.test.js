const { mapCategory } = require("../helpers/category");
const { BadRequestError } = require("../expressErrors");

describe('mapCategory', () => {
  it('should map "entertainment" to category_id 1', () => {
    expect(mapCategory('entertainment')).toBe(1);
  });

  it('should map "food and drink" to category_id 2', () => {
    expect(mapCategory('food and drink')).toBe(2);
  });

  it('should map "medical" to category_id 3', () => {
    expect(mapCategory('medical')).toBe(3);
  });

  it('should map "rent_and_utilities" (with underscores) to category_id 4', () => {
    expect(mapCategory('rent_and_utilities')).toBe(4);
  });

  it('should map "TRANSPORTATION" (all caps) to category_id 5', () => {
    expect(mapCategory('TRANSPORTATION')).toBe(5);
  });

  it('should map "Travel" (mixed case) to category_id 6', () => {
    expect(mapCategory('Travel')).toBe(6);
  });

  it('should map "other" to category_id 7', () => {
    expect(mapCategory('other')).toBe(7);
  });

  it('should throw BadRequestError for an invalid category', () => {
    expect(() => mapCategory('invalidCategory')).toThrow(BadRequestError);
  });
});
