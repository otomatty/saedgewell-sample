import { magicuiEntries } from '../entries/magicui';
import { createDevConfig } from './createDevConfig';

export default createDevConfig(magicuiEntries, {
  name: 'magicui',
  memoryLimit: 4096,
});
