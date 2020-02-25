/* eslint-disable no-magic-numbers */
import { Logger } from '@technote-space/github-action-helper';
import { resolve } from 'path';
import nock from 'nock';
import {
	generateContext,
	testEnv,
	disableNetConnect,
	getApiFixture,
	spyOnStdout,
	stdoutCalledWith,
	testChildProcess,
	getLogStdout,
} from '@technote-space/github-action-test-helper';
import { execute } from '../src/process';

const rootDir        = resolve(__dirname, '..');
const fixtureRootDir = resolve(__dirname, 'fixtures');
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

describe('execute', () => {
	testEnv(rootDir);
	disableNetConnect(nock);
	testChildProcess();

	it('should run 1', async() => {
		process.env.INPUT_GITHUB_TOKEN = 'token';
		process.env.INPUT_SET_ENV_NAME = '';
		const mockStdout               = spyOnStdout();

		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/git/matching-refs/tags/')
			.reply(200, () => getApiFixture(fixtureRootDir, 'repos.git.matching-refs'))
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list1'));

		await execute(logger, context);

		stdoutCalledWith(mockStdout, [
			'::group::Target commits:',
			'[]',
			'::endgroup::',
			'> Current version: v2.0.0',
			'> Next version: v2.0.1',
			'::set-output name=current::v2.0.0',
			'::set-output name=next::v2.0.1',
		]);
	});

	it('should run 2', async() => {
		process.env.INPUT_GITHUB_TOKEN = 'token';
		process.env.INPUT_SET_ENV_NAME = '';
		const mockStdout               = spyOnStdout();

		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/git/matching-refs/tags/')
			.reply(200, () => getApiFixture(fixtureRootDir, 'repos.git.matching-refs'))
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list2'));

		await execute(logger, context);

		stdoutCalledWith(mockStdout, [
			'::group::Target commits:',
			getLogStdout([
				{
					'type': 'feat',
					'message': 'add new features',
					'sha': '3dcb09b5b57875f334f61aebed695e2e4193db5e',
				},
				{
					'type': 'feat',
					'message': 'add new feature3',
					'sha': '4dcb09b5b57875f334f61aebed695e2e4193db5e',
				},
			]),
			'::endgroup::',
			'> Current version: v2.0.0',
			'> Next version: v3.0.0',
			'::set-output name=current::v2.0.0',
			'::set-output name=next::v3.0.0',
		]);
	});

	it('should run 3', async() => {
		process.env.INPUT_GITHUB_TOKEN = 'token';
		const mockStdout               = spyOnStdout();

		nock('https://api.github.com')
			.persist()
			.get('/repos/hello/world/git/matching-refs/tags/')
			.reply(200, () => getApiFixture(fixtureRootDir, 'repos.git.matching-refs'))
			.get('/repos/hello/world/pulls/123/commits')
			.reply(200, () => getApiFixture(fixtureRootDir, 'commit.list3'));

		await execute(logger, context);

		stdoutCalledWith(mockStdout, [
			'::group::Target commits:',
			getLogStdout([
				{
					'type': 'feat',
					'message': 'add new feature3',
					'sha': '4dcb09b5b57875f334f61aebed695e2e4193db5e',
				},
			]),
			'::endgroup::',
			'> Current version: v2.0.0',
			'> Next version: v2.1.0',
			'::set-output name=current::v2.0.0',
			'::set-output name=next::v2.1.0',
			'::set-env name=NEXT_VERSION::v2.1.0',
		]);
	});
});
