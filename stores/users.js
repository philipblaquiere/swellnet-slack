const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./db.json')
const db = low(adapter)
 
const methods = {};

let hasUsers = db.has('users').value();

if(!hasUsers) {
  db.set('users', [])
    .write()
}

methods.getUser = function(userId) {
  let user = db
    .get('users')
    .find({ Id: userId })
    .value();
  
  if(user !== undefined) {
    return user;
  }
  
  return undefined;
} 
 
methods.setUser = function(userId, place) { 
  db
    .get('users')
    .remove({ Id: userId })
    .write();
  
  db
    .get('users')
    .push({ Id: userId, place: place })
    .write();
}

exports.data = methods;