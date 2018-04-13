/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

function getPanel() {
  return document.getElementByClassName('title_text');
}

function getPathHhg() {
  const page_header = document.querySelector('.page_header');
  if (!page_header) {
    return;
  }

  return page_header.lastElementChild.href.split('/mozilla-central/')[1];
}

(async function() {
  // Don't do anything if this isn't a file.
  if (!getPanel()) {
    return;
  }

  const path = getPathHg();
  if (!path || !isCoverageSupported(path)) {
    return;
  }

  // Get the current revision.
  const revPattern = new RegExp('/mozilla-central/rev/([0-9a-f]+)"');
  const revSpan = document.getElementByClassName('list');
  const m = revSpan.innerHTML.match(revPattern);
  const gitRev = m[1];
  const revPromise = gitToHg(gitRev);

  const button = injectToggle(revPromise, path);
  if (!button) {
    return;
  }

  const page_header = document.querySelector('.page_header');
  if (!page_header) {
    return;
  }
  page_header.parentNode.insertBefore(button, page_header);
})();
