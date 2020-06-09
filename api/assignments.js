const router = require("express").Router();
const {
  assignmentSchema,
  insertNewAssignment,
  getAllAssignments,
  deleteAssignmentById,
  updateAssignmentById,
  getAssignmentById
} = require("../models/assignment");
const {
  requireAuthentication
} = require('../lib/auth')
const validation = require("../lib/validation");

// Post a new assignment. Body must contains all
// fields of assignment schema
router.post("/", requireAuthentication, async (req, res, next) => {
  if (req.user.role <= 1){
    try {
      if (validation.validateAgainstSchema(req.body, assignmentSchema)) {
        const id = await insertNewAssignment(req.body);
        res.status(200).send(id);
      } else {
        res.status(400).send({
          error: "invalid body",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "internal error with creating assignment",
      });
    }
  } else {
    res.status(401).send({error: "This action requires a higher privelege"}) 
  }
});

// endpoint to fetch array of all assignments in DB
router.get("/", requireAuthentication, async (req, res, next) => {
  if (req.user.role <= 1){
    try {
      const assignments = await getAllAssignments();
      res.status(200).send(assignments);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "internal error with getting assignments",
      });
    }
  } else {
    res.status(401).send({error: "This action requires a higher privelege"}) 
  }
});

// endpoint to get single assignment in DB
router.get("/:assignmentId", requireAuthentication, async (req, res, next) => {
  if (req.user.role <= 2){
    try {
      const result = await getAssignmentById(req.params.assignmentId);
      res.status(200).send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "internal error with getting assignment",
      });
    }
  } else {
    res.status(401).send({error: "This action requires a higher privelege"}) 
  }
});

// endpoint to update assignment in DB
router.put("/:assignmentId", requireAuthentication, async (req, res, next) => {
  if (req.user.role <= 1){
    try {
      const result = await updateAssignmentById(req.params.assignmentId, req.body);
      res.status(201).send({res: result});
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "internal error with patching assignment",
      });
    }
  } else {
    res.status(401).send({error: "This action requires a higher privelege"}) 
  }
});

// endpoint to delete assignment in DB
router.delete("/:assignmentId", requireAuthentication, async (req, res, next) => {
  if (req.user.role <= 1){
    try {
      const result = await deleteAssignmentById(req.params.assignmentId);
      res.status(201).send({status: "deleted", result: result});
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "internal error with patching assignment",
      });
    }
  } else {
    res.status(401).send({error: "This action requires a higher privelege"}) 
  }
});

router.use("/:assignmentId/submissions", require("./submissions"));

module.exports = router;
