const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

const courseSchema = {
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructorid: { required: true },
}
exports.courseSchema = courseSchema


// gets courses by id
async function getCourseDetailsbyID(id) {
  const course = await getCourseById(id);
  return course;
}
exports.getCourseDetailsbyID = getCourseDetailsbyID;

async function getCourseById(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: id })
      .toArray();
    return results[0];
  }
}

async function getCourseStudentsByID(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: id })
      .toArray();
    return results[0];
  }
}
exports.getCourseStudentsByID = getCourseDetailsbyID;
