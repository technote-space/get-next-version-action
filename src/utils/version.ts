import {Context} from '@actions/github/lib/context';
import {Octokit} from '@technote-space/github-action-helper/dist/types';
import {Version} from '@technote-space/github-action-version-helper';
import {Logger, ApiHelper} from '@technote-space/github-action-helper';
import {getBreakingChangeNotes, getExcludeMessages, getMinorUpdateCommitTypes} from './misc';

export const getCurrentVersion = async(helper: ApiHelper): Promise<string> => Version.getCurrentVersion(helper);

export const getNextVersion = async(logger: Logger, helper: ApiHelper, octokit: Octokit, context: Context): Promise<string> => Version.getNextVersion(getMinorUpdateCommitTypes(), getExcludeMessages(), getBreakingChangeNotes(), helper, octokit, context, logger);
