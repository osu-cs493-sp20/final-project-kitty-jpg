const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

const userSchema = {
    name: { required: true },
    email: { required: true },
    password: { required: true },
    role: { required: true },
}

async function insertNewUser(user) {
  business = extractValidFields(user, userSchema);
  const db = getDBReference();
  const collection = db.collection('users');
  const result = await collection.insertOne(user);
  return result.insertedId;
}

exports.insertNewUser = insertNewUser;

async function updateUser(user, id) {
  business = extractValidFields(user, userSchema);
  const queryCon = { id: id };
  var oldUser = await getUserById(id);
  if(oldUser){
    const db = getDBReference();
    const collection = db.collection('users');
    if(oldUser._id == id){
      const result = collection.updateOne({_id: id}, user);
      console.log("Updated result = ", result);
      return;
    } else {
      return null;
    }
  } else {
    return null;
  }
  
//  return result.insertedId;
}

exports.updateUser = updateUser;

async function getUserDetailsbyID(id) {
  const user = await getUserById(id);
  return user;
}

exports.getUserDetailsbyID = getUserDetailsbyID;

async function getUserById(id) {
  const db = getDBReference();
  const collection = db.collection('users');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
}

async function getUserByEmail(email) {
  const db = getDBReference();
  const collection = db.collection('users');
  const results = await collection
    .find({ email: email })
    .toArray();
  return results[0];
}