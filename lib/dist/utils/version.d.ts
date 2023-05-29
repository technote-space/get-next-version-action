import type { Context } from '@actions/github/lib/context';
import type { ApiHelper } from '@technote-space/github-action-helper';
import type { Octokit } from '@technote-space/github-action-helper/';
import type { Logger } from '@technote-space/github-action-log-helper';
export declare const getCurrentVersion: (helper: ApiHelper) => Promise<string>;
export declare const getNextVersion: (logger: Logger, helper: ApiHelper, octokit: Octokit, context: Context) => Promise<string>;
