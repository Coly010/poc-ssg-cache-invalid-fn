function bootstrap(pages, domEntryPointId, bootstrapPage) {
  // load ejs in browser
  const ejsScript = document.createElement('script');
  ejsScript.src = 'https://cdn.jsdelivr.net/npm/ejs@3.1.6/ejs.min.js';

  // start working on rendering
  const domEntryPointEl = document.getElementById(domEntryPointId);

  function patchAnchorTags() {
    const allAnchorTags = document.getElementsByTagName('a');
    if (allAnchorTags && allAnchorTags.length > 0) {
      for (const anchor of allAnchorTags) {
        const anchorHref = anchor.getAttribute('href');
        anchor.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();
          document.dispatchEvent(
            new CustomEvent('anchorClicked', { detail: anchorHref })
          );
        };
      }
    }
  }

  document.addEventListener('anchorClicked', (event) => {
    const pageToLoad = event.detail;
    const [ejsHtml, data] = pages[pageToLoad];
    // eslint-disable-next-line no-undef
    domEntryPointEl.innerHTML = ejs.render(ejsHtml, data);
    patchAnchorTags();
  });

  ejsScript.onload = (event) => {
    const [ejsHtml, data] = pages[bootstrapPage];

    // eslint-disable-next-line no-undef
    domEntryPointEl.innerHTML = ejs.render(ejsHtml, data);
    patchAnchorTags();
  };

  document.body.appendChild(ejsScript);
}

const pages = {};
for (const [name, [unrenderedHtml, stringifiedData]] of Object.entries(
  unmassagedPages
)) {
  pages[name] = [unrenderedHtml, JSON.parse(stringifiedData)];
}

bootstrap(pages, domEntryPointId, bootstrapPage);
