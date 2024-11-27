/**
 * Handles an error by logging it to the console and returning an error message.
 *
 * @param {unknown} err - The error to handle.
 * @param {string} defaultMessage - The default error message to use if the error is not an instance of `Error`.
 * @returns {string} The error message to display.
 */
export const handleError = (err: unknown, defaultMessage: string): string => {
  console.error(err);

  if (err instanceof Error) {
    return err.message || defaultMessage;
  }

  return defaultMessage;
};
