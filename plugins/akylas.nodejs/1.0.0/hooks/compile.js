var path = require('path');
var fs = require('fs');

exports.init = function (logger, config, cli, appc) {
	var ourResourcesDir = path.resolve(path.join(__dirname, '..', 'Resources'))
	var platform = cli.argv['platform'];
	if (!platform) {
		return;
	}
	if (platform === 'iphone' || platform === 'ipad') {
		platform = 'ios';
	}

	var requires = ['buffer'];
	var recursiveRequires = {};
	var requireRegexp = /(?:(?:import(?:.*?)from)|(?:require\())\s*['"](.*?)['"]/g;





	function getRequires(from) {
		var result;
		var content = fs.readFileSync(from).toString(),
			match;
		while (match = requireRegexp.exec(content)) {
			result = result || [];
			result.push(match[1]);
		}
		return result;
	}


	var files = fs.readdirSync(ourResourcesDir);
	files.forEach(function (file) {
		if (/\.(ts|js)$/.test(file)) {
			var requires = getRequires(path.join(ourResourcesDir, file));
			if (requires) {
				recursiveRequires[file.slice(0, -path.extname(file).length)] = requires;
			}
		}

	});


	cli.on('build.' + platform + '.resourcesPaths', {
		pre: function (data, finished) {
			var args = data.args[0];
			args.push(ourResourcesDir);
			finished();
		}
	});
	cli.on('build.' + platform + '.walkResource', {
		pre: function (data, finished) {
			var info = data.args[0];

			if (info.origSrc === ourResourcesDir) {
				if (requires.indexOf(info.name) === -1) {
					info.ignored = true;
				}
			} else if (info.ext === 'js' || info.ext === 'ts') {
				var newrequires = getRequires(info.src);
				while (newrequires) {
					requires = requires.concat(newrequires);
					var oldNewrequires = newrequires;
					newrequires = undefined;
					oldNewrequires.forEach(function (newrequire) {
						if (recursiveRequires.hasOwnProperty(newrequire)) {
							newrequires = (newrequires || []).concat(recursiveRequires[newrequire]);
						}
					});
				}

			}
			finished();
		}
	});

	// cli.on('build.' + platform + '.analyzeJs', {
	// 	pre: function(data, finished) {
	// 		var to = data.args[0],
	// 			content = data.args[1];
	// 		mystring.replace(requireRegexp, function(required) {
	// 			console.log('nodejs analyse', to, required);
	// 			requires.push(required);
	// 		});

	// 		finished();
	// 	}
	// });
	// cli.addHook('build.ios.copyResource', onCopyResource);

	// cli.addHook('build.android.processTiSymbols', function(data, finished) {

	// 	finished();
	// });
};