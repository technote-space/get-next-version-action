# Get Next Version Action

[![CI Status](https://github.com/technote-space/get-next-version-action/workflows/CI/badge.svg)](https://github.com/technote-space/get-next-version-action/actions)
[![codecov](https://codecov.io/gh/technote-space/get-next-version-action/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/get-next-version-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/get-next-version-action/badge)](https://www.codefactor.io/repository/github/technote-space/get-next-version-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/get-next-version-action/blob/master/LICENSE)

GitHub Actions to get next version from commit histories.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Usage](#usage)
- [Options](#options)
  - [MINOR_UPDATE_TYPES](#minor_update_types)
  - [EXCLUDE_MESSAGES](#exclude_messages)
  - [BREAKING_CHANGE_NOTES](#breaking_change_notes)
  - [SET_ENV_NAME](#set_env_name)
- [Action event details](#action-event-details)
  - [Target events](#target-events)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage
e.g. Add release tag
```yaml
on:
  pull_request:
    branches:
      - master
    types: [closed]

name: Add release tag

jobs:
  tag:
    name: Add release tag
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true && github.event.pull_request.head.ref == 'release/next'
    steps:
      - name: Get next version
        uses: technote-space/get-next-version-action@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - uses: actions/github-script@0.4.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            github.git.createRef({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: `refs/tags/${process.env.NEXT_VERSION}`,
              sha: context.sha
            })
```

## Options
### MINOR_UPDATE_TYPES
Minor update commit types.  
default: `'feat'`  
e.g. `'feat, refactor'`

### EXCLUDE_MESSAGES
Exclude messages.  
default: `''`  
e.g.
```
EXCLUDE_MESSAGES: |
  tweaks
  trivial changes      
```  

In the example above, the next commits are ignored.
- chore: tweaks
- style: trivial changes

### BREAKING_CHANGE_NOTES
Breaking change notes.  
default: `'BREAKING CHANGE'`

### SET_ENV_NAME
Env name.  
default: `'NEXT_VERSION'`

## Action event details
### Target events
| eventName | action |
|:---:|:---:|
|pull_request|opened, reopened, synchronize, closed|

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
