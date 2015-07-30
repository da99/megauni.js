"use strict";
/* jshint undef: true, unused: true */
/* global MegaUni, describe, it, expect, beforeEach */

// function tag_names(dom) {
  // return _.map($(dom), function (node) {
    // return node.tagName;
  // });
// }

var m;

describe('megauni.js:', function () {

  beforeEach(function () {
    $('#THE_STAGE').empty();
  });

  describe('run:', function () {

    it('inserts contents before SCRIPT tag', function () {
      $('#THE_STAGE')
      .html('<script type="text/applet"><div id="target" show_if="logged_in?">logged</div></script>');
      m = new MegaUni();
      expect(
        $($('#THE_STAGE').children().first()).attr('id')
      ).toEqual('target');
    }); // === it inserts contents before SCRIPT tag

  }); // === describe run =================

  describe('show_if:', function () {

    it('sets node to display=none by default', function () {
      $('#THE_STAGE')
      .html('<script type="text/applet"><div id="target" show_if="logged_in?">logged</div></script>');
      m = new MegaUni();
      expect(
        $('#target').css('display')
      ).toEqual('none');
    }); // === it sets node to display=none by default

    it('makes node visible if data has a truthy kv', function () {
      $('#THE_STAGE')
      .html('<script type="text/applet"><div id="target" show_if="logged_in?">logged</div></script>');

      m = new MegaUni();
      m.run('data', {'logged_in?': true});

      expect(
        $('#target').css('display')
      ).toEqual('block');
    }); // === it makes node visible if data has a truthy kv

  }); // === describe show_if =================

  describe('template:', function () {

    it('does not render by default', function () {
      $('#THE_STAGE').html(
        '<script type="text/applet"><div template="num">{{num.word}} {{num.num}}</div></script>'
      );

      m = new MegaUni();

      expect(
        _.map($('#THE_STAGE').children(), function (n) {
          return $(n).attr('type');
        })
      ).toEqual(['text/applet_placeholder', 'text/applet']);
    }); // === it does not render by default

    it('renders elements on top of where it is found', function () {
      $('#THE_STAGE').html(
        '<script type="text/applet"><div template="num">{{num.word}} {{num.num}}</div></script>'
      );

      m = new MegaUni();
      m
      .run('compile scripts')
      .run('data', {num: {word: 'one', num: 1}})
      ;

      expect(
        $('#THE_STAGE').children().first().prop('outerHTML')
      ).toEqual('<div>one 1</div>');
    }); // === it renders elements on top of where it is found

    it('replaces elements, including text nodes', function () {
      $('#THE_STAGE').html(
        '<script type="text/applet"><div template="num">{{num.word}} {{num.num}}</div></script>'
      );

      m = new MegaUni();
      m
      .run('compile scripts')
      .run('data', {num: {word: 'one', num: Date.now().toString()}})
      .run('data', {num: {word: 'two', num: 2}})
      ;


      expect(
        $('#THE_STAGE').text()
      ).toEqual('two 2');
    }); // === it replaces elements, including text nodes

    it('appends rendered template above w/ option: top', function () {
      $('#THE_STAGE').html(
        '<script type="text/applet"><div template="num top">{{num.word}} {{num.num}}</div></script>'
      );

      m = new MegaUni();
      m
      .run('compile scripts')
      .run('data', {num: {word: 'one', num: 1}})
      .run('data', {num: {word: 'two', num: 2}})
      ;

      expect(
        $('#THE_STAGE').text()
      ).toEqual('two 2one 1');
    }); // === it appends rendered template above w/ option: top

    it('appends rendered template below w/ option: bottom', function () {
      $('#THE_STAGE').html(
        '<script type="text/applet"><div template="num bottom">{{num.word}} {{num.num}}</div></script>'
      );

      m = new MegaUni();

      m
      .run('compile scripts')
      .run('data', {num: {word: 'one', num: 1}})
      .run('data', {num: {word: 'two', num: 2}})
      .run('data', {num: {word: 'three', num: 3}})
      ;

      expect(
        $('#THE_STAGE').text()
      ).toEqual('one 1two 2three 3');
    }); // === it appends rendered template above w/ option: bottom

    it('renders template w/ attr functionality', function () {
      $('#THE_STAGE').html(
        '<script type="text/applet"><div template="num" id="target"><span show_if="show_num?">{{num.word}}</span></div></script>'
      );

      m = new MegaUni();
      m
      .run('compile scripts')
      .run('data', {'show_num?': true, num: {word: 'number'}})
      ;

      expect(
        $('#target span').css('display')
      ).toEqual('inline');

      m.run('data', {'show_num?' : false});

      expect(
        $('#target span').css('display')
      ).toEqual('none');

    }); // === it renders template w/ attr functionality

  }); // === describe template =================

  describe('forms:', function () {

    it('adds handlers to buttons', function () {
      $('#THE_STAGE').html(
        '<form id="target"><input type="hidden" name="hello" value="goodbye" /><button class="submit">SUBMIT</button></form>'
      );
      m = new MegaUni();

      var result = null;
      m.push(function (o) {
        if (o.name !== 'form submit')
          return;
        result = o.data.hello;
        o['submit?'] = false;
      });

      $('#THE_STAGE button.submit').click();
      expect(result).toEqual('goodbye');
    }); // === it adds handlers to buttons
  }); // === describe forms =================

}); // === describe megauni.js =================
