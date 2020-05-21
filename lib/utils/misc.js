"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBreakingChangeNotes = exports.getExcludeMessages = exports.getMinorUpdateCommitTypes = void 0;
const github_action_helper_1 = require("@technote-space/github-action-helper");
exports.getMinorUpdateCommitTypes = () => github_action_helper_1.Utils.getArrayInput('MINOR_UPDATE_TYPES');
exports.getExcludeMessages = () => github_action_helper_1.Utils.getArrayInput('EXCLUDE_MESSAGES');
exports.getBreakingChangeNotes = () => github_action_helper_1.Utils.getArrayInput('BREAKING_CHANGE_NOTES');
