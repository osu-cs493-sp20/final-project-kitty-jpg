db.assignments.insertMany([
  {
    "_id": "5ede7d67fc5a3b4bbb8e80f9",
    "courseId": "4ede7188df0d9f5831a0c051",
    "title": "Big Essay",
    "points": "100",
    "due": "2020-06-12T03:56:04.822Z"
  },
])

db.courses.insertMany([
  {
    "_id": "4ede7188df0d9f5831a0c051",
    "subject": "English",
    "number": "101",
    "title": "Intro to English",
    "term": "Fall 2020",
    "instructorId": "3ede7188df0d9f5831a0c051"
  },
])

db.users.insertMany([
  {
    "_id": "3ede7188df0d9f5831a0c050",
    "name": "Adminiostatorsa",
    "password": "hunter2",
    "email": "admin@it.hogwarts.edu",
    "role": "0",
  },
  {
    "_id": "3ede7188df0d9f5831a0c051",
    "name": "Albus Dumbledor",
    "password": "bestbeard2020",
    "email": "albus@hogwarts.edu",
    "role": "1",
  },
  {
    "_id": "3ede7188df0d9f5831a0c052",
    "name": "Harry Potter",
    "password": "chosen1",
    "email": "potterh@hogwarts.edu",
    "role": "2",
  },
])
