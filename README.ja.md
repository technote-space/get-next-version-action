# Get Next Version Action

[![CI Status](https://github.com/technote-space/get-next-version-action/workflows/CI/badge.svg)](https://github.com/technote-space/get-next-version-action/actions)
[![codecov](https://codecov.io/gh/technote-space/get-next-version-action/branch/main/graph/badge.svg)](https://codecov.io/gh/technote-space/get-next-version-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/get-next-version-action/badge)](https://www.codefactor.io/repository/github/technote-space/get-next-version-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/get-next-version-action/blob/main/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

コミット履歴から次のバージョンを取得するための GitHub Actions です。

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
- [Options](#options)
- [Outputs](#outputs)
- [Action イベント詳細](#action-%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E8%A9%B3%E7%B4%B0)
  - [対象イベント](#%E5%AF%BE%E8%B1%A1%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 使用方法
例：リリースタグを付与
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
|MINOR_UPDATE_TYPES|マイナーアップデートのコミットタイプ|`feat`| |`feat, refactor`|
|EXCLUDE_MESSAGES|除外するコミットメッセージ| | |`tweaks`|
|BREAKING_CHANGE_NOTES|破壊的変更を示すキーワード|`BREAKING CHANGE`| |`BREAKING`|
|SET_ENV_NAME|環境変数名|`NEXT_VERSION`| |`NEW_TAG`|
|GITHUB_TOKEN|アクセストークン|`${{github.token}}`|true|`${{secrets.ACCESS_TOKEN}}`|

## Outputs
| name | description | e.g. |
|:---:|:---|:---:|
|current|現在のバージョン|`v1.2.3`|
|next|次のバージョン|`v1.3.0`|

## Action イベント詳細
### 対象イベント
| eventName | action |
|:---:|:---:|
|pull_request, pull_request_target|opened, reopened, synchronize, closed|

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
