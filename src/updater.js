import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';
import { ROOT_DIR } from './utils/files.js';

const REPO_URL = 'https://github.com/autoresbot/resbot-ai.git';
const PROJECT_DIR = ROOT_DIR;
const TEMP_REPO_DIR = path.join(PROJECT_DIR, 'tmp-repo');

/** Membaca versi dari sebuah package.json. */
function readVersion(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')).version;
}

/** Meng-clone repo terbaru ke folder sementara. */
async function cloneRepoToTemp() {
  fs.mkdirSync(TEMP_REPO_DIR, { recursive: true });

  console.log('Check Update ...');
  await simpleGit(TEMP_REPO_DIR).clone(REPO_URL, '.');
}

/** Menyalin seluruh isi folder secara rekursif. */
function copyFiles(src, dest) {
  for (const file of fs.readdirSync(src)) {
    const srcFilePath = path.join(src, file);
    const destFilePath = path.join(dest, file);

    if (fs.statSync(srcFilePath).isDirectory()) {
      fs.mkdirSync(destFilePath, { recursive: true });
      copyFiles(srcFilePath, destFilePath);
    } else {
      fs.copyFileSync(srcFilePath, destFilePath);
    }
  }
}

function cleanUpTempRepo() {
  fs.rmSync(TEMP_REPO_DIR, { recursive: true, force: true });
}

/**
 * Membandingkan versi lokal dengan versi di repo, lalu menyalin file terbaru
 * bila versinya berbeda. Dijalankan saat `config.AutoUpdate` bernilai `'on'`.
 */
async function cloneOrUpdateRepo() {
  try {
    await cloneRepoToTemp();

    const localVersion = readVersion(path.join(PROJECT_DIR, 'package.json'));
    const remoteVersion = readVersion(path.join(TEMP_REPO_DIR, 'package.json'));

    if (localVersion !== remoteVersion) {
      console.log('Update available! Starting the update process...');
      copyFiles(TEMP_REPO_DIR, PROJECT_DIR);
      console.log('Files updated successfully! Script is now up-to-date.');
    } else {
      console.log('Script is already up-to-date.');
    }

    cleanUpTempRepo();
  } catch (err) {
    console.error('Error during git operation:', err.message);
  }
}

export { cloneOrUpdateRepo };
