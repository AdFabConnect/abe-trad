'use strict';

var fs = require('fs');

var hooks = {
  afterEditorFormBlocks: function (blocks, json, abe) {
    var rex = /\{\{\{i18nAbe(.*?)lang \'(.*?)\'\}\}\}/g
    var tpl = abe.cmsTemplate.template.getTemplate(json.abe_meta.template);
    var matches = tpl.match(rex);
    if(matches){
      var index = 0;
      var isAlreadyAdded = [];
      blocks['i18n'] = {};
      var jsonData = abe.FileParser.getJson(abe.fileUtils.concatPath(abe.config.root, 'locales', json.lang + '.json'));
      matches.forEach(function (match) {
        var value = match.replace(rex, '$2').replace(/\\'/g, "'");
        if(isAlreadyAdded.indexOf(value) < 1) {
          isAlreadyAdded.push(value);
          blocks['i18n']['i18n_' + index++] = [{
            "type": "text",
            "key": "trad_" + index,
            "desc": value,
            "maxLength": "",
            "tab": "i18n",
            "placeholder": "",
            "value": jsonData[value],
            "source": null,
            "display": "",
            "reload": false,
            "order": "",
            "required": "",
            "editable": false,
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
  }
};

exports.default = hooks;