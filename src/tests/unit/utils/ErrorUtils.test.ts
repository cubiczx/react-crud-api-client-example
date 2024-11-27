import { handleError } from '../../../utils/ErrorUtils';

describe('ErrorUtils', () => {
  it('should return the error message from an Error object', () => {
    const error = new Error('Something went wrong');
    expect(handleError(error)).toBe('Something went wrong');
  });

  it('should return a default message for non-error inputs', () => {
    expect(handleError(null)).toBe('An unknown error occurred.');
  });

  it('should return a custom default message if provided', () => {
    expect(handleError(null, 'Something went wrong')).toBe(
      'Something went wrong'
    );
  });

  it('should return the default message if error has no message', () => {
    const error = new Error();
    expect(handleError(error)).toBe('An unknown error occurred.');
  });
});
