import { describe, it, expect } from 'vitest';
import { getString, getNumber } from './form-data-helpers';

describe('getString', () => {
  it('returns string value when entry is a string', () => {
    const formData = new FormData();
    formData.append('name', 'John');

    const result = getString(formData, 'name');

    expect(result).toBe('John');
  });

  it('returns empty string when FormData entry is not a string', () => {
    const formData = new FormData();
    formData.append('file', new File([''], 'test.txt'));
    const result = getString(formData, 'file');
    expect(result).toBe('');
  });

  it('returns empty string when key does not exist', () => {
    const formData = new FormData();
    const result = getString(formData, 'missing');
    expect(result).toBe('');
  });
});

describe('getNumber', () => {
  it('returns number when entry is a valid numeric string', () => {
    const formData = new FormData();
    formData.append('age', '1');
    const result = getNumber(formData, 'age');
    expect(result).toBe(1);
  });

  it('returns undefined when entry is not a string', () => {
    const formData = new FormData();
    formData.append('file', new File([''], 'test.txt'));

    const result = getNumber(formData, 'file');

    expect(result).toBeUndefined();
  });

  it('returns undefined when string is empty or whitespace', () => {
    const formData = new FormData();
    formData.append('empty', '');
    formData.append('whitespace', '   ');

    expect(getNumber(formData, 'empty')).toBeUndefined();
    expect(getNumber(formData, 'whitespace')).toBeUndefined();
  });

  it('returns undefined when string cannot be converted to number', () => {
    const formData = new FormData();
    formData.append('invalid', 'number');
    const result = getNumber(formData, 'invalid');
    expect(result).toBeUndefined();
  });

  it('returns undefined when key does not exist', () => {
    const formData = new FormData();
    const result = getNumber(formData, 'missing');
    expect(result).toBeUndefined();
  });
});
