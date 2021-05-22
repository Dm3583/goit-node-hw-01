const fs = require('fs').promises;
const path = require('path');
require('colors');
const shortid = require('shortid');

const contactsPath = path.join(__dirname, './db/contacts.json');

function findContactById(contacts, contactId) {
    const contact = contacts.find(contact => contact.id.toString() === contactId);
    return contact;
};

function getData(){
  return fs.readFile(contactsPath, 'utf8', (error, data)=>{
    if(error) throw error;
    return data;
  })
  .then(JSON.parse)
  .catch(error=>console.error(error.message));
};

function listContacts() {
    return getData().
      then(console.table);
  }
  
function getContactById(contactId) {
    return getData()
    .then(contacts=>{
      const contactById = chosenContact(contacts,contactId)
       if(contactById){
         console.table(contactById);
        return contactById;
      }
      console.log( `There is no contact with id ${contactId}`.red);
      return null;
    })
    .catch(error=>console.error(error.message));
  }
  
function removeContact(contactId) {
    return getData()
    .then(contacts=>{
      const contactToRemove = chosenContact(contacts, contactId);
      if(!contactToRemove){
        console.log(`There is no contact with id ${contactId}`.red);
        return;
      }
      const filteredContacts = contacts.filter(contact=>contact.id.toString()!==contactId);
      fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null ,2))
      console.log('You just removed:'.yellow);
      console.table(contactToRemove);
      return contactToRemove;
      })
    .catch(error=>console.error("Error message: ",error.message));
  }
  
function addContact(name, email, phone) {
    return getData()
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
      .then(contacts=>fs.writeFile(contactsPath, JSON.stringify(contacts, null ,2)))
    .catch(error=>console.error(error.message));
  }

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
};