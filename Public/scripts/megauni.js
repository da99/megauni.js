"use strict";
/* jshint undef: true, unused: true */
/* global Applet  */

var MegaUni;

$(function () { // === START SCOPE ======

  function mu_ui_ajax(o) {

    // === Clear errors:
    if (o.name === 'dom') {
      $('input[type="text"], textarea').on('keypress', function (e) {
        $(e.target).closest('div.field').removeClass('field_invalid');
        $(e.target).closest('div.form').find('div.error_msg').remove();
      });

      $('form button.submit').on('click', function (e) {
        var form = $(this).closest('form');
        form.find('div.field_invalid').removeClass('field_invalid');
        form.find('div.error_msg').remove();
      });
    }

    // === Show loading message: Processing...
    if (o.name === 'ajax' && o.form_id) {
      $('#' + o.form_id).closest('div.form').addClass('loading');
      $('#' + o.form_id + ' div.buttons').after('<div class="loading_msg">Processing...</div>');
    }

    // === Display errors:
    if (o.name === 'ajax response' && o.request.form_id) {
      var div_form = $('#' + o.request.form_id).closest('div.form');
      div_form.removeClass('loading');
      $('#' + o.request.form_id + ' div.loading_msg').remove();

      if (o.response.error && o.response.error.fields) {
        _.each(o.response.error.fields, function (msg, key) {
          var field = div_form.find('div.field.' + key + ':first');
          field.addClass('field_invalid');
          var err = $('<div class="error_msg error_' + key + '"></div>');
          err.text(msg);
          field.after(err);
        });
      } // === if error fields
    }

  } // === func ajax

  // === CONSTRUCTOR ====
  MegaUni = function () {
    this.applet = new Applet(
      _.values(Applet.funcs),
      mu_ui_ajax
    ); // === new Applet
  };

}); // === END SCOPE ====================



