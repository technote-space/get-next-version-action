import { Context } from '@actions/github/lib/context';
import { Logger, Utils, ApiHelper } from '@technote-space/github-action-helper';
import { exportVariable, getInput, setOutput } from '@actions/core' ;
import { getCurrentVersion, getNextVersion } from './utils/version';

const setResult = (current: string, next: string): void => {
	setOutput('current', current);
	setOutput('next', next);
	const envName = getInput('SET_ENV_NAME');
	if (envName) {
		exportVariable(envName, next);
	}
};

const dumpResult = (current: string, next: string, logger: Logger): void => {
	logger.startProcess('Dump output');
	console.log('current version: ', current);
	console.log('next version: ', next);
	logger.endProcess();
};

export const execute = async(logger: Logger, context: Context): Promise<void> => {
	const octokit = Utils.getOctokit();
	const helper  = new ApiHelper(octokit, context, logger);
	const current = await getCurrentVersion(helper);
	const next    = await getNextVersion(helper, octokit, context);

	setResult(current, next);
	dumpResult(current, next, logger);
};
