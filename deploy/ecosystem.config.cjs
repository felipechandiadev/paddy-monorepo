/**
 * PM2 ecosystem: carga variables desde deploy/secrets/*.env (no versionados).
 * Sin dependencias extra: parser KEY=value mínimo (líneas vacías y # ignoradas).
 */
const fs = require('fs');
const path = require('path');

const deployDir = __dirname;
const repoRoot = path.join(deployDir, '..');

/**
 * @param {string} filePath
 * @returns {Record<string, string>}
 */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[deploy] Falta ${filePath}. Copia deploy/env/*.example a deploy/secrets/*.env y rellena.`,
    );
  }
  const text = fs.readFileSync(filePath, 'utf8');
  /** @type {Record<string, string>} */
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const secretsDir = path.join(deployDir, 'secrets');
const apiEnv = loadEnvFile(path.join(secretsDir, 'backend.env'));
const webEnv = loadEnvFile(path.join(secretsDir, 'frontend.env'));
const cargoEnv = loadEnvFile(path.join(secretsDir, 'cargo.env'));

module.exports = {
  apps: [
    {
      name: 'paddy-api',
      cwd: path.join(repoRoot, 'backend'),
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        ...apiEnv,
        NODE_ENV: apiEnv.NODE_ENV || 'production',
      },
    },
    {
      name: 'paddy-web',
      cwd: path.join(repoRoot, 'frontend'),
      script: path.join(repoRoot, 'frontend', 'node_modules', 'next', 'dist', 'bin', 'next'),
      args: `start -p ${webEnv.PORT || '3001'}`,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '1G',
      interpreter: 'node',
      env: {
        ...webEnv,
        NODE_ENV: webEnv.NODE_ENV || 'production',
        PORT: webEnv.PORT || '3001',
      },
    },
    {
      name: 'paddy-cargo',
      cwd: path.join(repoRoot, 'cargo'),
      script: path.join(repoRoot, 'cargo', 'node_modules', 'next', 'dist', 'bin', 'next'),
      args: `start -p ${cargoEnv.PORT || '3002'}`,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '1G',
      interpreter: 'node',
      env: {
        ...cargoEnv,
        NODE_ENV: cargoEnv.NODE_ENV || 'production',
        PORT: cargoEnv.PORT || '3002',
      },
    },
  ],
};
