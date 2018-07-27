/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

let parentRevisionPromise;

async function injectButton(block) {
  let path = block.querySelector('h1.differential-file-icon-header').textContent;
  if (!isCoverageSupported(path)) {
    return;
  }

  let buttonDiv = block.querySelector('div.differential-changeset-buttons');

  function getLines() {
    return block.querySelectorAll('table.differential-diff tbody tr th:first-child');
  }

  let button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Loading Code Coverage...';
  button.disabled = true;
  button.className = 'button button-grey';
  buttonDiv.append(button);

  let parentRevision = await parentRevisionPromise;
  let data;
  if (!parentRevision) {
    data = null;
  } else {
    ({ data } = await fetchCoverage(parentRevision, path));
  }

  function applyOverlay(data) {
    for (let line of getLines()) {
      let lineNumber = parseInt(line.textContent);
      if (isNaN(lineNumber)) {
        continue;
      }
      if (!data.hasOwnProperty(lineNumber)) {
        continue;
      }

      if (data[lineNumber] > 0) {
        line.style.backgroundColor = 'greenyellow';
      } else {
        line.style.backgroundColor = 'tomato';
      }
    }
  }

  function removeOverlay() {
    for (let line of getLines()) {
      line.style.backgroundColor = '';
    }
  }

  let enabled = false;
  async function toggle() {
    enabled = !enabled;

    if (enabled) {
      applyOverlay(data);
    } else {
      removeOverlay();
    }
  }

  button.onclick = toggle;

  // Enable or disable the code coverage button.
  if (!data) {
    button.textContent = 'No Code Coverage Data'
  } else {
    button.disabled = false;
    button.textContent = 'Code Coverage'
  }
}

async function fetchParentRevision() {
  const revisionPHIDpattern = RegExp('/(PHID-DREV-[^/]*)/');
  let href = document.querySelector('a.policy-link[data-sigil=workflow]').getAttribute('href');
  let diffIdMatch = href.match(revisionPHIDpattern);
  if (!diffIdMatch) {
    console.error('diff id not found!');
    return null;
  }
  let phid = diffIdMatch[1];

  let revisionResponse = await phidToHg(phid);
  if (revisionResponse.error) {
    console.error(revisionResponse.error);
    return null;
  } else {
    return revisionResponse.revision;
  }
}

function inject() {
  parentRevisionPromise = fetchParentRevision();
  document.querySelectorAll('div[data-sigil=differential-changeset]').forEach(injectButton);
}

inject();
