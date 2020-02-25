"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const github_action_helper_1 = require("@technote-space/github-action-helper");
const core_1 = require("@actions/core");
const version_1 = require("./utils/version");
const setResult = (current, next) => {
    core_1.setOutput('current', current);
    core_1.setOutput('next', next);
    const envName = core_1.getInput('SET_ENV_NAME');
    if (envName) {
        core_1.exportVariable(envName, next);
    }
};
const dumpResult = (current, next, logger) => {
    logger.startProcess('Dump output');
    console.log('current version: ', current);
    console.log('next version: ', next);
    logger.endProcess();
};
exports.execute = (logger, context) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = github_action_helper_1.Utils.getOctokit();
    const helper = new github_action_helper_1.ApiHelper(octokit, context, logger);
    const current = yield version_1.getCurrentVersion(helper);
    const next = yield version_1.getNextVersion(helper, octokit, context);
    setResult(current, next);
    dumpResult(current, next, logger);
});
