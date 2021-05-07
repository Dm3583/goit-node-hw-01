const fs = require('fs').promises;
const path = require('path');
require('colors');
const shortid = require('shortid');

const contactsPath = path.join(__dirname, './db/contacts.json');

function chosenContact(contacts,contactId){
  const contact = contacts.find(contact=>contact.id.toString()===contactId);
  return contact;
};

function listContacts() {
    return fs.readFile(contactsPath, 'utf8', (error, data)=>{
      if(error) throw error;
      return data;
    })
    .then(JSON.parse)
    .catch(error=>console.error(error.message));;
  }
  
function getContactById(contactId) {
    return listContacts()
    .then(contacts=>{
      const contactById = chosenContact(contacts,contactId)
      return contactById?
                contactById:
              `There is no contact with id ${contactId}`.red})
    .catch(error=>console.error(error.message));
  }
  
function removeContact(contactId) {
    return listContacts()
    .then(contacts=>{
      const contactToRemove = chosenContact(contacts, contactId);
      console.log(contactToRemove);
      if(!contactToRemove){
        console.log(`There is no contact with id ${contactId}`.red);
        return;
      }
      const filteredContacts = contacts.filter(contact=>contact.id.toString()!==contactId);
      console.log('You just removed:'.yellow);
      console.table(contactToRemove);
      return filteredContacts;
      })
      .then(contacts=>{
        if(!contacts){
          return;
        }
        return fs.writeFile(contactsPath, JSON.stringify(contacts))})
      .then(listContacts)
    .catch(error=>console.error("Error message: ",error.message));
  }
  
function addContact(name, email, phone) {
    return listContacts()
      .then(contacts=>{
        const contact = {
          id: shortid.generate(),
          name,
          email,
          phone
        }
        console.log('You add contact:'.green);
        console.table(contact);
        return [...contacts, contact];
      })
      .then(contacts=>fs.writeFile(contactsPath, JSON.stringify(contacts)))
      .then(listContacts)
    .catch(error=>console.error(error.message));
  }

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
};