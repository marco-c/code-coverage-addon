/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const hgurlPattern = new RegExp("^http[s]?://hg\\.mozilla\\.org/mozilla-central/annotate/([0-9a-f]+)/([^#]+)#l([0-9]+)$");
// fileinfo: filename => { revision => [{line, element}, ...] }
const fileinfo = {};
document.querySelectorAll("#frames table:first-of-type td > a[href^='https://hg.mozilla.org/mozilla-central/annotate/']").forEach(a => {
    const m = a.href.match(hgurlPattern);
    if (m !== null) {
        const filename = m[2];
        if (isCoverageSupported(filename)) {
            const line = m[3];
            if (line !== "0") { // shouldn't happen... but irl it happens
                const revision = m[1].slice(0, 12); // shorten the revision
                const i = {"line": line,
                           "element": a.parentNode};
                let f;
                if (filename in fileinfo) {
                    f = fileinfo[filename];
                } else {
                    f = fileinfo[filename] = {};
                }
                if (revision in f) {
                    f[revision].push(i);
                } else {
                    f[revision] = [i];
                }
            }
        }
    }
});

if (Object.keys(fileinfo).length != 0) {
    const spinnerDiv = document.createElement("div");
    spinnerDiv.classList.add("gecko_coverage_loader", "gecko_coverage_loader_socorro");
    spinnerDiv.style.display = "inline-block";

    for (let filename in fileinfo) {
        const info = fileinfo[filename];
        for (let revision in info) {
            const lps = info[revision];

            // Add the spinners
            for (let lp of lps) {
                const e = spinnerDiv.cloneNode();
                lp.element.append(e);
                lp.element = e;
            }
            fetchCoverage(revision, filename).then(data => {
                if (data !== null && !data.hasOwnProperty("error")) {
                    for (let lp of lps) {
                        const line = lp.line;
                        if (line in data) {
                            // line is covered or uncovered
                            lp.element.parentNode.style.backgroundColor = data[line] == 0  ? "tomato" : "greenyellow";
                        }
                    }
                }
                // Remove all the spinners
                for (let lp of lps) {
                    lp.element.className = "";
                }
            });
        }
    }
}
