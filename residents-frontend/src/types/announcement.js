/**
 * @typedef {'active' | 'closed'} Status
 */

/**
 * @typedef {'up' | 'down' | 'heart'} ReactionType
 */

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} authorName
 * @property {string} text
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Reaction
 * @property {string} id
 * @property {string} userId
 * @property {ReactionType} type
 * @property {string} createdAt
 * @property {string} [idempotencyKey]
 */

/**
 * @typedef {Object} Announcement
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {Status} status
 * @property {string} createdAt
 * @property {string} lastActivityAt
 * @property {Comment[]} comments
 * @property {Reaction[]} reactions
 */

/**
 * @typedef {Object} CreateAnnouncementDto
 * @property {string} title
 * @property {string} [description]
 */

/**
 * @typedef {Object} UpdateAnnouncementStatusDto
 * @property {Status} status
 */