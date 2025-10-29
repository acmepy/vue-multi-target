import * as yup from 'yup';
import { loading } from '../js/dialog.js';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default class BaseService {
  constructor({ resource, baseUrl = `${SERVER_URL}/api`, schema = false }) {
    this.resource = resource;
    this.baseUrl = baseUrl;
    this.schema = schema;
  }

  async request({ method, id = '', data = null, params = {}, resource = this.resource }) {
    loading();

    const url = new URL(`${this.baseUrl}/${resource}/${id}`.replace(/\/+$/, ''));

    // Agregar query params si existen
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url.toString(), options);
      const contentType = response.headers.get('Content-Type');
      const isJson = contentType && contentType.includes('application/json');
      const result = isJson ? await response.json() : await response.text();

      loading(false);

      return result;
    } catch (err) {
      loading(false);
      console.error(`[${method}] Error en ${url}:`, err);
      throw err;
    }
  }

  toYup(json) {
    const shape = {};

    for (const campo in json) {
      const reglas = json[campo];
      let val;

      switch (reglas.type) {
        case 'string':
          val = yup.string();
          break;
        case 'email':
          val = yup.string().email(reglas.email?.message);
          break;
        case 'number':
          val = yup.number();
          break;
        default:
          val = yup.mixed();
      }

      if (reglas.default !== undefined) val = val.default(reglas.default);

      if (reglas.required) val = val.required(reglas.required.message);
      if (reglas.min) val = val.min(reglas.min.value, reglas.min.message);
      if (reglas.max) val = val.max(reglas.max.value, reglas.max.message);
      if (reglas.matches) {
        const regex = new RegExp(reglas.matches.pattern.slice(1, -1)); // sin los /
        val = val.matches(regex, reglas.matches.message || 'Formato inválido');
      }
      shape[campo] = val;
    }

    return yup.object().shape(shape);
  }

  getAll(params = {}) {
    return this.request({ method: 'GET', params });
  }

  get(id, params = {}) {
    return this.request({ method: 'GET', id, params });
  }

  create(data) {
    return this.request({ method: 'POST', data });
  }

  update(id, data) {
    return this.request({ method: 'PUT', id, data });
  }

  delete(id) {
    return this.request({ method: 'DELETE', id });
  }

  save(data) {
    if (data.id) {
      const id = data.id;
      delete data.id;
      return this.update(id, data);
    } else {
      return this.create(data);
    }
  }

  async loadSchema() {
    if (!this.schema) this.schema = this.toYup(await this.request('GET', 'schema'));
  }

  async defaultValues() {
    await this.loadSchema();
    return this.schema.describe().default;
  }

  async validateField(field, value, errors) {
    this.loadSchema();
    try {
      const schema = this.schema;
      const valor = { [field]: value };
      const campoSchema = schema.pick([field]);
      await campoSchema.validate(valor);
      errors[field] = '';
    } catch (e) {
      errors[field] = e.message;
      if (!['ValidationError'].includes(e.name)) console.error(e);
    }
  }
}
