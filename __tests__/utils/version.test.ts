/* eslint-disable no-magic-numbers */
import { Logger, ApiHelper } from '@technote-space/github-action-helper';
import { resolve } from 'path';
import nock from 'nock';
import {
	generateContext,
	testEnv,
	getOctokit,
	disableNetConnect,
	getApiFixture,
} from '@technote-space/github-action-test-helper';
import { getCommits, getCurrentVersion, whatBump, getNextVersionLevel, getNextVersion } from '../../src/utils/version';

const rootDir        = resolve(__dirname, '../..');
const fixtureRootDir = resolve(__dirname, '..', 'fixtures');
const logger         = new Logger();
const context        = generateContext({
	event: 'pull_request',
	ref: 'refs/pull/123/merge',
	sha: '1234567890',
	owner: 'hello',
	repo: 'world',
}, {
	payload: {
		number: 123,
		'pull_request': {
			number: 123,
			head: {
				ref: 'feature/change',
			},
		},
	},
});
const octokit        = getOctokit();
const helper         = new ApiHelper(octokit, context, logger);

describe('getCommits', () => {
	disableNetConnect(nock);

	it('should get commits 1', async() => {
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list1'));

		const commits = await getCommits([], octokit, context);

		expect(commits).toHaveLength(1);
		expect(commits[0].type).toBe('fix');
		expect(commits[0].notes).toHaveLength(0);
	});

	it('should get commits 2', async() => {
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list2'));

		const commits = await getCommits(['BREAKING CHANGE'], octokit, context);

		expect(commits).toHaveLength(6);
		expect(commits[0].type).toBe('fix');
		expect(commits[0].notes).toHaveLength(0);
		expect(commits[1].type).toBe('chore');
		expect(commits[1].notes).toHaveLength(0);
		expect(commits[2].type).toBe('feat');
		expect(commits[2].notes).toHaveLength(1);
		expect(commits[3].type).toBe('feat');
		expect(commits[3].notes).toHaveLength(0);
		expect(commits[4].type).toBe('style');
		expect(commits[4].notes).toHaveLength(0);
		expect(commits[5].type).toBe('chore');
		expect(commits[5].notes).toHaveLength(0);
	});
});

describe('getCurrentVersion', () => {
	disableNetConnect(nock);

	it('should get current version 1', async() => {
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/git/matching-refs/tags/')
			.reply(200, () => getApiFixture(fixtureRootDir, 'repos.git.matching-refs'));

		expect(await getCurrentVersion(helper)).toBe('v2.0.0');
	});

	it('should get current version 2', async() => {
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/git/matching-refs/tags/')
			.reply(200, () => []);

		expect(await getCurrentVersion(helper)).toBe('v0.0.0');
	});
});

describe('whatBump', () => {
	it('should return major', () => {
		expect(whatBump([], [
			{type: 'test', notes: ['BREAKING CHANGE: test']},
		])).toBe('major');
	});

	it('should return minor', () => {
		expect(whatBump(['feat'], [
			{type: 'feat', notes: []},
		])).toBe('minor');
	});

	it('should return patch', () => {
		expect(whatBump([], [])).toBe('patch');
		expect(whatBump(['feat'], [
			{type: 'chore', notes: []},
			{type: 'style', notes: []},
		])).toBe('patch');
	});
});

describe('getNextVersionLevel', () => {
	it('should return major level', () => {
		expect(getNextVersionLevel([], [
			{type: 'test', notes: ['BREAKING CHANGE: test']},
		])).toBe(0);
	});

	it('should return minor level', () => {
		expect(getNextVersionLevel(['feat'], [
			{type: 'feat', notes: []},
		])).toBe(1);
	});

	it('should return patch level', () => {
		expect(getNextVersionLevel([], [])).toBe(2);
		expect(getNextVersionLevel(['feat'], [
			{type: 'chore', notes: []},
			{type: 'style', notes: []},
		])).toBe(2);
	});
});

describe('getNextVersion', () => {
	testEnv(rootDir);
	disableNetConnect(nock);

	it('should get next version 1', async() => {
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/git/matching-refs/tags/')
			.reply(200, () => [])
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list1'));

		expect(await getNextVersion(helper, octokit, context)).toBe('v0.0.1');
	});

	it('should get next version 2', async() => {
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/git/matching-refs/tags/')
			.reply(200, () => getApiFixture(fixtureRootDir, 'repos.git.matching-refs'))
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list2'));

		expect(await getNextVersion(helper, octokit, context)).toBe('v3.0.0');
	});

	it('should get next version 3', async() => {
		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/git/matching-refs/tags/')
			.reply(200, () => getApiFixture(fixtureRootDir, 'repos.git.matching-refs'))
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list3'));

		expect(await getNextVersion(helper, octokit, context)).toBe('v2.1.0');
	});
});
