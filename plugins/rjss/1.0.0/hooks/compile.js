var fs = require('fs'),
	path = require('path'),
	cp = require('child_process'),
	exec = cp.exec,
	spawn = cp.spawn;

exports.cliVersion = '>=3.X';
var addSymbolReg = /(?:new\s+)([a-zA-z]+)(?:\s*\()|(?:\b(?:Ti|Titanium)\.([^\n\b\t\s\(\)'",;\{\}]*)\b)/gm;

function isDir(dir) {
	return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory();

}

function mkDirsSync(thePath) {
	var originPath = path.dirname(thePath);
	var rootPath = originPath;
	if (fs.existsSync(rootPath)) {
		return;
	}
	var newPath;
	while (rootPath && (newPath = path.dirname(rootPath)) !== rootPath && !fs.existsSync(newPath)) {
		rootPath = newPath;
	}
	if (originPath !== rootPath) {
		//we found the root to start from
		var split = path.relative(rootPath, originPath).split('/');
		for (var i = 0; i < split.length; i++) {
			fs.mkdirSync(rootPath);
			rootPath = path.join(rootPath, split[i]);
		}
	}

	fs.mkdirSync(rootPath);
}

function removefilesfromregex(regex, currentDirectory, logger) {
	logger.debug('removefilesfromregex' + currentDirectory);
	if (!isDir(currentDirectory)) {
		return;
	}

	fs.readdirSync(currentDirectory).forEach(function (file) {
		var path = currentDirectory + '/' + file;
		if (fs.lstatSync(path).isDirectory())
			removefilesfromregex(regex, path, logger);
		else if (regex.test(path))
			fs.unlink(path);
	});
}

function findRJSS(rootDir, destDir, currentDirectory, logger) {
	if (!isDir(currentDirectory)) {
		return;
	}
	fs.readdirSync(currentDirectory).forEach(function (file) {
		var path = currentDirectory + '/' + file;
		if (fs.lstatSync(path).isDirectory())
			findRJSS(rootDir, destDir, path, logger);
		else if (/.rjss$/.test(path))
			compileRJSS(rootDir, destDir, path, logger)
	});
}

function compileRJSS(rootDir, destDir, filePath, logger) {
	var rjss = fs.readFileSync(filePath, 'utf8').replace(/[\r\t\n]/g, ' '),
		result = '',
		braceDepth = 0,
		inComment = false,
		inSelector = false,
		inAttributeBrace = false,
		inBracket = false,
		canStartSelector = true,
		canBeAttributeBrace = false,
		inIfStatement = false,
		inOrientation = false,
		overloads = /overloads/.test(filePath),
		methodName = (overloads === true) ? 'redux.setOverload' : 'redux.setDefault',
		inVariable = false;

	for (var i = 0, j = rjss.length; i < j; i++) {
		var currentChar = rjss[i];
		if (inComment === true) {
			if (currentChar === '/' && rjss[i - 1] === '*')
				inComment = false;
			continue;
		}

		function space() {
			if (inBracket === true)
				result += currentChar;
		}

		function slash() {
			inComment = (rjss[i + 1] === '*');
			if (inComment === true)
				result += '';
			else
				result += currentChar;
		}

		function leftBracket() {
			if (braceDepth > 0 || inVariable === true)
				result += currentChar;
			else {
				canStartSelector = false;
				inIfStatement = true;
				result += '\nif (';
			}
		}

		function bracket() {
			inBracket = (inBracket === false);
			result += currentChar;
		}

		function equals() {
			if (inIfStatement && rjss[i - 1] !== '!' && rjss[i - 1] !== '<' && rjss[i - 1] !== '>' && rjss[i - 1] !== '=')
				result += '==';
			else
				result += currentChar;
		}

		function rightBracket() {
			if (braceDepth > 0 || inVariable === true)
				result += currentChar;
			else {
				canStartSelector = true;
				result += ')';
				inIfStatement = false;
				canBeAttributeBrace = true;
			}
		}

		function leftBlock() {
			if (inVariable === true) {
				braceDepth += 1;
			} else if (canBeAttributeBrace === true) {
				canBeAttributeBrace = false;
				inAttributeBrace = true;
			} else {
				if (inSelector === true) {
					inSelector = false;
					result += '",';
				}
				braceDepth += 1;
			}
			result += currentChar;
		}

		function rightBlock() {
			if (inVariable) {
				braceDepth -= 1;
				if (braceDepth == 0) {
					inVariable = false;
					canStartSelector = true;
				}
				inVariable = false;
				canStartSelector = true;
				result += currentChar;
				return;
			}
			braceDepth -= 1;
			result += currentChar;
			switch (braceDepth) {
				case 0:
					if (rjss[i + 1] !== '(') {
						result += ');';
						canStartSelector = true;
					} else {
						inOrientation = true;
						result += ',';
					}
					break;
				case -1:
					inAttributeBrace = false;
					braceDepth = 0;
					break;
			}
		}

		function defaultCase() {
			canBeAttributeBrace = false;
			if (braceDepth === 0 && canStartSelector === true) {
				canStartSelector = false;
				inSelector = true;
				result += '\n' + methodName + '("';
			}
			result += currentChar;
		}

		function leftParenthesis() {
			if (inOrientation === false)
				defaultCase();
		}

		function rightParenthesis() {
			if (inOrientation === true) {
				result += ');';
				inOrientation = false;
				canStartSelector = true;
			} else {
				result += currentChar;
			}
		}

		function variable() {
			if (braceDepth == 0 && canStartSelector) {
				canStartSelector = false;
				inVariable = true;
				result += 'this.' + currentChar;
			} else {
				result += currentChar;
			}
		}

		function semicolon() {
			if (inVariable) {
				canStartSelector = true;
				inVariable = false;
			}
			result += currentChar;
		}

		switch (currentChar) {
			case '$':
			case '_':
				variable();
				break;
			case ';':
				semicolon();
				break;
			case ' ':
				space();
				break;
			case '/':
				slash();
				break;
			case '\'':
				bracket();
				break;
			case '"':
				bracket();
				break;
			case '[':
				leftBracket();
				break;
			case '=':
				equals();
				break;
			case ']':
				rightBracket();
				break;
			case '{':
				leftBlock();
				break;
			case '}':
				rightBlock();
				break;
			case '(':
				leftParenthesis();
				break;
			case '(':
				rightParenthesis();
				break;
			default:
				defaultCase();
		}
	}


	var newPath = path.join(destDir, path.relative(rootDir, filePath)) + '.compiled.js';
	var dirName = path.dirname(newPath);
	var joinedPath = path.join(dirName, 'joined.rjss.compiled.js');
	if (!fs.existsSync(joinedPath)) {
		mkDirsSync(joinedPath);
		result = 'const redux = ak.ti.redux;\n' + result;
	}


	logger.debug('compileRJSS: %s to %s', filePath.cyan, joinedPath.cyan);
	// mkDirsSync(joinedPath);
	fs.appendFileSync(joinedPath, result);
}

function deployTypeFromTarget(_target) {
	if (_target === 'dist-appstore') return 'production';
	if (_target === 'dist-playstore') return 'production';
	if (_target === 'device' || _target === 'dist-adhoc') return 'test';
	return 'development';
}

// var reduxData = {
// 	// events: [
// 	// 	'beforeload', 'blur', 'change', 'click', 'close', 'complete', 'dblclick', 'delete', 'doubletap',
// 	// 	'error', 'focus', 'load', 'move', 'open', 'return', 'scroll', 'scrollend', 'selected', 'singletap',
// 	// 	'swipe', 'touchcancel', 'touchend', 'touchmove', 'touchstart', 'twofingertap', 'itemclick'
// 	// ],
// 	types: {
// 		// Contacts: [
// 		// 	'Group', 'Person'
// 		// ],
// 		// Filesystem: [
// 		// 	'TempDirectory', 'TempFile'
// 		// ],
// 		// Media: [
// 		// 	'AudioPlayer', 'AudioRecorder', 'Item', 'MusicPlayer', 'Sound', 'VideoPlayer'
// 		// ],
// 		Network: [
// 			'BonjourBrowser', 'BonjourService', 
// 			'HTTPClient', 'TCPSocket'
// 		],
// 		Platform: [
// 			'UUID'
// 		],
// 		Stream: [
// 			'Stream'
// 		],
// 		UI: [
// 			'2DMatrix', '3DMatrix', 
// 			'ActivityIndicator', 'AlertDialog',
// 			'Animation', 
// 			'Button',
// 			'ButtonBar',
// 			'EmailDialog', 
// 			'ImageView', 'Label',
// 			'Notification', 'OptionDialog', 'Picker', 'PickerColumn', 'PickerRow', 'ProgressBar', 'ScrollView',
// 			'ScrollableView', 'SearchBar', 'Slider', 'Switch', 'Tab', 'TabGroup', 'TabbedBar',
// 			'TableView', 'TableViewRow', 'TableViewSection', 
// 			'TextArea', 'TextField', 'Toolbar', 'View', 'WebView', 'Window',
// 			'ListView', 'ListSection', 'NavigationWindow', 'CollectionView', 'CollectionSection'
// 		]
// 	}
// };
// var reduxDataInversed = {};

// function processInversed(obj, prefix) {
// 	if (Array.isArray(obj)) {
// 		for (var i = 0; i < obj.length; i++) {
// 			var name = obj[i];
// 			reduxDataInversed[name] = prefix + '.' + name;
// 		};
// 	} else if (obj !== null && typeof obj === 'object') {
// 		for (var propertyName in obj) {
// 			processInversed(obj[propertyName], prefix ? (prefix + "." + propertyName) : propertyName);
// 		}
// 	}
// }
// processInversed(reduxData.types);

exports.init = function (logger, config, cli, appc) {
	var needsToRun = true;
	var projectDir = cli.argv['project-dir'];
	var platform = cli.argv['platform'];
	if (!platform) {
		return;
	}
	if (platform === 'iphone' || platform === 'ipad') {
		platform = 'ios';
	}
	var hook = 'build.' + platform + '.resourcesPaths';
	var that = this;
	logger.info('RJSS projectDir:' + projectDir);
	logger.info('RJSS platform:' + platform);
	logger.info('RJSS hook:' + hook);
	// var resourcesPaths = [path.join(projectDir, 'Resources'), path.join(projectDir, 'Resources', platform)];

	cli.addHook('build.pre.compile', function (data, finished) {
		var deployType = data.deployType || deployTypeFromTarget(data.target);
		// shouldNotCompile = (!/store|adhoc/.test(data.target));
		shouldNotCompile = data.deployType === 'development';
		needsToRun = !shouldNotCompile;
		if (needsToRun === true) {
			var destDir = path.join(data.buildDir, 'rjss');
			removefilesfromregex(/.rjss.compiled.js$/, destDir, logger);
			var regex = data.config.cli.ignoreFiles;
			logger.debug('compiling RJSS files ' + regex);
			regex = regex.replace(')$', '|\.*\\.rjss)$');
			data.config.cli.ignoreFiles = regex;
			data.ignoreFiles = new RegExp(regex);
			logger.debug('compiling RJSS files2 ' + regex);

			if (!config.plugins) {
				config.plugins = {
					'ignoreFiles': []
				};
			}
			config.plugins['ignoreFiles'].push('.rjss$');
			cli.on(hook, {
				pre: function (data, finished) {
					var paths = data.args[0];
					logger.debug(' RJSS resourcesPaths hook ' + paths);
					paths.forEach(function (dir) {
						findRJSS(dir, destDir, dir, logger);
					}, that);
					paths.push(destDir);
					finished();
				}
			});
		}
		// } else {
		finished();
		// }
	});

	// cli.addHook('build.post.compile', function(data, finished) {
	// 	//we need to remove .rjss from assets directory
	// 	if (needsToRun === true) {
	// 		cli.createHook(hook, that, function(_resourcesPaths) {
	// 			_resourcesPaths.forEach(function(dir) {
	// 				removefilesfromregex(/.rjss.compiled.js$/, dir, logger);
	// 			}, that);
	// 			// finished();
	// 		})(resourcesPaths, function() {});
	// 	}
	// 	// } else {
	// 	finished();
	// 	// }
	// });

	cli.addHook('build.ios.config', function (data, finished) {
		if (needsToRun === true) {
			var regex = data.config.cli.ignoreFiles;
			regex = regex.replace(')$', '|.rjss|.git)$');
			data.config.cli.ignoreFiles = regex;
		};
		finished();
	});

	cli.addHook('build.finalize', function (data, finished) {
		finished();
	});

	// var handledSymbols = [];


	// function onCopyResource(data, finished) {
	// 	var from = data.args[0],
	// 		to = data.args[1];
	// 	if (from.match(/\.(rjss|rjss.compiled.js)$/)) {
	// 		tiSymbols = data.ctx.tiSymbols;
	// 		var data = fs.readFileSync(from, 'utf8');
	// 		if (data) {
	// 			var match;
	// 			match = addSymbolReg.exec(data);
	// 			while (match != null) {
	// 				var key = (match[1] || match[2]);
	// 				var creator = match[1] ? reduxDataInversed[match[1]] : match[2];
	// 				if (creator && handledSymbols.indexOf(creator) === -1) {
	// 					logger.debug('RJSS addSymbol %s', creator);
	// 					handledSymbols.push(creator);
	// 					if (tiSymbols[from]) {
	// 						tiSymbols[from].push(creator);
	// 					} else {
	// 						tiSymbols[from] = [creator];
	// 					}
	// 				}
	// 				match = addSymbolReg.exec(data);
	// 			}
	// 		}
	// 	}

	// 	finished();
	// };

	// cli.addHook('build.' + platform + '.copyResource', onCopyResource);
	// cli.addHook('build.ios.copyResource', onCopyResource);

	// cli.addHook('build.android.processTiSymbols', function(data, finished) {

	// 	finished();
	// });
};