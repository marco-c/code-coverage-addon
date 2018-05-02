/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

let filename = "";
let revision = "";
const linePattern = new RegExp("^l([0-9]+)$");

document.querySelectorAll("title").forEach(title => {
  const titlePattern = new RegExp("^mozilla-central: ([^@]+)@([0-9a-f]+)(?: \\(annotated\\))?$");
  const m = title.innerText.match(titlePattern);
  if (m) {
    filename = m[1];
    revision = m[2];
  }
  return;
});

async function applyOverlay(revPromise, path) {
  let result = await getCoverage(revPromise, path);
  if (!result.hasOwnProperty("data")) {
    throw new Error("No 'data' field");
  }
  const data = result["data"];
  document.querySelectorAll("[id^='l']").forEach(e => {
    const m = e.id.match(linePattern);
    if (m) {
      const linenum = m[1];
      if (data.hasOwnProperty(linenum)) {
        if (data[linenum] > 0) {
          e.style.backgroundColor = "greenyellow";
        } else {
          e.style.backgroundColor = "tomato";
        }
      }
    }
  });
}

function removeOverlay() {
  document.querySelectorAll("[id^='l']").forEach(e => {
    const m = e.id.match(linePattern);
    if (m) {
      e.style.backgroundColor = "";
    }
  });
}

let div_header = null;
document.querySelectorAll(".page_header").forEach(div => {
  div_header = div;
  return;
});
if (div_header) {
  const button = injectToggle(revision, filename);
  div_header.append(button);
}
