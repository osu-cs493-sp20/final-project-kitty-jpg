const router = require('express').Router();
const validation = require('../lib/validation');

const {
  courseSchema,
  getCourseDetailsbyID,
  getCourseStudentsByID
} = require('../models/courses')

module.exports = router;

// gets the courses by id
router.get('/:id', async (req, res, next) => {
  try {
    const course = await getCourseDetailsbyID(req.params.id);
    if (course) {
      res.status(200).send(course);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Unable to fetch course. Please try again later. "
    });
  }
});

// gets the students in the courses by id
router.get('/:id/students', async(req, res, next) => {
  try {
    const course = await getCourseStudentsByID(req.params.id);
    if (course) {
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
