export const navigationConfig = {
  admin: [
    { id: 'dashboard', name: 'Dashboard', path: '/admin' },
    { id: 'teams', name: 'Teams', path: '/admin/teams' },
    { id: 'candidates', name: 'Candidates', path: '/admin/candidates' },
    { id: 'participants', name: 'Participants', path: '/admin/participants' },
  ],
  teamManager: [
    { id: 'dashboard', name: 'Dashboard', path: '/team' },
    { id: 'candidates', name: 'Candidates', path: '/team/candidates' },
    { id: 'participants', name: 'Participants', path: '/team/participants' },
    { id: 'wishlist', name: 'Wish List', path: '/team/wishlist' },
  ],
} as const;