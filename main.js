/*jslint indent: 2,maxerr: 50 */
/*global define, brackets */

define(function (require, exports, module) {
  "use strict";

  var DocumentManager = brackets.getModule("document/DocumentManager");

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
    var cols = 80;
    cols--;
    var width = cols*charWidth() + getGutterWidth();
    var editorHolder = $('#editor-holder');
    editorHolder.append('<div id="charlimit" class="charlimit"></div>');
    var charlimit = $('#charlimit');
    charlimit.css('position', 'fixed');
    charlimit.css('top', '0');
    charlimit.css('height', '100%');
    charlimit.css('width', width + 'px');
    charlimit.css('border-right', 'thin solid #bbb');
    charlimit.css('pointer-events', 'none');
  }

  $(DocumentManager).on('currentDocumentChange', drawCharLimit);
});
