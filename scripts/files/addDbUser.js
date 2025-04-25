db = connect("mongodb://localhost/readerApp");
db.createUser({
  user: "developer",
  pwd: "password",
  roles: [{ role: "dbAdmin", db: "readerApp" }],
});
