//Lauren Sunamoto
const router = require('express').Router();
const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken } = require('../lib/auth');
const { ObjectId } = require('mongodb');
const { getAssignmentsByCourseId } = require('../models/assignment');

const {
  requireAuthentication
} = require('../lib/auth')


const {
  courseSchema,
  getCourseDetailsbyID,
  getCourseStudentsByID,
  CourseById,
  getCoursesPage,
  updateCourseById,
  insertNewCourse,
  getCourseById
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

router.patch("/:id", async (req, res, next) => {
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

/*
router.delete("/:courseId", requireAuthentication, async (req, res, next) => {
  if (req.user.role == 0){
    try {
      const result = await deleteCourseById(req.params.courseId);
      res.status(204).send();
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
*/
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
router.get('/:id/students', async(req, res, next) => {
  console.log("endpoint hit");
  try {
    const course = await getCourseById(req.params.id);
    if (course) {
      console.log("course found")
      console.log(course)
      res.status(200).send(course.students);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Unable to students from course. Please try again later. "
    });
  }
});

module.exports = router;
