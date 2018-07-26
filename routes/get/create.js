var fse = require('fs-extra');
var path = require('path');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var route = function route(req, res, next, abe) {
	var lang = req.query.l;
	var key = decodeURIComponent(req.query.k);
	var value = decodeURIComponent(req.query.v);
	var jsonPath = path.join(abe.config.root, 'locales', lang + '.json');
	var json = abe.cmsData.file.get(jsonPath)
	json[key] = value;

	fse.writeJson(jsonPath, json, function () {
    abe.coreUtils.locales.instance.i18n[lang][key] = value;

		setTimeout(function () {
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({'msg': 'done !'}));
		}, 500)
	});

};

exports.default = route
