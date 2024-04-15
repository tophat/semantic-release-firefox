# semantic-release-firefox-add-on
[![Semantic Release Firefox Add-on
CICD](https://github.com/tophat/semantic-release-firefox-add-on/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/tophat/semantic-release-firefox-add-on/actions/workflows/main.yml)
[![npm version](https://img.shields.io/npm/v/semantic-release-firefox-add-on.svg)](https://badge.fury.io/js/semantic-release-firefox-add-on)
[![codecov](https://codecov.io/gh/tophat/semantic-release-firefox-add-on/branch/master/graph/badge.svg)](https://codecov.io/gh/tophat/semantic-release-firefox-add-on)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)

## Overview

<img align="right" width="200" height="200" src="https://user-images.githubusercontent.com/2528959/65039978-65686780-d921-11e9-9d2a-48a5063ccb94.png" alt="Logo">

This package provides a set of [`semantic-release`][semantic-release] plugins for you to easily publish Firefox add ons automatically. Mozilla requires that even self-distributed packages are signed through the add on store. Given a built package, it will write the correct version number into `manifest.json` and upload the dist folder to the add on store. The package will be validated by Mozilla, and if valid, a signed distribution will be returned and downloaded into the artifacts folder.

## Motivation

We were working on a dev tooling extension internally and wanted to release it through the Chrome web store and Mozilla Add On store. The [`semantic-release-chrome`][semantic-release-chrome] extension worked wonderfully, but we kept struggling to find a [`semantic-release`][semantic-release] plugin for FireFox that worked the way we wanted. After finding that [`web-ext`][web-ext] had a Node api, we just built our own plugins using `web-ext` to accomplish the goal.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```bash
npm install --save-dev semantic-release-firefox-add-on
```

### Mozilla Add On authentication

You will need to get two parameters from the Add On store: an `API Key`, and a `Secret Key`. For more information on how to get those parameters and how to set the environment variables which are required in order for this plugin to work properly, read [this guide](https://addons-server.readthedocs.io/en/latest/topics/api/auth.html#access-credentials).

web-ext takes care of creation of the JWT, the only items needed are the `API Key` and `Secret Key`.

## Usage

This package export the following plugins:

### `verifyConditions`

Verify the following:

- That environment variables are set for Add On store authentication
- That an extensionId was specified in the configuration
- That the source directory is built and that we can locate the manifest.json file within the source directory

### Environment variables

- `FIREFOX_API_KEY`: **REQUIRED** Mozilla add-on server api key used in webext sign command
- `FIREFOX_SECRET_KEY`: **REQUIRED** Mozilla add-on server api secret used in webext signing

For more information on the source of these values, see [Mozilla Add On authentication](#mozilla-add-on-authentication)

#### `verifyConditions` parameters


- `targetXpi`: **REQUIRED** The filename of the XPI file to store in the artifacts directory.

- `extensionId`: The extension id of the extension from the Mozilla Add On store. Must either be set in `manifest.json` or provided here. If this is not specified then a new extension will be created each time the release is run. In order to avoid issues arising due to this, the extension must be created in the Add On store first and the extension Id put into the semantic release configuration.

- `sourceDir`: The path of the source directory. Defaults to `dist`.

- `manifestPath`: The location of the manifest file within the source directory. Defaults to `manifest.json`.

### `prepare`

Writes the correct version to the `manifest.json`.

This plugin requires some parameters to be set, so be sure to check below and fill them accordingly.

#### `prepare` parameters

- `sourceDir`: The path of the source directory. Defaults to `dist`.

- `manifestPath`: The location of the manifest file within the source directory. Defaults to `manifest.json`.

### `publish`

Creates an unsigned XPI file out of the source directory and uploads it to the Mozilla Add On, using the web-ext sign command. The output from the sign command will be passed through to the console. If the package is validated and signed, it will download the signed XPI file and store it in the artifacts directory under the specified file name. If the package is validated but not signed (including the case where manual review is required), it will store the unsigned XPI file in the artifacts directory.

#### `publish` parameters


- `targetXpi`: **REQUIRED** The filename of the XPI file to store in the artifacts directory.

- `extensionId`: The extension id of the extension from the Mozilla Add On store.

- `sourceDir`: The path of the source directory. Defaults to `dist`.

- `channel`: The release channel, options are `unlisted` or `listed`. An unlisted add on is not published to the store and is justed signed. Defaults to `unlisted`.

- `artifactsDir`: The location to store the signed XPI file when it is returned from Mozilla. Defaults to `./artifacts`.

## Contribution

Follow the [contributing guide](docs/contributing.md).

### Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/dbasilio"><img src="https://avatars0.githubusercontent.com/u/8311284?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Daniel Basilio</b></sub></a><br /><a href="https://github.com/tophat/semantic-release-firefox-add-on/commits?author=dbasilio" title="Code">💻</a> <a href="https://github.com/tophat/semantic-release-firefox-add-on/commits?author=dbasilio" title="Documentation">📖</a> <a href="#maintenance-dbasilio" title="Maintenance">🚧</a> <a href="#ideas-dbasilio" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/tophat/semantic-release-firefox-add-on/pulls?q=is%3Apr+reviewed-by%3Adbasilio" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://emmanuel.ogbizi.com"><img src="https://avatars0.githubusercontent.com/u/2528959?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Emmanuel Ogbizi</b></sub></a><br /><a href="https://github.com/tophat/semantic-release-firefox-add-on/commits?author=iamogbz" title="Code">💻</a> <a href="https://github.com/tophat/semantic-release-firefox-add-on/commits?author=iamogbz" title="Documentation">📖</a> <a href="#design-iamogbz" title="Design">🎨</a> <a href="#infra-iamogbz" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/tophat/semantic-release-firefox-add-on/commits?author=iamogbz" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/iorate"><img src="https://avatars3.githubusercontent.com/u/682043?v=4?s=100" width="100px;" alt=""/><br /><sub><b>iorate</b></sub></a><br /><a href="https://github.com/tophat/semantic-release-firefox-add-on/commits?author=iorate" title="Code">💻</a></td>
    <td align="center"><a href="https://www.karnov.club/"><img src="https://avatars.githubusercontent.com/u/6210361?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marc Cataford</b></sub></a><br /><a href="#infra-mcataford" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

_Add more contributors using [all-contributors](https://allcontributors.org/)_
_by adding comments in PRs:_

```text
@all-contributors please add <username> for <contribution type>
```

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[semantic-release]: https://github.com/semantic-release/semantic-release
[semantic-release-chrome]: https://github.com/GabrielDuarteM/semantic-release-chrome
[web-ext]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext
