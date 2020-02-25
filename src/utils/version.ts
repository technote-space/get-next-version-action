import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { Utils, ApiHelper } from '@technote-space/github-action-helper';
import { getBreakingChangeNotes, getCommitType, getMinorUpdateCommitTypes } from './misc';
import { VERSION_BUMP } from '../constant';

const MERGE_MESSAGE = /^Merge pull request #\d+ /;

type CommitInfo = Required<{
	type: string;
	notes: Array<string>;
}>;

export const getCommits = async(breakingChangeNotes: Array<string>, octokit: Octokit, context: Context): Promise<Array<CommitInfo>> => (await octokit.paginate(
	octokit.pulls.listCommits.endpoint.merge({
		...context.repo,
		'pull_number': context.payload.number,
	}),
))
	.filter((item: Octokit.PullsListCommitsResponseItem): boolean => !MERGE_MESSAGE.test(item.commit.message))
	.map(
		(item: Octokit.PullsListCommitsResponseItem): CommitInfo | undefined => {
			const messages = Utils.split(item.commit.message, /\r?\n|\r/);
			const type     = getCommitType(messages[0]);
			if (!type) {
				return undefined;
			}

			return {
				type,
				notes: breakingChangeNotes.length ? messages.slice(1).filter(message => { // eslint-disable-line no-magic-numbers
					const type = getCommitType(message);
					return type && breakingChangeNotes.includes(type);
				}) : [],
			};
		},
	)
	.filter(item => item)
	.map(item => item as CommitInfo);

export const getCurrentVersion = async(helper: ApiHelper): Promise<string> => helper.getLastTag();

export const whatBump = (minorUpdateCommitTypes: Array<string>, commits: Array<CommitInfo>): keyof typeof VERSION_BUMP => {
	if (commits.filter(commit => commit.notes.length).length) {
		return 'major';
	}

	if (minorUpdateCommitTypes.length && commits.filter(commit => minorUpdateCommitTypes.includes(commit.type)).length) {
		return 'minor';
	}

	return 'patch';
};

export const getNextVersionLevel = (minorUpdateCommitTypes: Array<string>, commits: Array<CommitInfo>): number => VERSION_BUMP[whatBump(minorUpdateCommitTypes, commits)];

export const getNextVersion = async(helper: ApiHelper, octokit: Octokit, context: Context): Promise<string> => Utils.generateNewVersion(
	await getCurrentVersion(helper),
	getNextVersionLevel(getMinorUpdateCommitTypes(), await getCommits(getBreakingChangeNotes(), octokit, context)),
);
