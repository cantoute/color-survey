import * as authentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { discard, iff, isProvider } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const { protect } = local.hooks;

export default {
  before: {
    // all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [authenticate('jwt')],
  },

  after: {
    all: [],
    find: [iff(isProvider('external'), protect('id'))],
    get: [iff(isProvider('external'), protect('id'))],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
