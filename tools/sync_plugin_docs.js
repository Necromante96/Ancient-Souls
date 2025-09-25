#!/usr/bin/env node
// sync_plugin_docs.js
// Uso: node sync_plugin_docs.js [pluginFile.js]
// Escaneia arquivos de plugin, extrai metadados e sincroniza a seção do plugin em js/plugins/README.md
// e mantém um chatlog por plugin em js/plugins/chatlogs/<PluginName>_chatlog.txt

const fs = require('fs');
const path = require('path');

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function extractHeaderMeta(content) {
  // Extrai metadados do cabeçalho do plugin (bloco /*: ... */)
  const meta = {};
  const headerMatch = content.match(/\/\*:[\s\S]*?\*\//);
  const header = headerMatch ? headerMatch[0] : '';
  const plugindescMatch = header.match(/@plugindesc\s+(.+)/);
  if (plugindescMatch) meta.plugindesc = plugindescMatch[1].trim();
  const authorMatch = header.match(/@author\s+(.+)/);
  if (authorMatch) meta.author = authorMatch[1].trim();
  // attempt to capture @param blocks and @default
  const params = [];
  const paramRegex = /@param\s+([^\s\r\n]+)/g;
  let pm;
  while ((pm = paramRegex.exec(header)) !== null) {
    const name = pm[1].trim();
    const defaultMatch = header.slice(pm.index, pm.index + 400).match(/@default\s+([^\r\n]+)/);
    const textMatch = header.slice(pm.index, pm.index + 400).match(/@text\s+([^\r\n]+)/);
    const descMatch = header.slice(pm.index, pm.index + 800).match(/@desc\s+([^\r\n]+)/);
    params.push({ name, text: textMatch ? textMatch[1].trim() : '', desc: descMatch ? descMatch[1].trim() : '', default: defaultMatch ? defaultMatch[1].trim() : '' });
  }
  meta.params = params;
  // tentativa de versão: buscar [vX.Y.Z] em @plugindesc
  if (meta.plugindesc) {
    const vmatch = meta.plugindesc.match(/\[v([0-9]+\.[0-9]+\.[0-9]+)\]/);
    if (vmatch) meta.version = vmatch[1];
  }
  // fallback: procurar no bloco @help por "Version X.Y.Z"
  const helpMatch = content.match(/@help([\s\S]*)\*\//);
  if (helpMatch) {
    const v2 = helpMatch[1].match(/Version\s+([0-9]+\.[0-9]+\.[0-9]+)/i);
    if (v2) meta.version = meta.version || v2[1];
    // take first lines of help as description
    const helpText = helpMatch[1].trim();
    const helpFirst = helpText.split(/\r?\n/).map(l => l.trim()).filter(Boolean).slice(0, 6).join(' ');
    meta.description = helpFirst;
  }
  // tenta encontrar a constante pluginName no código
  const pluginNameMatch = content.match(/const\s+pluginName\s*=\s*["']([^"']+)["']/);
  if (pluginNameMatch) meta.pluginName = pluginNameMatch[1];
  // fallback: usar nome baseado no arquivo
  return meta;
}

function generateReadmeSection(meta, relPath) {
  const name = meta.pluginName || path.basename(relPath, '.js');
  const version = meta.version || 'unspecified';
  const author = meta.author || 'unknown';
  const description = meta.plugindesc || meta.description || '';

  const paramLines = (meta.params && meta.params.length) ? meta.params.map(p => `- ${p.name} (padrão: ${p.default || '—'}) — ${p.desc || p.text || ''}`) : [];

  const section = [];
  section.push(`## ${name}`);
  section.push('');
  section.push('- Arquivo: `js/plugins/' + path.basename(relPath) + '`');
  section.push(`- Versão atual: ${version}`);
  section.push(`- Autor(es): ${author}`);
  section.push(`- Objetivo: ${description}`);
  section.push('');
  if (paramLines.length) {
    section.push('### Parâmetros principais');
    section.push('');
    section.push(...paramLines);
    section.push('');
  }
  section.push('### Como instalar / usar');
  section.push('');
  section.push('1. Coloque o plugin `'+path.basename(relPath)+'` em `js/plugins/`.');
  section.push('2. Ative o plugin no Gerenciador de Plugins do RPG Maker MZ.');
  section.push('3. Ajuste os parâmetros e teste em diferentes resoluções.');
  section.push('');
  section.push('### Histórico de versões');
  section.push('');
  section.push(`- v${version} — (sincronizado automaticamente)`);
  section.push('  - Autor: ' + author);
  section.push('  - Data: ' + new Date().toLocaleString());
  section.push('  - Alterações:');
  section.push('    - Sincronizado metadata a partir do cabeçalho do plugin.');
  section.push('');
  section.push('### Arquivos relacionados');
  section.push('');
  section.push('- Plugin: `js/plugins/' + path.basename(relPath) + '`');
  section.push('- Chatlog consolidado: `js/plugins/chatlogs/' + name + '_chatlog.txt`');
  section.push('- Backups: `js/plugins/backups/`');
  section.push('');
  section.push('### Próximos passos recomendados');
  section.push('');
  section.push('- Expor parâmetros no cabeçalho do plugin (caso falte).');
  section.push('- Implementar presets concretos e testar visualmente.');
  section.push('');
  return section.join('\n');
}

function syncPlugin(pluginPath, pluginsDir, readmePath, chatlogsDir) {
  const content = readFileSafe(pluginPath);
  if (!content) {
    console.warn('Cannot read', pluginPath);
    return null;
  }
  const meta = extractHeaderMeta(content);
  const relPath = path.relative(pluginsDir, pluginPath).replace(/\\\\/g, '/');
  const name = meta.pluginName || path.basename(pluginPath, '.js');
  const version = meta.version || 'unspecified';

  // Ensure chatlogs dir and backups dir
  ensureDir(chatlogsDir);
  const backupsDir = path.join(pluginsDir, 'backups');
  ensureDir(backupsDir);
  const chatlogFile = path.join(chatlogsDir, `${name}_chatlog.txt`);
  let chatlog = readFileSafe(chatlogFile) || '';

  // detect last logged version
  const lastVersionMatch = chatlog.match(/\[.*?\]\s*-\s*v([0-9]+\.[0-9]+\.[0-9]+)/g);
  const lastVersion = lastVersionMatch ? (lastVersionMatch.slice(-1)[0].match(/v([0-9]+\.[0-9]+\.[0-9]+)/)[1]) : null;

  if (lastVersion !== version) {
    const entry = [];
    entry.push(`[${name}] - v${version}`);
    entry.push(`Data: ${new Date().toLocaleString()}`);
    entry.push(`Autor: ${meta.author || 'unknown'}`);
    entry.push('Caminho do plugin: `js/plugins/' + path.basename(pluginPath) + '`');
    entry.push(`Descrição: ${meta.plugindesc || meta.description || ''}`);
    entry.push('Alterações:');
    entry.push('- Sincronização automática de metadata');
    entry.push('Observações:');
    entry.push('- Verifique visualmente após a atualização.');
    entry.push('');
    chatlog = (chatlog.trim() ? chatlog.trim() + '\n\n---\n\n' : '') + entry.join('\n');
    // Backup existing chatlog
    if (fs.existsSync(chatlogFile)) {
      const ts = new Date().toISOString().replace(/[.:]/g, '-');
      const backupChat = path.join(backupsDir, `${name}_chatlog_backup_${ts}.txt`);
      fs.copyFileSync(chatlogFile, backupChat);
      console.log('Backed up chatlog to', backupChat);
    }
    fs.writeFileSync(chatlogFile, chatlog, 'utf8');
    console.log('Updated chatlog:', chatlogFile);
  } else {
    console.log('No chatlog change for', name, '(version unchanged)');
  }

  // Update README
  let readme = readFileSafe(readmePath) || '';
  const section = generateReadmeSection(meta, relPath);
  const sectionRegex = new RegExp(`##\s+${name.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}[\\s\\S]*?(?=(\n##\s)|$)`, 'm');
  if (sectionRegex.test(readme)) {
    readme = readme.replace(sectionRegex, section + '\n');
    console.log('Replaced README section for', name);
  } else {
    // append at end
    readme = readme.trim() + '\n\n' + section + '\n';
    console.log('Appended README section for', name);
  }
  // Backup README before overwrite
  try {
    if (fs.existsSync(readmePath)) {
      const ts2 = new Date().toISOString().replace(/[.:]/g, '-');
      const backupReadme = path.join(backupsDir, `${name}_README_backup_${ts2}.md`);
      fs.copyFileSync(readmePath, backupReadme);
      console.log('Backed up README to', backupReadme);
    }
  } catch (e) {
    console.warn('Could not backup README:', e.message);
  }
  fs.writeFileSync(readmePath, readme, 'utf8');
  return { name, version };
}

function main() {
  const toolsDir = __dirname; // js/plugins/tools
  const pluginsDir = path.resolve(path.join(toolsDir, '..'));
  const readmePath = path.join(pluginsDir, 'README.md');
  const chatlogsDir = path.join(pluginsDir, 'chatlogs');

  const arg = process.argv[2];
  let pluginFiles = [];
  if (arg) {
    const p = path.isAbsolute(arg) ? arg : path.join(pluginsDir, arg);
    if (fs.existsSync(p)) pluginFiles.push(p);
    else console.error('Plugin file not found:', p);
  } else {
    const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile() && e.name.endsWith('.js')) {
        // ignore files in backups/chatlogs/tools folders (they are not in pluginsDir root)
        if (e.name.toLowerCase().endsWith('.js')) pluginFiles.push(path.join(pluginsDir, e.name));
      }
    }
  }

  if (!pluginFiles.length) {
    console.error('No plugin files found to sync. Provide a filename or place plugins in js/plugins/.');
    process.exit(1);
  }

  for (const pf of pluginFiles) {
    try {
      syncPlugin(pf, pluginsDir, readmePath, chatlogsDir);
    } catch (e) {
      console.error('Error syncing', pf, e);
    }
  }
}

if (require.main === module) main();
