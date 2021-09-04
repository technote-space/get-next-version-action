# Get Next Version Action

[![CI Status](https://github.com/technote-space/get-next-version-action/workflows/CI/badge.svg)](https://github.com/technote-space/get-next-version-action/actions)
[![codecov](https://codecov.io/gh/technote-space/get-next-version-action/branch/main/graph/badge.svg)](https://codecov.io/gh/technote-space/get-next-version-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/get-next-version-action/badge)](https://www.codefactor.io/repository/github/technote-space/get-next-version-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/get-next-version-action/blob/main/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

GitHub Actions to get next version from commit histories.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Usage](#usage)
- [Options](#options)
- [Outputs](#outputs)
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
      - main
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
| name | description | default | required | e.g. |
|:---:|:---|:---:|:---:|:---:|
|MINOR_UPDATE_TYPES|Minor update commit types|`feat`| |`feat, refactor`|
|EXCLUDE_MESSAGES|Exclude messages| | |`tweaks`|
|BREAKING_CHANGE_NOTES|Breaking change notes|`BREAKING CHANGE`| |`BREAKING`|
|SET_ENV_NAME|Env name|`NEXT_VERSION`| |`NEW_TAG`|
|GITHUB_TOKEN|Access token|`${{github.token}}`|true|`${{secrets.ACCESS_TOKEN}}`|

## Outputs
| name | description | e.g. |
|:---:|:---|:---:|
|current|current version|`v1.2.3`|
|next|next version|`v1.3.0`|

## Action event details
### Target events
| eventName | action |
|:---:|:---:|
|pull_request, pull_request_target|opened, reopened, synchronize, closed|

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
