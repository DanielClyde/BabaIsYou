import { BitwiseHelper } from '../src/Utils/BitwiseHelper';
describe('BitwiseHelper', () => {
  it('Should be able to get value from flags', () => {
    const flags = 0b00110011;
    expect(BitwiseHelper.getBooleanFromFlags(flags, 0)).toBeTruthy();
    expect(BitwiseHelper.getBooleanFromFlags(flags, 1)).toBeTruthy();
    expect(BitwiseHelper.getBooleanFromFlags(flags, 2)).toBeFalsy();
    expect(BitwiseHelper.getBooleanFromFlags(flags, 3)).toBeFalsy();
    expect(BitwiseHelper.getBooleanFromFlags(flags, 4)).toBeTruthy();
    expect(BitwiseHelper.getBooleanFromFlags(flags, 5)).toBeTruthy();
    expect(BitwiseHelper.getBooleanFromFlags(flags, 6)).toBeFalsy();
    expect(BitwiseHelper.getBooleanFromFlags(flags, 7)).toBeFalsy();
  });

  it('Should be able to set value in flags', () => {
    let flags = 0;
    flags = BitwiseHelper.setBooleanInFlags(flags, true, 2);
    expect(flags).toBe(0b100);
    flags = BitwiseHelper.setBooleanInFlags(flags, true, 1);
    expect(flags).toBe(0b110);
    flags = BitwiseHelper.setBooleanInFlags(flags, false, 2);
    expect(flags).toBe(0b010);
  });
})
