var fse = require('fs-extra');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var route = function route(req, res, next, abe) {
	var lang = req.query.l;
	var key = decodeURIComponent(req.query.k);
	var value = decodeURIComponent(req.query.v);
	var jsonPath = abe.fileUtils.concatPath(abe.config.root, 'locales', lang + '.json');
	var json = abe.FileParser.getJson(jsonPath)
	json[key] = value;

	fse.writeJson(jsonPath, json, function () {
		abe.Locales.instance._reloadLocales();
		setTimeout(function () {
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({'msg': 'done !'}));
		}, 500)
	});

};

exports.default = route
