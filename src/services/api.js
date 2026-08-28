import ApiAutoresbot from 'api-autoresbot';
import config from '../../config.js';

/** Satu instance API Autoresbot yang dipakai bersama oleh seluruh service. */
const api = new ApiAutoresbot(config.API_KEY);

export default api;
