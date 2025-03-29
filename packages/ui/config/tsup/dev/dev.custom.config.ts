import { customEntries } from '../entries/custom';
import { createDevConfig } from './createDevConfig';

export default createDevConfig(customEntries, {
  name: 'custom',
  memoryLimit: 4096,
});
