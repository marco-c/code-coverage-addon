"use strict";

const fs = require('fs');
const https = require('follow-redirects').https;
const archiver = require('archiver');

let options = {
    host: 'uplift.shipit.staging.mozilla-releng.net',
    path: '/coverage/supported_extensions',
    method: 'GET',
    headers: {"Content-Type": "text/plain"}
}


let req = https.get(options, (res) => {

	let data = '';
    
	res.on('data', (chunk) => {
		data += chunk;
	});

	res.on('end', () => {

		let content = `const SUPPORTED_EXTENSIONS = ${data};`;

		fs.writeFile("supported_extensions.js", content, (e) => {
    	if (e) {
    		console.log(e.message);
    	}
		});

		let excludeFiles = [
		".gitignore", ".travis.yml",
		"LICENSE", "README.md",
		"package.json", "package-lock.json",
		"requirements.txt", "setup.cfg",
		"build.js", "build.py"];
		

		fs.readdir(".", (e, files) => {
			const resultFiles = files.filter(file => !excludeFiles.includes(file));

			makeZip(resultFiles);
		});

  });

}).on('error', (e) => {
    console.log(e.message);
});

function makeZip(list){
	const output = fs.createWriteStream('./gecko-code-coverage.zip');

	let archive = archiver('zip', {
	    gzip: true,
	    zlib: { level: 9 }
	});

	archive.on('error', (e) => {
		if (e) {
			console.log(e.message);
		}
	});

	archive.pipe(output);

	list.forEach (file => {
		archive.file(file);
	});

	archive.finalize();
}

req.end();

