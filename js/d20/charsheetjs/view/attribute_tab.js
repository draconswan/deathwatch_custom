/* eslint-disable no-unused-vars */
d20.makeAttributesSortable = () => {
  const $attrtable = $('.attributes .body');

  $attrtable.sortable({
    items: '.attrib',
    handle: '.handle',
    distance: 5,
    update() {
      const order = [];
      $attrtable.find('.attrib').each((index, el) => {
        const id = $(el).attr('data-attrid');
        order.push(id);
      });

      window.opener.postMessage({
        type: 'updateCharacter',
        characterId: d20.characterId,
        update: {
          attrorder: order.join(','),
        },
      });
    },
    axis: 'y',
  }).addTouch();
};

d20.makeAbilitiesSortable = () => {
  const $abiltable = $('.abilities .body');

  $abiltable.sortable({
    items: '.abil',
    handle: '.handle',
    distance: 5,
    update() {
      const order = [];
      $abiltable.find('.abil').each((index, el) => {
        const id = $(el).attr('data-abilid');
        order.push(id);
      });

      window.opener.postMessage({
        type: 'updateCharacter',
        characterId: d20.characterId,
        update: {
          abilorder: order.join(','),
        },
      });
    },
    axis: 'y',
  }).addTouch();
};
