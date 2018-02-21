"use strict";

const fs = require('fs');
const http = require('follow-redirects').http;
const archiver = require('archiver');

var options = {
    host: 'uplift.shipit.staging.mozilla-releng.net',
    path: '/coverage/supported_extensions',
    method: 'GET',
    headers: {"Content-Type": "text/plain"}
}


var req = http.request(options, (res) => {

	var data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {

        fs.writeFile("supported_extensions.js", "const SUPPORTED_EXTENSIONS = " + data, (e) => {
	    	if(e) {
	    		console.log(e.message);
	    	}
		});

		var excludeFiles = [".gitignore", ".travis.yml", "LICENSE", "README.md", "package.json",
			  "package-lock.json", "requirements.txt", "setup.cfg", "build.js", "build.py"];
		
		var resultFiles = [];

		fs.readdir(".", (err, files) => {
			files.forEach(file => {

				if(excludeFiles.indexOf(file) == -1){
					resultFiles.push(file);
				}

				if(files.indexOf(file) == files.length - 1){
					makeZip(resultFiles);
				}
			});
		});

    });

}).on('error', (e) => {
    console.log(e.message);
});

req.end();

function makeZip(list){
	var output = fs.createWriteStream('./gecko-code-coverage.zip');

	var archive = archiver('zip', {
	    gzip: true,
	    zlib: { level: 9 }
	});

	archive.on('error', function(e) {
		if(e){
			console.log(e.message)
		}
	});

	archive.pipe(output);

	list.forEach(file => {
		archive.file(file, {name: file});
	});

	archive.finalize();
}