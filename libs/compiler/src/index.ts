import * as prompts from 'prompts';
import * as fs from 'fs';

import { csrCompiler as compiler } from './compiler';

async function startUpCSRCompiler() {
  const { appRoot } = await prompts({
    name: 'appRoot',
    type: 'text',
    message: `What is the path to the directory containing your app's config.js? (relative to where you've executed this command)`,
  });

  if (!fs.existsSync(appRoot)) {
    console.error(
      `Path provided (${appRoot}) does not exist! Please check the path and try again.`
    );
    return;
  }

  await compiler(appRoot);
}

startUpCSRCompiler();
