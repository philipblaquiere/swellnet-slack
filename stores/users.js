const flat = require('node-flat-db')
const storage = require('node-flat-db/file-sync')
 
const db = flat('.data/users.json', { storage })
 
const methods = {};

methods.getUser = function(userId) {
  console.log(db.object.users);
  let user = db('users').find({ Id: userId });
  
  if(user !== undefined) {
    return user;
  }
  
  return undefined;
}

methods.setUser = function(userId, place) { 
  db('users').remove({ Id: userId })
  db('users').push({ Id: userId, place: place });
}

exports.data = methods;