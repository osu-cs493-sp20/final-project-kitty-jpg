const { ObjectId } = require('mongodb');
const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

const courseSchema = {
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructorId: { required: true }
};
exports.courseSchema = courseSchema;

async function insertNewCourse(course) {
  course = extractValidFields(course, courseSchema);
  const db = getDBReference();
  const collection = db.collection('courses');
  const result = await collection.insertOne(course);
  return result.insertedId;
}

exports.insertNewCourse = insertNewCourse;

async function getCourseById(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
}

exports.getCourseById = getCourseById;

async function updateCourseById(id, updateObj) {
  update = extractValidFields(updateObj, courseSchema);
  //if (update.courseId){
    //update.courseId = new ObjectId(update.courseId)
  //}
  console.log(update)
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const db = getDBReference();
    const collection = db.collection('courses');
    const result = await collection.updateOne(
        {_id: new ObjectId(id)},
        {$set: update});
    return result.modifiedCount;
  }
}

exports.updateCourseById = updateCourseById;

async function getCoursesPage(page) {
  const db = getDBReference();
  const collection = db.collection('courses');
  const count = await collection.countDocuments();

  /*
   * Compute last page number and make sure page is within allowed bounds.
   * Compute offset into collection.
   */
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    courses: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getCoursesPage = getCoursesPage;

async function deleteCourseById(id){
  const course = await getCourseById(id);
  if (course) {
    const db = getDBReference();
    const collection = db.collection('courses');
    const result = await collection.deleteOne({_id: course._id});
    return result;
  } else {
    console.log("Course not found")
    return null
  }
}
exports.deleteCourseById = deleteCourseById;
