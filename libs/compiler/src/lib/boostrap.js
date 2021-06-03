(function (pages, domEntryPointId) {
  // load ejs in browser
  const ejsScript = document.createElement('script');
  ejsScript.src = 'https://cdn.jsdelivr.net/npm/ejs@3.1.6/ejs.min.js';
  document.appendChild(ejsScript);

  // start working on rendering
  const domEntryPointEl = document.getElementById(domEntryPointId);

  const allAnchorTags = document.getElementsByTagName('a');
  for (const anchor of allAnchorTags) {
    anchor.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      document.dispatchEvent(
        new CustomEvent('anchorClicked', { page: anchor.href })
      );
    };
  }

  document.on('anchorClicked', (event) => {
    const pageToLoad = event.page;
    const [ejsHtml, data] = pages[pageToLoad];
    // eslint-disable-next-line no-undef
    domEntryPointEl.innerHTML = ejs.render(ejsHtml, data);
  });
})();
