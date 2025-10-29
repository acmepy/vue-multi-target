//https://github.com/febkosq8/local-save/
import { EventSourcePolyfill } from 'event-source-polyfill';
import bus from '@/utils/bus';
import { openDB } from 'idb';
import tablas from '@/db/tablas';

const server_url = import.meta.env.VITE_SERVER_URL;
const options = { headers: { 'ngrok-skip-browser-warning': 'true' }, heartbeatTimeout: 120000 };
const db_name = import.meta.env.VITE_DB_NAME;

let _db;
let _api;
let _events = new Map();
let _clientId;
//let _callbacks = new Map();

export async function open(api = `${server_url}/api`) {
  if (!_api) {
    _api = api;
  }
  if (!_clientId) {
    _clientId = generarUUID();
  }
  if (_events.size == 0) {
    for (const t of tablas) {
      const url = `${_api}/${t.name}/${_clientId}`;
      console.log('escuchando eventos de', t.name);
      const es = new EventSourcePolyfill(url, options);
      es.onmessage = (e) => {
        const tmp = JSON.parse(e.data);
        console.log('evento:', tmp);
        if (!!tmp.event) {
          const { event, tabla, data } = tmp;
          switch (event) {
            case 'create':
              add(tabla, data);
              break;
            case 'update':
              update(tabla, id, data);
              break;
            case 'remove':
              remove(tabla, id);
              break;
            default:
              console.log('evento no soportado', tmp);
          }
          bus.emit('change-' + tabla, { reload: true });
        }
      };
      if (!_events.get(t.name)) {
        _events.set(t.name, es);
      }
    }
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
  //return _db;
}
export async function download(tabla) {
  const tmp = await fetch(`${_api}/${tabla}`, { headers: { 'ngrok-skip-browser-warning': 'true' } }).then((r) => r.json());
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

export function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
