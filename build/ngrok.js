import ngrok from 'ngrok';

(async () => {
  // abrir un túnel (o conectar a uno existente)
  const url = await ngrok.connect({ addr: 3000, proto: 'http' });
  console.log('ngrok url:', url);

  // si ya tenías un túnel corriendo y quieres "listarlos", la librería también tiene utilidades
  // (ver docs de la versión que uses)

  upsertEnvVar('../env', 'VITE_SERVER_URL', url.replace('https://', ''));
  upsertEnvVar('../electron/env', 'SERVER_URL', url.replace('https://', ''));
  upsertEnvVar('../cordova/www/env.js', 'SERVER_URL', url.replace('https://', ''));
})();

function upsertEnvVar(file, key, value, delimitador = '=') {
  const content = fs.readFileSync(file, 'utf-8');
  const regex = new RegExp(`^${key}${delimitador}.*$`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `${key}${delimitador}${value}`);
  }
  content = content + `\n${key}=${value}`;
  fs.writeFileSync(file, content);
}
