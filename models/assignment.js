const { ObjectId } = require('mongodb');
const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

const assignmentSchema = {
  courseId: { required: true },
  title: { required: true },
  points: { required: true },
  due: { required: true },
};

exports.assignmentSchema = assignmentSchema;


async function insertNewAssignment(assignment) {
  assignment = extractValidFields(assignment, assignmentSchema);
  assignment.courseId = new ObjectId(assignment.courseId)
  const db = getDBReference();
  const collection = db.collection('assignments');
  const result = await collection.insertOne(assignment);
  return result.insertedId;
}

exports.insertNewAssignment = insertNewAssignment;

async function updateAssignmentById(id, update) {
  update = extractValidFields(update, assignmentSchema);
  if (update.courseId){
    update.courseId = new ObjectId(update.courseId)
  }
  console.log(update)
  const db = getDBReference();
  const collection = db.collection('assignments');
  const result = await collection.updateOne(
      {_id: new ObjectId(id)}, 
      {$set: update});
  return result.modifiedCount;
}

exports.updateAssignmentById = updateAssignmentById;


async function deleteAssignmentById(id) {
    const db = getDBReference();
    const collection = db.collection('assignments');
    const result = await collection.deleteOne({_id: new ObjectId(id)});
    return result.deletedCount;
}

exports.deleteAssignmentById = deleteAssignmentById;

async function getAssignmentById(id) {
    const db = getDBReference();
    const collection = db.collection('assignments');
    const results = await collection
    .find({_id: new ObjectId(id)})
    .toArray();
    return results[0];
}

exports.getAssignmentById = getAssignmentById;

async function getAllAssignments() {
    const db = getDBReference();
    const collection = db.collection('assignments');
    const results = await collection
    .find()
    .toArray();
    return results;
}

exports.getAllAssignments = getAllAssignments

async function getAssignmentsByCourseId(courseId) {
    const db = getDBReference();
    const collection = db.collection('assignments');
    const results = await collection
    .find({courseId: new ObjectId(courseId)})
    .toArray();
    return results;
}

exports.getAssignmentsByCourseId = getAssignmentsByCourseId