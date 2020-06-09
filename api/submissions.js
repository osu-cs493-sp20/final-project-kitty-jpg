const router = require("express").Router({ mergeParams: true });
const { upload } = require("../server");
const {
  getSubmissionInfoById,
  getSubmissionsByAssignmentId,
  deleteSubmissionById,
  updateSubmissionById,
} = require("../models/submission");
const { ObjectId } = require('mongodb')
const validation = require("../lib/validation");

//Post a file to gridFS,
//requires assignmentId as a URL param
//and studentId within the form data
router.post("/", upload.single("file"), async (req, res, next) => {
  if (req.file && req.params.assignmentId && req.body.studentId) {
    try {
      const id = req.file.id;
      res.status(200).send({ id: id });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).send({
      error: "Request body needs fields 'assignmentId' and 'studentId'",
    });
  }
});

//Get all submissions for a given assignment
router.get("/", async (req, res, next) => {
  try {
    const submissions = await getSubmissionsByAssignmentId(
      req.params.assignmentId
    );
    if (submissions) {
      const response = submissions.map(
        (submission) =>
          new Object({
            _id: submission._id,
            url: `/download/submissions/${submission.filename}`,
            timestamp: submission.uploadDate,
            contentType: submission.contentType,
            assignmentId: submission.metadata.assignmentId,
            studentId: submission.metadata.studentId,
          })
      );
      res.status(200).send(response);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

//Get info about a single submissions for a given assignment
router.get("/:id", async (req, res, next) => {
  try {
    const submission = await getSubmissionInfoById(req.params.id);
    if (submission) {
      const responseBody = {
        _id: submission._id,
        url: `/download/submissions/${submission.filename}`,
        timestamp: submission.uploadDate,
        contentType: submission.contentType,
        assignmentId: submission.metadata.assignmentId,
        studentId: submission.metadata.studentId,
      };
      res.status(200).send(responseBody);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

//delete a single submissions for a given assignment
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await deleteSubmissionById(req.params.id);
    res.status(201).send({ status: "deleted", result: result });
  } catch (err) {
    next(err);
  }
});

//Update a single submissions for a given assignment
router.patch("/:id", async (req, res, next) => {
  try {
    const updateObj = {
      assignmentId: new ObjectId(req.params.assignmentId),
      studentId: new ObjectId(req.body.studentId),
    };
    const result = await updateSubmissionById(req.params.id, updateObj);
    res.status(200).send({res: result});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
