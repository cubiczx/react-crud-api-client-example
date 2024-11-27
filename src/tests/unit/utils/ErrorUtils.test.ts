import { parseErrorMessage } from '../../../utils/ErrorUtils';

describe('ErrorUtils', () => {
  it('should return the error message from an Error object', () => {
    const error = new Error('Something went wrong');
    expect(parseErrorMessage(error)).toBe('Something went wrong');
  });

  it('should return a default message for non-error inputs', () => {
    expect(parseErrorMessage(null)).toBe('An unknown error occurred');
  });
});
