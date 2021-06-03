// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs/promises');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

interface Schema {
  appRoot: string;
}

interface CompilerConfig {
  pages: string;
  publicIndex: string;
  domEntryPointId: string;
  bootstrapPage: string;
}

export default async function (schema: Schema) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const compilerConfig: CompilerConfig = require(schema.appRoot + '/config.js');
  const pagesInFs: Record<string, [string, unknown]> = {};

  const pages = await fs.readdir(compilerConfig.pages);
  for (const page of pages) {
    const pageName = page.split('.').slice(0, -1).join('.');
    const unrenderedPage: () => [
      string,
      unknown
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    ] = require(`${compilerConfig.pages}/${page}`);
    pagesInFs[pageName] = unrenderedPage();
  }

  const incompleteBootstrapScript = fs.readFile(
    path.join(__dirname, '/lib/bootstrap.js')
  );
  const bootstrapScript = `
  <script>
    const bootstrapPage = '${compilerConfig.bootstrapPage}';
    const domEntryPointId = '${compilerConfig.domEntryPointId}';
    const unmassagedPages = ${listOutPages(pagesInFs)}

    ${incompleteBootstrapScript}

  </script>`;

  const indexFile = await fs.readFile(compilerConfig.publicIndex);
  const indexOfClosingBodyTag = indexFile.indexOf('</body>');
  const firstPartOfFile = indexFile.slice(0, indexOfClosingBodyTag - 1);
  const secondPartOfFile = indexFile.slice(indexOfClosingBodyTag);
  const newIndexFile = `${firstPartOfFile}${bootstrapScript}${secondPartOfFile}`;

  await fs.writeFile('/dist/apps/poc-example/index.html', newIndexFile);
}

function listOutPages(pages: Record<string, [string, unknown]>) {
  let pageStr = 'const pages = {';
  for (const [name, [unrenderedHtml, data]] of Object.entries(pages)) {
    pageStr += `${name}: [${unrenderedHtml}, ${JSON.stringify(data)}]`;
  }
  pageStr += '};';
  return pageStr;
}
