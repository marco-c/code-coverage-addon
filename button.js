/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

let resultPromise;
async function getCoverage(revPromise, path) {
  if (!resultPromise) {
    resultPromise = (async function() {
      const rev = await revPromise;
      return fetchCoverage(rev, path);
    })();
  }

  return resultPromise;
}

function disableButton(button, text) {
  button.setAttribute('disabled', 'disabled');
  button.style['cursor'] = 'not-allowed';
  button.title = text;
}

function injectToggle(revPromise, path) {
  // Preload coverage data.
  getCoverage(revPromise, path);

  const spinner = document.createElement('div');
  spinner.classList.add('gecko_coverage_loader', 'gecko_coverage_loader_dxr');

  let button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Code Coverage ';
  button.className = 'gecko_code_coverage_toggle_button';

  let enabled = false;
  async function toggle() {
    enabled = !enabled;
    if (enabled) {
      button.appendChild(spinner);
      try {
        await applyOverlay(revPromise, path);
        button.removeChild(spinner);
        button.style.backgroundColor = 'lightgrey';
      } catch (ex) {
        button.style.backgroundColor = 'red';
        button.removeChild(spinner);
        disableButton(button, 'Error retrieving coverage information for this file');
      }
    } else {
      removeOverlay();
      button.style.backgroundColor = 'white';
    }
  }

  button.onclick = toggle;

  document.onkeyup = function(e) {
    if (e.key == 'c') {
      toggle();
    }
  };

  return button;
}
