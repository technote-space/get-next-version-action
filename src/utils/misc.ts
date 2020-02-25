import { Utils } from '@technote-space/github-action-helper';
import { SEMANTIC_MESSAGE } from '../constant';

export const getMinorUpdateCommitTypes = (): Array<string> => Utils.getArrayInput('MINOR_UPDATE_TYPES');
export const getBreakingChangeNotes    = (): Array<string> => Utils.getArrayInput('BREAKING_CHANGE_NOTES');

export const getCommitType = (message: string): string | undefined => {
	const target  = message.trim();
	const matches = target.match(SEMANTIC_MESSAGE);
	if (!matches) {
		return undefined;
	}

	return matches[1];
};
