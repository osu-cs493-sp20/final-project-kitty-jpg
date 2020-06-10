

db.assignments.insertMany([
  {
    "_id": ObjectId("5ede7d67fc5a3b4bbb8e80f9"),
    "courseId": ObjectId("5edecf8a4d87dd0012bfb129"),
    "title": "Big Essay",
    "points": "100",
    "due": "2020-06-12T03:56:04.822Z"
  },
	{
		"_id": ObjectId("5ede7d67fc5a3b4bbb8e80f8"),
		"courseId": ObjectId("5edecf8a4d87dd0012bfb129"),
		"title": "Little Essay",
		"points": "50",
		"due": "2020-07-12T03:56:04.822Z"
	},
	{
		"_id": ObjectId("5ede7d67fc5a3b4bbb8e80f7"),
		"courseId": ObjectId("5edecf8a4d87dd0012bfb009"),
		"title": "Essay",
		"points": "10",
		"due": "2020-05-12T03:56:04.822Z"
	},
])

db.courses.insertMany([
	{
		"_id": ObjectId("5edecf8a4d87dd0012bfb129"),
		"subject": "english",
		"number": "231",
		"title": "English 1",
		"term": "Spring",
		"instructorid": "3ede7188df0d9f5831a0c051",
		"students": [
			ObjectId("3ede7188df0d9f5831a0c052"),
			ObjectId("5edecf8a4d87dd0012bfb486")
		]
	},
  {
		"_id": ObjectId("5edecf8a4d87dd0012bfb009"),
		"subject": "math",
		"number": "341",
		"title": "Linear Algebra",
		"term": "Spring",
		"instructorid": "5edecf8a4d87dd0012bfb489",
		"students": [
      ObjectId("5edecf8a4d87dd0012bfb485")
    ]
	},
	{
		"_id": ObjectId("5edecf8a4d87dd0012bfb539"),
		"subject": "computer science",
		"number": "290",
		"title": "Web Dev",
		"term": "Spring",
		"instructorid": "3ede7188df0d9f5831a0c051",
		"students": [

    ]
	},
])

db.users.insertMany([
  {
    "_id": ObjectId("3ede7188df0d9f5831a0c050"),
    "name": "Admin",
    "password": "$2a$08$9kI4bTtO4Tt5qww.2t0.2OHcLX5eGcMHhE.GnKoWpLfmJlbQ7jpOa",
    "email": "admin@it.hogwarts.edu",
    "role": "0",
  },
  {
    "_id": ObjectId("3ede7188df0d9f5831a0c051"),
    "name": "Albus Dumbledor",
    "password": "$2a$08$9kI4bTtO4Tt5qww.2t0.2OHcLX5eGcMHhE.GnKoWpLfmJlbQ7jpOa",
    "email": "albus@hogwarts.edu",
    "role": "1",
  },
  {
    "_id": ObjectId("3ede7188df0d9f5831a0c052"),
    "name": "Harry Potter",
    "password": "$2a$08$9kI4bTtO4Tt5qww.2t0.2OHcLX5eGcMHhE.GnKoWpLfmJlbQ7jpOa",
    "email": "potterh@hogwarts.edu",
    "role": "2",
  },
	{
		"_id": ObjectId("5edecf8a4d87dd0012bfb486"),
		"name": "Ron Wesley",
		"password": "$2a$08$9kI4bTtO4Tt5qww.2t0.2OHcLX5eGcMHhE.GnKoWpLfmJlbQ7jpOa",
		"email": "wesleyR@hogwarts.edu",
		"role": "2",
	},
])
