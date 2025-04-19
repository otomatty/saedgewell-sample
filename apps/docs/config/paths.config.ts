import { z } from 'zod';

const PathsSchema = z.object({
  auth: z.object({
    callback: z.string().min(1),
  }),
  app: z.object({
    home: z.string().min(1),
    profileSettings: z.string().min(1),
  }),
});

const pathsConfig = PathsSchema.parse({
  auth: {
    callback: '/auth/callback',
  },
  app: {
    home: '/',
    profileSettings: '/home/settings',
  },
} satisfies z.infer<typeof PathsSchema>);

export default pathsConfig;
