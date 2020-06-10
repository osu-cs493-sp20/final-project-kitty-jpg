//Lauren Sunamoto
const router = require('express').Router();
const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken } = require('../lib/auth');
const { ObjectId } = require('mongodb');
const { getAssignmentsByCourseId, getAssignmentById, getAllAssignments } = require('../models/assignment');

const {
  requireAuthentication
} = require('../lib/auth')

const {
  getUserDetailsbyID
} = require('../models/user')
const {
  courseSchema,
  getCourseDetailsbyID,
  getCourseStudentsByID,
  CourseById,
  getCoursesPage,
  updateCourseById,
  insertNewCourse,
  getCourseById,
  deleteCourseById
} = require('../models/courses')

router.get('/', async (req, res) => {
  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const coursePage = await getCoursesPage(parseInt(req.query.page) || 1);
    coursePage.links = {};
    if (coursePage.page < coursePage.totalPages) {
      coursePage.links.nextPage = `/courses?page=${coursePage.page + 1}`;
      coursePage.links.lastPage = `/courses?page=${coursePage.totalPages}`;
    }
    if (coursePage.page > 1) {
      coursePage.links.prevPage = `/courses?page=${coursePage.page - 1}`;
      coursePage.links.firstPage = '/courses?page=1';
    }
    for (let val of coursePage.courses){
      delete(val.students)
    }
    // TODO: Remove list of assignments
    res.status(200).send(coursePage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching courses list.  Please try again later."
    });
  }
});

router.post("/", requireAuthentication, async (req, res, next) => {
  if (req.user.role == 0) {
    try {
      if (validateAgainstSchema(req.body, courseSchema)) {
        const id = await insertNewCourse(req.body);
        res.status(200).send({id: id});
      } else{
        res.status(400).send({
          error: "Request body is not a valid course object."
       });
      }
    } catch(err) {
      res.status(500).send({
        error: "Error inserting course into DB. Please try again later."
      });
    }
  } else {
    res.status(403).send({
      error: "Only an authenticated user with admin role can create a new course."
    });
  }
});

router.get("/:courseId",  async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.courseId);
    if (course) {
      delete(course.students)
      // TODO: delete(course.assignments)
      res.status(200).send(course);
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send({
      error: "An error occurred.  Try again later."
    });
  }
});

router.patch("/:id", requireAuthentication, async (req, res, next) => {
  if( (req.user.role == 0) || (req.user.id == req.body.instructorId) ) {
    try {
      const updateObj = req.body;
        //subject: new ObjectId(req.params.subject),
        //number: new ObjectId(req.body.number),
        //title: new ObjectId(req.body.title),
        //term: new ObjectId(req.body.term),
        //instructorId: new ObjectId(req.body.instructorId)
      //};
      const result = await updateCourseById(req.params.id, updateObj);
      res.status(200).send();
    } catch (err) {
      next(err);
    }
  } else {
    res.status(403).send({
      error: "Only an authenticated user with admin role or instructor role can create a new course."
    });
  }
});

router.delete("/:courseId", requireAuthentication, async (req, res, next) => {
  if (req.user.role == 0){
    try {
      const result = await deleteCourseById(req.params.courseId);
      if (result == null){
        res.status(404).send({
          error: "Course with given id not found."
        });
      } else {
        res.status(204).send({
          success: "course deleted"
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "An error occurred.  Try again later."
      });
    }
  } else {
    res.status(403).send({error: "This action requires a higher privelege"})
  }
});

router.get("/:courseId/assignments", async (req, res, next) => {
  try{
    const assignments = await getAssignmentsByCourseId(req.params.courseId);
    res.status(200).send({assignments: assignments});
  } catch (err) {
    console.error(err);
      res.status(500).send({
        error: "An error occurred.  Try again later."
      });
  }
});

// gets the students in the courses by id
router.get('/:id/students', requireAuthentication, async(req, res, next) => {
  if ((req.user.role == 0) || (req.user.role == 1)) {
    try {
      const course = await getCourseById(req.params.id);
      if (course) {
        if (req.user.role == 1){
          if (req.user.id == course.instructorid){
            res.status(200).send({
              students: course.students
            });
          } else {
            res.status(403).send({error: "Must be an instructor of the course"});
          }
        } else {
          res.status(200).send({
            students: course.students
          });
        }
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "Unable to students from course. Please try again later. "
      });
    }
  } else {
    res.status(403).send({error: "This action requires a higher privelege"})
  }
});

router.post('/:id/students', requireAuthentication, async(req, res, next) => {
  if ((req.user.role == 0) || (req.user.id == req.body.instructorId)){

  } else {
    res.status(403).send({error: "This action requires a higher privelege"})
  }
});

router.get('/:id/roster', requireAuthentication, async(req, res, next) => {
  if ((req.user.role == 0) || (req.user.role == 1)) {
    try {
      const course = await getCourseById(req.params.id);
      if (course) {
        var csv = "id, name, email"
        csv += '\n'
        for (let student of course.students){
          const s = await getUserDetailsbyID(student);
          if (s){
            csv += s._id
            csv += ','
            csv += s.name;
            csv += ','
            csv += s.email
            csv += '\n'
          }
        }
        if (req.user.role == 1){
          if (req.user.id == course.instructorid){

            res.status(200).send(csv);
          } else {
            res.status(403).send({error: "Must be an instructor of the course"});
          }
        } else {
          res.status(200).send(csv);
        }
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "Unable to get roster. Please try again later. "
      });
    }
  } else {
    res.status(403).send({error: "This action requires a higher privelege"})
  }
});


module.exports = router;
