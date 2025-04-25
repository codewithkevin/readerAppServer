db = connect("mongodb://localhost/readerApp");
db.users.insertOne({
  fullName: "example name",
  firstName: "example",
  lastName: "name",
  email: "something@example.com",
  password: "$2b$10$JeYdIND5q2bwa6.95C6xNeRZ57L3/I95N5.Nr1BPn.w9OtWCxeZCy", //examplePassword
  role: "admin",
  address: "my address",
  district: "Weija",
  digitalAddress: "123",
});
