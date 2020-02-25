import { Utils } from '@technote-space/github-action-helper';

export const getMinorUpdateCommitTypes = (): Array<string> => Utils.getArrayInput('MINOR_UPDATE_TYPES');
export const getBreakingChangeNotes    = (): Array<string> => Utils.getArrayInput('BREAKING_CHANGE_NOTES');
