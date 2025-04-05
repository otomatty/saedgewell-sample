import { shadcnEntries } from '../entries/shadcn';
import { createDevConfig } from './createDevConfig';

export default createDevConfig(shadcnEntries, {
  name: 'shadcn',
  memoryLimit: 4096,
});
