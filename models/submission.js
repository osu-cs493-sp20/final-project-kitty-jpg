/*
 * Submission schema and data accessor methods.
 */
const { ObjectId, GridFSBucket } = require('mongodb');
const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation')

/*
 * Schema describing required/optional fields of a submission object.
 */
const SubmissionSchema = {
  assignmentId: { required: true },
  studentId: { required: true },
};
exports.SubmissionSchema = SubmissionSchema;

async function getSubmissionInfoById(id) {
  const db = getDBReference();
  const bucket =
    new GridFSBucket(db, { bucketName: 'submissions' });

  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results =
      await bucket.find({ _id: new ObjectId(id) }).toArray();
    return results[0];
  }
}
exports.getSubmissionInfoById = getSubmissionInfoById;

async function deleteSubmissionById(id) {
  const db = getDBReference();
  const bucket =
    new GridFSBucket(db, { bucketName: 'submissions' });

  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results =
      await bucket.delete(new ObjectId(id));
    return results;
  }
}
exports.deleteSubmissionById = deleteSubmissionById;

async function updateSubmissionById(id, updateObj) {
    updateObj = extractValidFields(updateObj, SubmissionSchema)
    console.log(updateObj)
  const db = getDBReference();

  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results =
        await db.collection('submissions.files').updateOne(
            {'_id': new ObjectId(id)},
            {'$set': {
                "metadata.studentId": updateObj.studentId,
                "metadata.assignmentId": updateObj.assignmentId
                }
            })
    return results.modifiedCount;
  }
}
exports.updateSubmissionById = updateSubmissionById;

function getDownloadStreamByFilename(filename) {
  const db = getDBReference();
  const bucket =
    new GridFSBucket(db, { bucketName: 'submissions' });
  return bucket.openDownloadStreamByName(filename);
 }
exports.getDownloadStreamByFilename = getDownloadStreamByFilename;

function getDownloadStreamById(id) {
  const db = getDBReference();
  const bucket =
    new GridFSBucket(db, { bucketName: 'submissions' });
  return bucket.openDownloadStream(new ObjectId(id));
}
exports.getDownloadStreamById = getDownloadStreamById;

/*
 * Executes a DB query to fetch all submissions for a specified assignment, based
 * on the assignment's ID.  Returns a Promise that resolves to an array
 * containing the requested submissions.  This array could be empty if the
 * specified assignment does not have any assignments.  This function does not verify
 * that the specified assignment ID corresponds to a valid assignment.
 */
async function getSubmissionsByAssignmentId(id) {
  const db = getDBReference();
  const bucket =
    new GridFSBucket(db, { bucketName: 'submissions' });

  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results =
      await bucket.find({ 'metadata.assignmentId': new ObjectId(id) })
      .project({ 
        _id: 1,
        uploadDate: 1,
        filename: 1,
        contentType: 1,
        metadata: 1,
     })
      .toArray();
    return results;
  }
}
exports.getSubmissionsByAssignmentId = getSubmissionsByAssignmentId 
