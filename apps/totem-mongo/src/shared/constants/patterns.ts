export const PROFILE_PATTERNS = {
  FIND_ALL: 'profiles.findAll',
  FIND_ALL_SOFT_DELETED: 'profiles.fildAllSoftDeleted',
  FIND_ALL_BY_BRANCH: 'profiles.findAllByBranch',
  GET_BY_ID: 'profiles.getById',
  GET_BY_USER_ID: 'profiles.getByUserId',
  CREATE: 'profiles.create',
  UPDATE: 'profiles.update',
  DELETE: 'profiles.delete',
  UPDATE_BADGES: 'profiles.addBadgeToProfile',
};

export const BRANCH_PATTERNS = {
  FIND_ALL: 'branches.findAll',
  GET_BY_ID: 'branches.getById',
  CREATE: 'branches.create',
  UPDATE: 'branches.update',
  DELETE: 'branches.delete',
};

export const BADGE_PATTERNS = {
  FIND_ALL: 'badges.findAll',
  FIND_ALL_SOFT_DELETED: 'badges.fildAllSoftDeleted',
  GET_BY_ID: 'badges.getById',
  CREATE: 'badges.create',
  UPDATE: 'badges.update',
  DELETE: 'badge.delete',
};

export const USER_PATTERNS = {
  INVITATIONS_REGISTER: 'invitations.register',
};
