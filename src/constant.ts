export const TARGET_EVENTS = {
	'pull_request': [
		'opened',
		'reopened',
		'synchronize',
		'rerequested',
		'closed',
	],
};

// <type>(<scope>): <subject>
// @see https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716#semantic-commit-messages
export const SEMANTIC_MESSAGE = /^(.+?)!?\s*(\(.+?\)\s*)?:\s*(.+?)$/;

export const VERSION_BUMP = {
	'major': 0,
	'minor': 1,
	'patch': 2,
} as const;
