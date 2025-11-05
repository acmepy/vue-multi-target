//https://github.com/febkosq8/local-save/
import { EventSourcePolyfill } from 'event-source-polyfill';
import bus from '@/utils/bus';
import { openDB } from 'idb';
import tables from '@/db/tables';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const options = { headers: { 'ngrok-skip-browser-warning': 'true' }, heartbeatTimeout: 120000 };
const db_name = import.meta.env.VITE_DB_NAME;

let _db;
let _api;
let _events = new Map();
let _clientId;
//let _callbacks = new Map();

export async function open(api = `${SERVER_URL}/api`) {
  if (!_api) {
    _api = api;
  }
  if (!_clientId) {
    _clientId = generarUUID();
  }
  if (_events.size == 0) {
    for (const t of tables) {
      const url = `${_api}/${t.name}/${_clientId}`;
      console.log('escuchando eventos de', t.name);
      const es = new EventSourcePolyfill(url, options);
      es.onmessage = (e) => {
        const tmp = JSON.parse(e.data);
        console.log('evento:', tmp);
        if (!!tmp.event) {
          const { event, table, data } = tmp;
          switch (event) {
            case 'create':
              add(table, data);
              break;
            case 'update':
              update(table, id, data);
              break;
            case 'remove':
              remove(table, id);
              break;
            default:
              console.log('evento no soportado', tmp);
          }
          bus.emit('change-' + table, { reload: true });
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
        for (const t of tables) {
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
export async function download(table) {
  const tmp = await fetch(`${_api}/${table}`, options).then((r) => r.json());
  if (tmp.length > 0) add(table, tmp);
  return tmp;
}

export async function getAll(table) {
  let tmp = await _db.getAll(table);
  if (tmp.length == 0) {
    tmp = download(table);
  }
  return tmp;
}

export async function get(table, id) {
  return _db.get(table, id);
}

export async function add(table, data) {
  if (!Array.isArray(data)) {
    data = [data];
  }
  for (const d of data) {
    await _db.put(table, { ...d });
  }
}

export async function update(table, id, updates) {
  const existing = await get(table, id);
  if (!existing) return;
  const updated = { ...existing, ...updates };
  await _db.put(table, updated);
  return updated;
}

export async function remove(table, id) {
  await _db.delete(table, id);
}

export async function clear(table) {
  await _db.clear(table);
}

export function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
