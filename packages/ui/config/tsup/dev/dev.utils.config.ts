import { utilEntries } from '../entries/util';
import { createDevConfig } from './createDevConfig';

export default createDevConfig(utilEntries, {
  name: 'utils',
  memoryLimit: 4096,
});
