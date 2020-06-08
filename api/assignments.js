const router = require("express").Router();
const { upload } = require("../server");
const {
  getSubmissionInfoById,
  getSubmissionsByAssignmentId,
} = require("../models/submission");
const {
  assignmentSchema,
  insertNewAssignment,
  getAllAssignments,
} = require("../models/assignment")
const validation = require("../lib/validation");

// Post a new assignment. Body must contains all
// fields of assignment schema
router.post('/', async (req, res, next) => {
   try {
       if(validation.validateAgainstSchema(req.body, assignmentSchema)){
         const id = await insertNewAssignment(req.body);
         res.status(200).send(id);  
       } else {
         res.status(400).send({
             error: "invalid body"
         })
       }
       
   } catch (err) {
       console.error(err);
       res.status(500).send({
           error: "internal error with creating assignment"
       });
   }
});

// endpoint to fetch array of all assignments in DB
router.get('/', async (req, res, next) => {
  try{
    const assignments = await getAllAssignments();
    res.status(200).send(assignments);
  } catch (err) {
      console.error(err);
      res.status(500).send({
          error: "internal error with creating assignment"
      });
  }
})

//Post a file to gridFS, 
//requires assignmentId as a URL param
//and studentId within the form data
router.post("/:assignmentId/submissions",
  upload.single("file"),
  async (req, res, next) => {
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
  }
);

//Get all submissions for a given assignment 
router.get("/:assignmentId/submissions", async (req, res, next) => {
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
router.get("/:assignmentId/submissions/:id", async (req, res, next) => {
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

module.exports = router;
