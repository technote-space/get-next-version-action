import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { Version } from '@technote-space/github-action-version-helper';
import { ApiHelper } from '@technote-space/github-action-helper';
import { getBreakingChangeNotes, getMinorUpdateCommitTypes } from './misc';

export const getCurrentVersion = async(helper: ApiHelper): Promise<string> => Version.getCurrentVersion(helper);

export const getNextVersion = async(helper: ApiHelper, octokit: Octokit, context: Context): Promise<string> => Version.getNextVersion(getMinorUpdateCommitTypes(), [], getBreakingChangeNotes(), helper, octokit, context);
