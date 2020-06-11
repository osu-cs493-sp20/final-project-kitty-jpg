//Sean Spink
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs')
const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { getCourseById,
      updateCourseById} = require('./courses');

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
    tempUser.courses.forEach(async function(item, index, array){
      var course = await getCourseById(item);
      if(course){
        course.students.forEach(function(item2, index2, array2){
          if(item == id){
            course.students.splice(index2, 1);
          }
        });  
        await updateCourseById(item, course);
      }
    });
    
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
  console.log("user id", new ObjectId(id));
  console.log("user obj id", user._id);
  const queryCon = { id: id };
  const oldUser = await getUserById(id);
  if(oldUser != null){
    const db = getDBReference();
    const collection = db.collection('users');
    //console.log("New User DAta = ", user);
    if(oldUser._id == new ObjectId(id)){
      console.log("updating: ", oldUser.id, " with ", user);
      const result = await collection.updateOne({_id: oldUser._id}, {$set: user});
      //console.log("RESULTS: ", result);
      return result.modifiedCount;
    } else {
      console.log('User not the same id');
      return null;
    }
  } else {
    console.log('User DNE');
    return null;
  }
}

async function updateEntry(user, id) {
  userDat = extractValidFields(user, userSchema);
  const queryCon = { id: id };
  const oldUser = await getUserById(id);
  if(oldUser != null){
    const db = getDBReference();
    const collection = db.collection('users');
    //console.log("New User DAta = ", user);
      console.log("updating: ", oldUser.id, " with ", user);
      const result = await collection.updateOne({_id: oldUser._id}, {$set: user});
      //console.log("RESULTS: ", result);
      return result.modifiedCount;
  } else {
    console.log('User DNE');
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
    console.log("Invalid id: ", id);
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
  if(!user){
    console.log('Error fetching user');
    return null;
  }  
  if(user.role == 2){
    console.log("Updating user courses: ", user);
    console.log('Adding to courses', req.body.add.length);
    console.log('Recieved User ', user);
    if(!user.courses){
      console.log('initializing courses');
      user.courses = [];
    }
    for(var i = 0; i < req.body.add.length; i++){
      var course = await getCourseById(req.body.add[i]);
      if(course){
        if(!course.students){
          course.students = [];
        }
        if(!user.courses.includes(req.body.add[i])){
          user.courses.push(req.body.add[i]);
        }
        if(!course.students.includes(req.param.id)){
          course.students.push(user._id);
        }
        console.log("New Course",i , ": ", course);
        await updateCourseById(req.params.id, course);
      }
    }
    console.log("New User: ", user);
    console.log("id before update", req.params.id);
    await updateEntry(user, req.params.id);
  } else if(user.role == 1){
    console.log("Updating user courses: ", user);
    console.log('Adding to courses', req.body.add.length);
    console.log('Recieved User ', user);
    if(!user.courses){
      console.log('initializing courses');
      user.courses = [];
    }
    for(var i = 0; i < req.body.add.length; i++){
      var course = await getCourseById(req.body.add[i]);
      if(course){
        var oldInstructor = await getUserById(course.instructorId);
        console.log(oldInstructor);
        if(oldInstructor != null){
          var index = oldInstructor.courses.find(course.req.body.add[i]);
          if(index){
            oldInstructor.courses.splice(index, 1);
          }
        }
        course.instructorId = user._id;
        if(!user.courses.includes(req.body.add[i])){
          user.courses.push(req.body.add[i]);
        }
        
        console.log("New Course", i , ": ", course);
        await updateCourseById(req.params.id, course);
      }
    }
    console.log("New User: ", user);
    console.log("id before update", req.params.id);
    await updateEntry(user, req.params.id);
  }
}

exports.removeUserFromCourse = async function(req){
  const user = await exports.getUserDetailsbyID(req.params.id);
  if(!user){
    console.log('Error fetching user');
    return null;
  }  
  if(user.role == 2){
    console.log("Updating user courses: ", user);
    console.log('Adding to courses', req.body.remove.length);
    console.log('Recieved User ', user);
    if(!user.courses){
      return null;
    }
    for(var i = 0; i < req.body.remove.length; i++){
      var course = await getCourseById(req.body.remove[i]);
      if(course){
        if(user.courses.includes(req.body.remove[i])){
          var index = user.course.find(req.body.remove[i]);
          user.courses.splice(index, 1);
        }
        if(course.students){
          if(course.students.includes(req.param.id)){
            var index = course.students.find(req.body.remove[i]);
            course.students.splice(index, 1);
          }
        }
        console.log("New Course",i , ": ", course);
        await updateCourseById(req.params.id, course);
      }
    }
    console.log("New User: ", user);
    console.log("id before update", req.params.id);
    await updateEntry(user, req.params.id);
  } else if(user.role == 1){
    console.log("Updating user courses: ", user);
    console.log('Adding to courses', req.body.remove.length);
    console.log('Recieved User ', user);

    for(var i = 0; i < req.body.remove.length; i++){
      var course = await getCourseById(req.body.remove[i]);
      if(course){
        course.instructorId = "removed";
        if(user.courses.includes(req.body.remove[i])){
          var index = user.course.find(req.body.remove[i]);
          user.courses.splice(index, 1);
        }
        console.log("New Course", i , ": ", course);
        await updateCourseById(req.params.id, course);
      }
    }
    console.log("New User: ", user);
    console.log("id before update", req.params.id);
    await updateEntry(user, req.params.id);
  }
  
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
  
  if(courseList.includes(course)){
    return false;
  } else {
    return true;
  }
}

function needsStudentsInsertion(course, courseList){
  var test = true;
  
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