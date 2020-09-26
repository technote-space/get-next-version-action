import {Context} from '@actions/github/lib/context';
import {Utils, ApiHelper} from '@technote-space/github-action-helper';
import {Logger} from '@technote-space/github-action-log-helper';
import {exportVariable, getInput, setOutput} from '@actions/core' ;
import {getCurrentVersion, getNextVersion} from './utils/version';

const setResult = (current: string, next: string): void => {
  setOutput('current', current);
  setOutput('next', next);
  const envName = getInput('SET_ENV_NAME');
  if (envName) {
    exportVariable(envName, next);
  }
};

export const execute = async(logger: Logger, context: Context): Promise<void> => {
  const octokit = Utils.getOctokit();
  const helper  = new ApiHelper(octokit, context, logger);
  const current = await getCurrentVersion(helper);
  const next    = await getNextVersion(logger, helper, octokit, context);

  setResult(current, next);
};
