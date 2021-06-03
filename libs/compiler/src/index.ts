import { promises as fs } from 'fs';

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
  const compilerConfig: CompilerConfig = await import(schema.appRoot);
  const pagesInFs: Record<string, [string, object]> = {};

  const pages = await fs.readdir(compilerConfig.pages);
  for (const page of pages) {
    const pageName = page.split('.').slice(0, -1).join('.');
    const unrenderedPage: () => [string, object] = await import(
      `${compilerConfig.pages}/${page}`
    );
    pagesInFs[pageName] = unrenderedPage();
  }
}
