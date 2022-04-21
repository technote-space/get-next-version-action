import type { Context } from '@actions/github/lib/context';
import type { ApiHelper } from '@technote-space/github-action-helper';
import type { Types } from '@technote-space/github-action-helper/';
import type { Logger } from '@technote-space/github-action-log-helper';
import { Version } from '@technote-space/github-action-version-helper';
import { getBreakingChangeNotes, getExcludeMessages, getMinorUpdateCommitTypes } from './misc';

export const getCurrentVersion = async(helper: ApiHelper): Promise<string> => Version.getCurrentVersion(helper);

export const getNextVersion = async(logger: Logger, helper: ApiHelper, octokit: Types.Octokit, context: Context): Promise<string> => Version.getNextVersion(getMinorUpdateCommitTypes(), getExcludeMessages(), getBreakingChangeNotes(), helper, octokit, context, logger);
