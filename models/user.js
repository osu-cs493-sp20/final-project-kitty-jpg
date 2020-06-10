//Sean Spink
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs')
const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { getCourseById } = require('./courses');

const userSchema = {
    name: { required: true },
    email: { required: true },
    password: { required: true },
    role: { required: true },
    courses: {required: false}
}

const courseInsertSchema = {
    add: {required: false},
    remove: {required: false}
}

async function insertNewUser(user) {
  const tempUser = await exports.getUserByEmail(user.email);
  if(tempUser == null){
    user = extractValidFields(user, userSchema);
    if(user.role === "2" || user.role === "1" || user.role === "0"){
      user.password = await bcrypt.hash(
        user.password,
        8
      );
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
    return result.deletedCount;
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
    //console.log("New User DAta = ", user);
    if(oldUser._id == id){
      const result = await collection.updateOne({_id:oldUser._id}, {$set: user});
      //console.log("RESULTS: ", result);
      return result.modifiedCount;
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
    console.log("Invalid id");
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
//    console.log('User: ', results[0]);
    return results[0];
  }
}

exports.getUserByEmail = async function (email) {
  const db = getDBReference();
  const collection = db.collection('users');
  const results = await collection
    .find({ email: email })
    .toArray();
  //console.log("Results: ", results[0]);
  return results[0];
}

exports.validateUser = async function (email, password) {
  const user = await exports.getUserByEmail(email);
  if (user && await bcrypt.compare(password, user.password)) {
      return user;
  }
  else {
      return null
  }
};

exports.insertUserToCourse = async function(req){
  const user = await exports.getUserDetailsbyID(req.params.id);
//  console.log("Updating user courses: ", user);
  if(!user){
    console.log('Error fetching user');
    return null;
  }
  if(!user.courses){
//    console.log('Creating courses');
    user.courses = req.body.add;
  } else {
//    console.log('Adding to courses');
    req.body.add.forEach(async function(item, index, array){
      var cond = await needsInsertion(item, user.courses);
      if(cond){
        user.courses.push(item);
      }
    });    
  }
  console.log("Updating user courses: ", user);
  return await updateUser(user, req.params.id);
}

exports.removeUserFromCourse = async function(req){
  const user = await exports.getUserDetailsbyID(req.params.id);
//  console.log("Updating user courses: ", user);
  if(!user){
    console.log('Error fetching user');
    return null;
  }
  if(!user.courses){
//    console.log('Creating courses');
    return null;
  } else {
    const newArr = [];
//    const removal = extractValidFields(req.body, courseInsertSchema);
//    console.log('Adding to courses');
    user.courses.forEach(function(item, index, array){
      console.log("From Body: ", item);
      if(!needsRemoval(item, req.body.remove)){
        newArr.push(item);
      }
    });
    user.courses = newArr;
  }
  console.log("Updating user courses: ", user);
  return await updateUser(user, req.params.id);
}

function needsRemoval(course, removalList){
  var test = false;
  removalList.forEach(function(item, index, array){
    console.log("Checking: ", course, "Against: ", item);
    if(course === item){
      console.log('returning true');
      test = true;
    }
  });
  console.log('test: ', test);
  if(test){
    return test;
  } else {
    return false;
  }
}

async function needsInsertion(course, courseList){
  var test = true;
  var course = await getCourseById(course);
  
  if(!course){
    console.log('course: ', course, ' is invalid ');
    return false;
  }
  
  courseList.forEach(function(item, index, array){
    console.log("Checking: ", course, "Against: ", item);
    if(course == item){
      console.log('returning true');
      test = false;
    }
  });
  
  console.log('test: ', test);
  return test;
}