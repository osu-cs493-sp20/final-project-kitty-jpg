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