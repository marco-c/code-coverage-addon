/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

(function() {
  const container = document.getElementById('module-details-content');
  const field_has_str = document.getElementById('field_label_cf_has_str');

  var uplift;
  var j=0;
  var myString;
  var element =  document.getElementById('ct-'+j);
  var str = "Is this code covered by automated tests?";
  while (typeof(element) != 'undefined' && element != null){

  		var i;
  		for(i=0;i<element.length;i++){
  				myString = element.innerHTML;
  				if(myString==str){
  						uplift=element;
  				}
  		}

  		element =  document.getElementById('ct-'+j);
 }
  
  const bugzilla_modal_ui = !!container;
  const bugzilla_modal_ui_1 = !!element;

  const hgurlPattern = new RegExp('^http[s]?://hg\\.mozilla\\.org/mozilla-central/rev/([0-9a-f]+)$');
  const revs = [];
  let isFirst = false;
  let currentCommentId = '';
  const selector = bugzilla_modal_ui ? '.comment-text > a' : '.bz_comment_text > a';
  document.querySelectorAll(selector).forEach(a => {
    const parentId = a.parentNode.attributes.id;
    if (parentId !== currentCommentId) {
    // we're in a new comment
      currentCommentId = parentId;
      isFirst = false;
    }
    const prev = a.previousSibling;
    if (prev == null || (prev.previousSibling == null && !prev.textContent.trim())) {
    // the first element in the comment is the link (no text before)
      isFirst = true;
    }
    if (isFirst) {
    // so we take the first link and the following ones only if they match the pattern
      const link = a.href;
      const m = link.match(hgurlPattern);
      if (m != null) {
        let rev = m[1];
        if (rev.length > 12) {
          rev = rev.slice(0, 12);
        }
        revs.push(rev);
      }
    }
  });

  if (revs.length == 0) {
    return;
  }

  const valueDiv = document.createElement('div');
  valueDiv.classList.add('gecko_coverage_loader', 'gecko_coverage_loader_bugzilla');

  if (bugzilla_modal_ui) {
    const mainDiv = document.createElement('div');
    mainDiv.className = 'field';
    const nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    const a = document.createElement('a');
    a.className = 'help';
    a.textContent = 'Code Coverage:';
    a.href = 'https://addons.mozilla.org/firefox/addon/gecko-code-coverage/';
    nameDiv.append(a);
    mainDiv.appendChild(nameDiv);
    mainDiv.appendChild(valueDiv);
    container.appendChild(mainDiv);
    
  } else {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.setAttribute('class', 'field_label');
    tr.append(th);
    const a = document.createElement('a');
    a.className = 'field_help_link';
    a.title = 'Code coverage for landed patches';
    a.href = 'https://addons.mozilla.org/firefox/addon/gecko-code-coverage/';
    a.textContent = 'Code Coverage:';
    th.append(a);
    const td = document.createElement('td');
    td.setAttribute('class', 'field_value');
    td.setAttribute('colspan', 2);
    td.append(valueDiv);
    tr.append(td);
    field_has_str.parentNode.parentNode.insertBefore(tr, field_has_str.parentNode.nextSibling);
  }

  const selector_up = bugzilla_modal_ui ? '.comment-text > a' : '.bz_comment_text > a';
  document.querySelectorAll(selector_up).forEach(a => {
    const parentId_up = a.parentNode.attributes.id;
    if (parentId_up !== currentCommentId) {
    // we're in a new comment
      currentCommentId = parentId_up;
      isFirst = false;
    }
    const prev_up = a.previousSibling;
    if (prev_up == null || (prev_up.previousSibling == null && !prev_up.textContent.trim())) {
    // the first element in the comment is the link (no text before)
      isFirst = true;
    }
    if (isFirst) {
    // so we take the first link and the following ones only if they match the pattern
      const link_up = a.href;
      const m_up = link_up.match(hgurlPattern);
      if (m_up != null) {
        let rev = m[1];
        if (rev.length > 12) {
          rev = rev.slice(0, 12);
        }
        revs.push(rev);
      }
    }
  });

  if (revs.length == 0) {
    return;
  }

  

  if (bugzilla_modal_ui_1) {
    const mainDiv_up = document.createElement('div');
    mainDiv_up.className = 'field';
    const nameDiv_up = document.createElement('div');
    nameDiv_up.className = 'name';
    const a_up = document.createElement('a');
    a_up.className = 'help';
    a_up.textContent = 'Code Coverage:';
    a_up.href = 'https://addons.mozilla.org/firefox/addon/gecko-code-coverage/';
	nameDiv_up.append(a_up);
    mainDiv_up.appendChild(nameDiv_up);
    mainDiv_up.appendChild(valueDiv_up);
    element.appendChild(mainDiv_up);
    
  } else {
    const tr_up = document.createElement('tr');
    const th_up = document.createElement('th');
    th_up.setAttribute('class', 'field_label');
    tr_up.append(th);
    const a_up = document.createElement('a');
    a_up.className = 'field_help_link';
    a_up.title = 'Code coverage for landed patches';
    a_up.href = 'https://addons.mozilla.org/firefox/addon/gecko-code-coverage/';
    a_up.textContent = 'Code Coverage:';
    th_up.append(a_up);
    const td = document.createElement('td');
    td_up.setAttribute('class', 'field_value');
    td_up.setAttribute('colspan', 2);
    td_up.append(valueDiv);
    tr_up.append(td_up);
    uplift.parentNode.parentNode.insertBefore(tr, uplift.parentNode.nextSibling);
  }

  let promises = revs.map(fetchChangesetCoverage);

  Promise.all(promises)
    .then(results => {
      let added = 0;
      let covered = 0;
      for (let result of results) {
        added += result.commit_added;
        covered += result.commit_covered;
      }

      let errored = false;
      let missing = false;
      for (let result of results) {
        if (result.error) {
          errored = true;
          if (result.error.includes('Couldn\'t find a build')) {
            missing = true;
          }
        }
      }

      const span = document.createElement('span');
      if (errored) {
        if (missing) {
          span.textContent = 'The tests for the build containing the patches aren\'t finished running yet.';
        } else {
          span.textContent = 'Error while retrieving coverage information.';
        }
      } else if (added > 0) {
        if (covered > 0.7 * added) {
          span.style.color = 'green';
        } else if (covered > 0.2 * added) {
          span.style.color = 'goldenrod';
        } else {
          span.style.color = 'red';
        }
        span.textContent = `${covered} lines covered out of ${added} lines added`;
      } else {
        span.textContent = 'No instrumented lines added.';
      }
      valueDiv.className = 'value';
      valueDiv.appendChild(span);
      if (added > 0) {
        valueDiv.appendChild(document.createTextNode(' ('));
        let aElems = results.filter(result => result.commit_added > 0).map(result => {
          let a = document.createElement('a');
          a.href = `https://firefox-code-coverage.herokuapp.com/#/changeset/${result.rev}`;
          a.textContent = result.rev;
          return a;
        });

        for (let i = 0; i < aElems.length; i++) {
          valueDiv.appendChild(aElems[i]);
          if (i != aElems.length - 1) {
            valueDiv.appendChild(document.createTextNode(', '));
          }
        }

        valueDiv.appendChild(document.createTextNode(')'));
      }
    });
})();
