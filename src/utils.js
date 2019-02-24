export const getDialogId = ({ currentUserId, otherUserId }) => [currentUserId, otherUserId].sort().join('-')
