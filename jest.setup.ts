import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
