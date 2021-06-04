import { promises as fs } from 'fs';
import * as path from 'path';

interface CompilerConfig {
  pages: string;
  publicIndex: string;
  domEntryPointId: string;
  bootstrapPage: string;
}

export default async function (appRoot: string) {
  const compilerConfig: CompilerConfig = await import(
    '../../../' + appRoot + '/config.js'
  );
  const pagesInFs: Record<string, [string, unknown]> = {};

  const pages = await fs.readdir(compilerConfig.pages);
  for (const page of pages) {
    const pageName = page.split('.').slice(0, -1).join('.');
    const unrenderedPage: () => [string, unknown] = await import(
      `${compilerConfig.pages}/${page}`
    );
    pagesInFs[pageName] = unrenderedPage();
  }

  const incompleteBootstrapScript = await fs.readFile(
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

  const indexFileName = compilerConfig.publicIndex.split('/').slice(-1)[0];
  await fs.mkdir(`dist/${appRoot}`, { recursive: true });
  await fs.writeFile(`dist/${appRoot}/${indexFileName}`, newIndexFile);
}

function listOutPages(pages: Record<string, [string, unknown]>) {
  let pageStr = '{';
  for (const [name, [unrenderedHtml, data]] of Object.entries(pages)) {
    pageStr += `${name}: [\`${unrenderedHtml}\`, \`${JSON.stringify(data)}\`],`;
  }
  pageStr += '};';
  return pageStr;
}
