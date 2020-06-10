//Sean Spink
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs')
const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

const {
  getUserDetailsbyID,
} = require('./user');

const {
  getCourseById
} = require('./course');

exports.getRosterEntry = async function(u_id, c_id){
  const db = getDBReference();
  const collection = db.collection('roster');
  const results = await collection
      .find({ user: u_id, course: c_id })
      .toArray();
  return results[0];
}

exports.insertUserToCourse = async function(u_id, u_role, c_id){
  //get course by id to verify its existence
  var course = getCourseById(c_id);
  //get user by id to verify its existence
  var user = getUserDetailsbyID(u_id); 
  //check for duplicates
  var roster = getRosterEntry(u_id, c_id);
  //create entry in collection 'course_roster'
  if(user && course && !roster){
    const db = getDBReference();
    const collection = db.collection('roster');
    const result = await collection.insertOne({user: u_id, role: u_role, course: c_id});
    return result;
  } else if(!user){
    console.log("Invalid user id");
    return -1;
  } else if(!course){
    console.log("Invlaid course id");
    return -2;
  } else {
    console.log("Duplicate roster entry");
    return -3;
  }
}

exports.updateUserInCourse = async function(u_id, u_role, c_id){
  //get course by id to verify its existence
  var course = getCourseById(c_id);
  //get user by id to verify its existence
  var user = getUserDetailsbyID(u_id); 
  //check for duplicates
  var roster = getRosterEntry(u_id, c_id);
  //create entry in collection 'course_roster'
  if(user && course && !roster){
    const db = getDBReference();
    const collection = db.collection('roster');
    
    //TODO - update entry
    
    return result;
  } else if(!user){
    console.log("Invalid user id");
    return -1;
  } else if(!course){
    console.log("Invlaid course id");
    return -2;
  } else {
    console.log("Duplicate roster entry");
    return -3;
  }
}

exports.removeUserFromCourse = async function(u_id, c_id){
  //get course by id to verify its existence
  var course = getCourseById(c_id);
  //get user by id to verify its existence
  var user = getUserDetailsbyID(u_id); 
  //remove entry in collection 'course_roster'
  if(user && course){
    const db = getDBReference();
    const collection = db.collection('roster');
    const result = await collection.deleteOne({user: u_id, course: c_id});
    return result;
  } else if(!user){
    console.log("Invalid user id");
    return -1;
  } else if(!course){
    console.log("Invlaid course id");
    return -2;
  } else {
    return -3;
  }  
}

exports.removeCourseFromRoster = async function(c_id){
  //get course by id to verify its existence
  var course = getCourseById(c_id);
  //remove entry in collection 'course_roster'
  if(user && course){
    const db = getDBReference();
    const collection = db.collection('roster');
    const result = await collection.deleteMany({course: c_id});
    return result;
  } else if(!user){
    console.log("Invalid user id");
    return -1;
  } else if(!course){
    console.log("Invlaid course id");
    return -2;
  } else {
    return -3;
  }  
}

exports.removeUserFromRoster = async function(u_id){
  //get user by id to verify its existence
  var user = getUserDetailsbyID(u_id); 
  //remove entry in collection 'course_roster'
  if(user && course){
    const db = getDBReference();
    const collection = db.collection('roster');
    const result = await collection.deleteMany({user: u_id});
    return result;
  } else if(!user){
    console.log("Invalid user id");
    return -1;
  } else if(!course){
    console.log("Invlaid course id");
    return -2;
  } else {
    return -3;
  }  
}