var dbName = 'Trans';
var version = '1.0';
var displayName = 'Trans';
var estimatedSize = 65536;
function openDB(){ 
    return openDatabase( 
        dbName, 
        version, 
        displayName, 
        estimatedSize
    ); 
}
function getData(t){ 
    var db = openDB();
    db.transaction( 
        function(trans){
            trans.executeSql(
                'select t.date as date, t.name as name, t.memo as memo, t.amount as amount, a.name as account_name'
                + ' from trans as t,accounts as a where t.account_id == a.account_id;',
                [],
                function(trans, r){
                    for(var i=0; i<r.rows.length; i++){
                        var tmp = r.rows.item(i);
                        t.row.add( [
                            r.rows.item(i).date,
                            r.rows.item(i).name,
                            r.rows.item(i).memo,
                            r.rows.item(i).amount,
                            r.rows.item(i).account_name
                        ] ).draw();
                    }
                } 
            );
        }
    );
}
jQuery(function ($) {
    // Setup - add a text input to each footer cell
    $('#example tfoot th').each( function () {
        var title = $('#example thead th').eq( $(this).index() ).text();
        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
    } );
    var t = $('#example').DataTable();
    // Apply the search
    t.columns().every( function () {
        var that = this;
 
        $( 'input', this.footer() ).on( 'keyup change', function () {
            that
                .search( this.value )
                .draw();
        } );
    } );
  dataSet = getData(t);

  var $focusedInput,
      options = getOptions();


  // Initially load previous options
  if (options) {
    init(options);
  }


  // Fake input focusing
  $(document).on('click', function () {
    $focusedInput = null;
    $('.input').removeClass('focus');
  });

  $('.input').on('click', function (e) {
    $focusedInput = $(this);

    $('.input').removeClass('focus');
    $focusedInput.addClass('focus');

    e.stopPropagation();
  });


  // Hotkey -> focusedInput handling
  $(document).on('keyup', null, '', function (e) {
    
  });


  $(document).on('keydown', null, '', function (e) {
    var possible = hotkeysHandler(e),
        hotkey;

    if (!$focusedInput) {
      return;
    }

    for (hotkey in possible) {
      if (possible.hasOwnProperty(hotkey) && possible[hotkey]) {
        saveOption($focusedInput.attr('id'), hotkey);
        $focusedInput.html(valueToKeyboardKeys(hotkey));
        break;
      }
    };
  });


  $('input[name="hyperlinkMode"]').click(function () {
    $('input[name="hyperlinkMode"]').not(this).removeAttr('checked');
    saveOption('hyperlinkMode', $(this).val());
  });


  $('#resetDefault').click(function (e) {
    if (confirm('Are you sure you want to reset to defaults?')) {
      var defaultOptions = getDefaultOptions(), i;

      for (i in defaultOptions) {
        if (defaultOptions.hasOwnProperty(i)) {
          saveOption(i, defaultOptions[i]);
        }
      }

      init(defaultOptions);

      $('body').trigger('click'); // Unfocus all inputs
    }

    return false;
  });


  /**
   * Initialization
   */
  function init(defaults) {
    var key;

    for (key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        $('#' + key).html(valueToKeyboardKeys(defaults[key]));
      }
    }

    $('input[name="hyperlinkMode"]').removeAttr('checked');
    $('#hyperlinkMode-' + defaults.hyperlinkMode).attr('checked', 'checked');
  }

  /**
   * Creates keyboard keys markup for a hotkey value.
   */
  function valueToKeyboardKeys(value) {
    var parts = value.split('+'),
        i;

    for (i = parts.length - 1; i >= 0; i--) {
      parts[i] = '<span class="key">' + toTitleCase(parts[i]) + '</span>';
    }

    return parts.join('<span class="sep">+</span>');
  }

  /**
   * Saves a hotkey to localStorage.
   */
  function saveOption(key, value) {
    options[key] = value;
    localStorage.options = JSON.stringify(options);
  }

  /**
   * Modified version of handleObj.handler from jquery.hotkeys.js.
   *
   * This version captures all keypresses and returns the combos.
   */
  function hotkeysHandler(event) {
    var textAcceptingInputTypes = ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color"];

    // Don't fire in text-accepting inputs that we didn't directly bind to
    if (this !== event.target && (/textarea|select/i.test(event.target.nodeName) ||
      jQuery.inArray(event.target.type, textAcceptingInputTypes) > -1)) {
      return;
    }

    // Keypress represents characters, not special keys
    var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
      character = String.fromCharCode(event.which).toLowerCase(),
      key, modif = "", possible = {};

    // check combinations (alt|ctrl|shift+anything)
    if (event.altKey && special !== "alt") {
      modif += "alt+";
    }

    if (event.ctrlKey && special !== "ctrl") {
      modif += "ctrl+";
    }

    // TODO: Need to make sure this works consistently across platforms
    if (event.metaKey && !event.ctrlKey && special !== "meta") {
      modif += "meta+";
    }

    if (event.shiftKey && special !== "shift") {
      modif += "shift+";
    }

    if (special) {
      possible[modif + special] = true;

    } else {
      possible[modif + character] = true;
      possible[modif + jQuery.hotkeys.shiftNums[character]] = true;

      // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
      if (modif === "shift+") {
        possible[jQuery.hotkeys.shiftNums[character]] = true;
      }
    }

    return possible;
  };

  /**
   * See: http://stackoverflow.com/a/196991/806988
   */
   function toTitleCase(str) {
     return str.replace(/\w\S*/g, function(txt) {
       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
     });
   }
});
