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
exports.execute = void 0;
const github_action_helper_1 = require("@technote-space/github-action-helper");
const core_1 = require("@actions/core");
const version_1 = require("./utils/version");
const setResult = (current, next) => {
    (0, core_1.setOutput)('current', current);
    (0, core_1.setOutput)('next', next);
    const envName = (0, core_1.getInput)('SET_ENV_NAME');
    if (envName) {
        (0, core_1.exportVariable)(envName, next);
    }
};
const execute = (logger, context) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = github_action_helper_1.Utils.getOctokit();
    const helper = new github_action_helper_1.ApiHelper(octokit, context, logger);
    const current = yield (0, version_1.getCurrentVersion)(helper);
    const next = yield (0, version_1.getNextVersion)(logger, helper, octokit, context);
    setResult(current, next);
});
exports.execute = execute;
