import fs from 'fs';
import ngrok from 'ngrok';

(async () => {
  const url = await ngrok.connect({ addr: 3000, proto: 'http' });
  console.log('ngrok url:', url);

  // si ya tenías un túnel corriendo y quieres "listarlos", la librería también tiene utilidades
  // (ver docs de la versión que uses)

  upsertEnvVar('./.env', 'VITE_SERVER_URL', url);
  upsertEnvVar('./electron/.env', 'SERVER_URL', url);
  upsertEnvVar('./cordova/www/js/env.js', '  SERVER_URL', `'${url}',`, ':');
})();

function upsertEnvVar(file, key, value, delimitador = '=') {
  let content = fs.readFileSync(file, 'utf-8');
  const regex = new RegExp(`^${key}${delimitador}.*$`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `${key}${delimitador}${value}`);
  } else {
    content = content + `\n${key}=${value}`;
  }
  fs.writeFileSync(file, content);
}
