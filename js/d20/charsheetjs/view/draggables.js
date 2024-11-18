/* eslint-disable no-unused-vars */
d20.makeMacrosSortable = () => {
  $('#macrobar_macros').sortable({
    helper: 'original',
    tolerance: 'pointer',
    placeholder: 'emptybox',
    axis: 'x',
    start() {
      $('#macrobar').addClass('sorting');
    },
    stop(e, ui) {
      if (ui && ui.item && ui.item.length && ui.item[0].tagName.toLowerCase() === 'button') {
        // Assume this is from a character sheet.
        const $curitem = $(ui.item[0]);
        let rollname;
        let charid = $curitem.attr('data-characterid');
        // IS REPEATING
        if (charid.includes('/')) {
          let repid;
          [charid, repid] = charid.split('/');
          rollname = `${charid}|@@${repid}`;
        } else {
          rollname = `${charid}|@@${encodeURIComponent(ui.item[0].name.substring(5, ui.item[0].name.length))}`;
        }
        $curitem.replaceWith(`<div class='macrobox' data-macroid='${rollname}'></div>`);
      }

      const order = [];
      let i = 0;
      $('#macrobar_macros .macrobox').each((index, el) => {
        order[i] = $(el).data('macroid');
        i += 1;
      });

      window.opener.postMessage({
        type: 'updateMacroBar',
        neworder: order.join(',')
      });

      $('#macrobar').removeClass('sorting');
    },
    sort(e, ui) {
      const itempos = ui.position.top;
      const item = ui.item[0];
      if (Math.abs(itempos) > 75) {
        item.style.opacity = 0.25;
        $(item).find('button').addClass('btn-danger');
      } else {
        item.style.opacity = 1.0;
        $(item).find('button').removeClass('btn-danger');
      }
    },
    distance: 15,
    scroll: false
  }).addTouch();
};

d20.makeRollButtonsDraggable = () => {
  $('.charactersheet button[type=roll]').draggable({
    revert: true,
    distance: 10,
    revertDuration: 0,
    helper: 'clone',
    appendTo: 'body',
    scroll: false,
    cancel: false,
    connectToSortable: '#macrobar_macros',
    start() {
      $('#macrobar').css('z-index', '999');
      // If this is a repeating section button, it gets special handling
      if ($(this).parents('.repcontainer').length > 0) {
        const groupName = $(this).closest('.repcontainer').attr('data-groupname');
        const rowId = $(this).closest('.repitem').attr('data-reprowid');
        let attrName = $(this).attr('name');
        attrName = encodeURIComponent(attrName.substring(5, attrName.length));
        $(this).attr('data-characterid', `${d20.characterId}/${groupName}_${rowId}_${attrName}`);
      } else {
        $(this).attr('data-characterid', d20.characterId);
      }
    },
    stop() {
      $('#macrobar').css('z-index', '-10');
      $('#macrobar').removeClass('sorting');
    }
  }).addTouch();
};

d20.updateMacroBar = (macroHtml) => {
  $('#macrobar_macros').html(macroHtml);
};

d20.makeRepeatingSectionsSortable = () => {
  $('form.sheetform').on('click', '.charsheet .repcontrol_edit', (e) => {
    const $this = $(e.currentTarget);
    const $container = $this.parents('.repcontrol').prev('.repcontainer');
    if ($container.hasClass('editmode')) {
      $container.removeClass('editmode');
      $this.text('Modify');
      $this.next('.repcontrol_add').show();
    } else {
      $container.addClass('editmode');
      $this.text('Done');
      $this.next('.repcontrol_add').hide();

      $container.sortable({
        axis: 'y',
        handle: '.repcontrol_move',
        items: '.repitem',
        update(ee, ui) {
          const newidorder = [];
          $container.find('.repitem').each((index, el) => {
            newidorder.push($(el).attr('data-reprowid'));
          });

          // Find the attribute that we're going to store this in.
          const storagekey = `_reporder_${$container.attr('data-groupname')}`;

          // Notify parent to update attributes.
          window.opener.postMessage({
            type: 'updateRepeatingSection',
            characterId: d20.characterId,
            storagekey,
            newidorder
          });
        }
      });
    }
  });
};

d20.compendiumDragOver = (left, top) => {
  if (!left || !top) {
    d20.deactivateDrop();
    return null;
  }

  const $over = $(document.elementFromPoint(left, top));
  const $element = ($over.hasClass('sheet-compendium-drop-target') || $over.hasClass('compendium-drop-target')) ? $over : $over.parents('.sheet-compendium-drop-target, .compendium-drop-target');
  if ($element.length > 0) {
    if (!$element.hasClass('dropping')) {
      d20.deactivateDrop();
      $element.addClass('dropping active-drop-target');
    }
  } else {
    d20.deactivateDrop();
  }
  return $element.length > 0 ? $element : null;
};

d20.deactivateDrop = () => {
  $('.charsheet .dropping.active-drop-target').removeClass('dropping active-drop-target');
};

d20.deactivateLoader = () => {
  const lottie = document.querySelector('lottie-player').getLottie();
  lottie.destroy();
  $('#character-view__loader').remove();
  $('#dialog-window.overflowHidden').removeClass('overflowHidden');
};

d20.closeIframe = () => {
  window.location.href = 'about:blank';
};

$(() => {
  d20.makeMacrosSortable();

  // window.opener.postMessage({
  //   type: 'loaded',
  //   characterId: d20.characterId
  // });
});
