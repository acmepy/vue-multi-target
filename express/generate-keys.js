import fs from 'fs'
import path from 'path'
import webpush from 'web-push'

const keys = webpush.generateVAPIDKeys()
//console.log("Public Key:", keys.publicKey);
//console.log("Private Key:", keys.privateKey);

const envPath = path.resolve(process.cwd(), '.env')

let envContent = ''
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8')
}

function upsertEnvVar(content, key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'm')
  if (regex.test(content)) {
    return content.replace(regex, `${key}=${value}`)
  }
  return content + `\n${key}=${value}`
}

envContent = upsertEnvVar(envContent, 'VAPID_PUBLIC_KEY', keys.publicKey)
envContent = upsertEnvVar(envContent, 'VAPID_PRIVATE_KEY', keys.privateKey)

fs.writeFileSync(envPath, envContent)

console.log('✅ Llaves VAPID generadas y guardadas en .env')
