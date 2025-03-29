import { makerkitEntries } from '../entries/makerkit';
import { createDevConfig } from './createDevConfig';

export default createDevConfig(makerkitEntries, {
  name: 'makerkit',
  memoryLimit: 4096,
});
