import { Database, Resource } from '@adminjs/typeorm';
import { AdminJS } from 'adminjs';
import { User } from 'modules/auth/user/entities/user.entity';

AdminJS.registerAdapter({ Database, Resource });

export const adminConfig = {
  rootPath: '/admin',
  resources: [
    {
      resource: User,
      options: {
        navigation: null,
        properties: {
          state: { type: 'textarea', props: { rows: 4 } },
        },
      },
    },
  ],
};
