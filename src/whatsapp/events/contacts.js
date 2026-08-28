import { store, eventBus } from '../store.js';

/** Menyimpan pembaruan kontak ke store lalu memberitahu pendengar lain. */
function handleContactsUpdate(contacts) {
  for (const contact of contacts) {
    store.contacts[contact.id] = contact;
  }

  eventBus.emit('contactsUpdated', store.contacts);
}

export { handleContactsUpdate };
