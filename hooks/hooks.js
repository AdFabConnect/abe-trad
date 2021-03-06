'use strict';

var fs = require('fs');
var path = require('path');
var hdb = null;

var hooks = {
  afterEditorFormBlocks: function (blocks, json, text, abe) {
    var rex = /\{\{\{i18nAbe(.*?)lang \'(.*?)\'\}\}\}/g
    if(abe.config && abe.config.regex) {
      rex = new RegExp(abe.config.regex, 'g');
    }
    var tpl = text;
    var matches = tpl.match(rex);
    if(matches){
      var index = 0;
      var isAlreadyAdded = [];
      blocks['i18n'] = {};
      var jsonData = abe.cmsData.file.get(path.join(abe.config.root, 'locales', (typeof json.lang === 'string' ? json.lang : json.lang.value) + '.json'));
      matches.forEach(function (match) {
        var value = match.replace(rex, '$2').replace(/\\'/g, "'");
        if(isAlreadyAdded.indexOf(value) < 0) {
          isAlreadyAdded.push(value);
          blocks['i18n']['i18n_' + index++] = [{
            "type": "text",
            "key": "trad_" + index,
            "desc": value,
            "maxLength": "",
            "tab": "i18n",
            "placeholder": value,
            "value": jsonData[value],
            "source": null,
            "display": "",
            "reload": false,
            "order": "",
            "required": "",
            "editable": true,
            "visible": "",
            "block": "",
            "autocomplete": "",
            "paginate": "",
            "hint": ""
          }];
        }
      });
    }

    return blocks;
  },
  afterHandlebarsHelpers: (Handlebars, abe) => {
    hdb = Handlebars
    return Handlebars
  },
  afterImport: function(res, file, conf, ctx, abe) {
    if(file === 'engine' && hdb.helpers.getCurrentuserRole){
      res = res.replace('text-i18n status-{{@root.json.abe_meta.status}}', 'text-i18n status-{{@root.json.abe_meta.status}} role-{{getCurrentuserRole this}}');
    }
    else if(file === 'engine'){
      res = res.replace('text-i18n status-{{@root.json.abe_meta.status}}', 'text-i18n status-{{@root.json.abe_meta.status}} role-admin');
    }
    return res;
  }
};

exports.default = hooks;
