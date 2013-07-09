/*jslint indent: 2,maxerr: 50 */
/*global define, brackets, Mustache, localStorage */

define(function (require, exports, module) {
  "use strict";

  var  CommandManager  = brackets.getModule("command/CommandManager"),
       Menus           = brackets.getModule("command/Menus"),
       DocumentManager = brackets.getModule("document/DocumentManager"),
       Strings         = brackets.getModule("strings"),
       Dialogs         = brackets.getModule("widgets/Dialogs"),
       PrefsTemplate   = require("text!preferences.html");

  var preferenceKeyId = 'charlimit.preferences';

  var defaultPreferences = {
    charLimitCols: 80,
    charLimitColor: '#bbbbbb',
    charLimitEnabled: true
  };

  function getStorage() {
    var userData = localStorage.getItem(preferenceKeyId);
    return userData ? JSON.parse(userData) : $.extend({}, defaultPreferences);
  }

  function getPreference(name) {
    return getStorage()[name];
  }

  function saveStorage(storage) {
    localStorage.setItem(preferenceKeyId, JSON.stringify(storage));
  }

  function setPreference(name, value) {
    var storage = getStorage();
    if (typeof name == 'object') {
      for (var p in name) {
        if (name.hasOwnProperty(p)) {
          storage[p] = name[p];
        } else {
          storage[name] = value;
        }
      }
      saveStorage(storage);
    }
  }

  function charWidth() {
    var o = $('<div>a</div>')
      .css({'position': 'absolute',
            'float': 'left',
            'white-space': 'nowrap',
            'visibility': 'hidden'})
      .appendTo($('body'));
    var w = o.width();
    o.remove();
    return w;
  }

  function getGutterWidth() {
    var result = 15;
    var max = 0;
    $('.CodeMirror-gutters').each(function() {
      if ($(this).width() > max) {
        max = $(this).width();
      }
    });
    result += max;
    return result;
  }

  function drawCharLimit() {
    $('#charlimit').remove();
    if (getPreference('charLimitEnabled')) {
      var cols = getPreference('charLimitCols');
      cols--;
      var width = cols*charWidth() + getGutterWidth();
      var editorHolder = $('#editor-holder');
      editorHolder.append('<div id="charlimit" class="charlimit"></div>');
      var charlimit = $('#charlimit');
      charlimit.css('position', 'fixed');
      charlimit.css('top', '0');
      charlimit.css('height', '100%');
      charlimit.css('width', width + 'px');
      var color = getPreference('charLimitColor');
      charlimit.css('border-right', 'thin solid ' + color);
      charlimit.css('pointer-events', 'none');
    }
  }

  function showCharLimitPreferences() {
    var promise = Dialogs
      .showModalDialogUsingTemplate(Mustache.render(PrefsTemplate, Strings))
      .done(function (id) {
        if (id === Dialogs.DIALOG_BTN_OK) {
          setPreference({
            charLimitCols: colsInput.val(),
            charLimitColor: colorInput.val(),
            charLimitEnabled: enabledInput[0].checked
          });
          drawCharLimit();
        }
      });

    var dialog = $("#charlimit-settings");
    var colsInput = dialog.find('#charlimit-cols');
    var colorInput = dialog.find('#charlimit-color');
    var enabledInput = dialog.find('#charlimit-enabled');

    colsInput.val(getPreference('charLimitCols'));
    colorInput.val(getPreference('charLimitColor'));
    enabledInput[0].checked = !!getPreference('charLimitEnabled');

    return promise;
  }

  $(DocumentManager).on('currentDocumentChange', drawCharLimit);

  var CHARLIMIT_ID = "cezarywojcik.charlimitpref";
  CommandManager.register("CharLimit Preferences", CHARLIMIT_ID,
    showCharLimitPreferences);

  var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
  menu.addMenuDivider();
  menu.addMenuItem(CHARLIMIT_ID);
});
