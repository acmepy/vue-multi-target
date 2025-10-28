import fs from 'fs';
import path from 'path';
import webpush from 'web-push';

const keys = webpush.generateVAPIDKeys();

upsertEnvVar('./server/.env', 'VAPID_PUBLIC_KEY', keys.publicKey);
upsertEnvVar('./server/.env', 'VAPID_PRIVATE_KEY', keys.privateKey);
upsertEnvVar('./.env', 'VITE_VAPID_PUBLIC_KEY', keys.publicKey);

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
