db.createUser({
	user: "businesses",
	pwd: "hunter2",
	roles: [
		{
			role: "readWrite",
			db: "users"
		}
	]
});
db.users.insertMany([
  {
		"_id": "5edecf8a4d87dd0012bfb485",
		"name": "John Smith",
		"email": "jsmith@gmail.com",
		"password": "xxx",
		"role": "student"
  },
  {
		"_id": "5edecf8a4d87dd0012bfb489",
		"name": "Jane Doe",
		"email": "jdoe@gmail.com",
		"password": "xxx",
		"role": "teacher"
  }
])
