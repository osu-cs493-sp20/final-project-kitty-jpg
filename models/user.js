//Sean Spink
const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

const userSchema = {
    name: { required: true },
    email: { required: true },
    password: { required: true },
    role: { required: true },
}
exports.userSchema = userSchema;

async function insertNewUser(user) {
  const tempUser = await getUserByEmail(user.email);
  if(tempUser == null){
    user = extractValidFields(user, userSchema);
    if(user.role == "student" || user.role == "instructor" || user.role == "admin"){
      const db = getDBReference();
      const collection = db.collection('users');
      const result = await collection.insertOne(user);
      return result.insertedId;
    } else {
      return null;
    }
  } else {
    console.log("Duplicate email");
    return null;
  }
}

exports.insertNewUser = insertNewUser;

async function deleteUser(id) {
  const tempUser = await getUserById(id);
  if(tempUser != null){
    userData = extractValidFields(tempUser, userSchema);
    const db = getDBReference();
    const collection = db.collection('users');
    const result = await collection.deleteOne({_id:tempUser._id});
    return result;
  } else {
    console.log("Couldn't find user", id);
    return null;
  }
}

exports.deleteUser = deleteUser;

async function updateUser(user, id) {
  userDat = extractValidFields(user, userSchema);
  const queryCon = { id: id };
  const oldUser = await getUserById(id);
  if(oldUser != null){
    const db = getDBReference();
    const collection = db.collection('users');
    console.log("New User DAta = ", user);
    if(oldUser._id == id){
      const result = await collection.updateOne({_id:oldUser._id}, {$set: user});
      console.log("RESULTS: ", result);
      return result;
    } else {
      return null;
    }
  } else {
    return null;
  }
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
      .find({ _id: id })
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
  console.log("Results: ", results[0]);
  return results[0];
}
