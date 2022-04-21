/* eslint-disable no-magic-numbers */
import { resolve } from 'path';
import { ApiHelper } from '@technote-space/github-action-helper';
import { Logger } from '@technote-space/github-action-log-helper';
import {
  generateContext,
  testEnv,
  getOctokit,
  disableNetConnect,
  getApiFixture,
} from '@technote-space/github-action-test-helper';
import nock from 'nock';
import { describe, expect, it } from 'vitest';
import { getCurrentVersion, getNextVersion } from './version';

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

describe('getCurrentVersion', () => {
  disableNetConnect(nock);

  it('should get current version 1', async() => {
    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => getApiFixture(fixtureRootDir, 'repos.git.matching-refs'));

    expect(await getCurrentVersion(helper)).toBe('v2.0.0');
  });

  it('should get current version 2', async() => {
    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => []);

    expect(await getCurrentVersion(helper)).toBe('v0.0.0');
  });
});

describe('getNextVersion', () => {
  testEnv(rootDir);
  disableNetConnect(nock);

  it('should get next version 1', async() => {
    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => [])
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixtureRootDir, 'commit.list1'));

    expect(await getNextVersion(logger, helper, octokit, context)).toBe('v0.0.1');
  });

  it('should get next version 2', async() => {
    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => getApiFixture(fixtureRootDir, 'repos.git.matching-refs'))
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixtureRootDir, 'commit.list2'));

    expect(await getNextVersion(logger, helper, octokit, context)).toBe('v3.0.0');
  });

  it('should get next version 3', async() => {
    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => getApiFixture(fixtureRootDir, 'repos.git.matching-refs'))
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixtureRootDir, 'commit.list3'));

    expect(await getNextVersion(logger, helper, octokit, context)).toBe('v2.1.0');
  });
});
