/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const COVERAGE_BACKEND = 'https://coverage.testing.moz.tools/v2'

async function fetchCoverage(rev, path) {
  console.debug('Fetch Coverage for', rev, path);
  // TODO: add changeset argument when it works with latest rev
  let response = await fetch(COVERAGE_BACKEND + `/path?path=${path}`);
  return await response.json();
}

function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function waitIdle(time) {
  await wait(time);
  return new Promise(resolve => requestIdleCallback(resolve));
}

async function fetchChangesetCoverage(rev) {
  let ready = false;
  do {
    let response = await fetch(`https://coverage.moz.tools/coverage/changeset_summary/${rev}`);

    if (response.status == 202) {
      await wait(5000);
      continue;
    }

    let result = await response.json();
    result['rev'] = rev;
    return result;
  } while (!ready);
}

async function gitToHg(gitrev) {
  let response = await fetch(`https://mapper.mozilla-releng.net/gecko-dev/rev/git/${gitrev}`);
  if (!response.ok) {
    throw new Error(`Error retrieving git to mercurial mapping for ${gitrev}.`);
  }
  let text = await response.text();
  return text.split(' ')[1];
}

function isCoverageSupported(path) {
  return SUPPORTED_EXTENSIONS.findIndex(ext => path.endsWith(`.${ext}`)) != -1;
}
