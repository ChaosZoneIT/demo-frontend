import { calculateTotalPrice } from './price.utils';

describe('[unit] calculateTotalPrice', () => {
  it('should return 0 when empty array is given', () => {
    expect(calculateTotalPrice([])).toBe(0);
  });

  it('should correctly sum the selected * price for each chair', () => {
    const mock = [
      { selected: 2, price: 10 },
      { selected: 3, price: 20 }
    ];
    expect(calculateTotalPrice(mock)).toBe(2 * 10 + 3 * 20);
  });
});