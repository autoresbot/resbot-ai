import EventEmitter from 'events';

/** Bus event internal bot (mis. `contactsUpdated`). */
const eventBus = new EventEmitter();

/** Cache sederhana di memori untuk data yang dikirim WhatsApp. */
const store = {
  contacts: {},
};

export { eventBus, store };
