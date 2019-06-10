/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const btn = require('./button');
const coverage = require('./coverage.js');
const dxr = require('./dxr-common.js');

(async function() {
  // Don't do anything if this isn't a file.
  if (!dxr.getNavigationPanel()) {
    return;
  }

  const path = dxr.getPath();
  if (!path || !coverage.isCoverageSupported(path)) {
    return;
  }

  // Get the current revision.
  const revPattern = new RegExp('/mozilla-central/commit/([0-9a-f]+)"');
  const revSpan = document.getElementById('rev-id');
  const m = revSpan.innerHTML.match(revPattern);
  const gitRev = m[1];
  const revPromise = coverage.gitToHg(gitRev);

  const button = btn.injectToggle(revPromise, path, dxr.applyOverlay, dxr.removeOverlay);
  if (!button) {
    return;
  }

  const breadcrumbs = document.querySelector('.breadcrumbs');
  if (!breadcrumbs) {
    return;
  }
  breadcrumbs.parentNode.insertBefore(button, breadcrumbs);
})();
