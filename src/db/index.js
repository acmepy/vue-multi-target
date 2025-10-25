import { openDB } from 'idb';
import tablas from '@/db/tablas';

const server_url = import.meta.env.VITE_SERVER_URL;
const db_name = import.meta.env.VITE_DB_NAME;

let _db;
let _api;

export async function open(api = `https://${server_url}/api/`) {
  if (!_api) {
    _api = api;
  }
  if (!_db) {
    _db = await openDB(db_name, 1, {
      upgrade(db) {
        for (const t of tablas) {
          if (!db.objectStoreNames.contains(t.name)) {
            db.createObjectStore(t.name, t.key);
          }
        }
      },
    });
    console.log('open', 'db inicializada');
  }
  return _db;
}
export async function download(tabla) {
  const tmp = await fetch(_api + tabla, { headers: { 'ngrok-skip-browser-warning': 'true' } }).then((r) => r.json());
  add(tabla, tmp);
  return tmp;
}

export async function getAll(tabla) {
  let tmp = await _db.getAll(tabla);
  if (tmp.length == 0) {
    tmp = download(tabla);
  }
  return tmp;
}

export async function get(tabla, id) {
  return _db.get(tabla, id);
}

export async function add(tabla, data) {
  if (!Array.isArray(data)) {
    data = [data];
  }
  for (const d of data) {
    await _db.put(tabla, { ...d });
  }
}

export async function update(tabla, id, updates) {
  const existing = await get(tabla, id);
  if (!existing) return;
  const updated = { ...existing, ...updates };
  await _db.put(tabla, updated);
  return updated;
}

export async function remove(tabla, id) {
  await _db.delete(tabla, id);
}

export async function clear(tabla) {
  await _db.clear(tabla);
}

/*
//
//https://github.com/febkosq8/local-save/
//
import LocalSave from '@febkosq8/local-save'
export function open() {
  if (!localSave) {
    localSave = new LocalSave({
      dbName: 'vue',
      //encryptionKey: "MyRandEncryptKeyThatIs32CharLong", // Encryption key for data
      categories: ['aboutData', 'welcomeData'], // Define categories for data storage
      //expiryThreshold: 14, // Clear data older than 14 days
    })
  }
  return localSave
}
export let localSave = false
*/
