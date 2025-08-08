// init-user.js

// switch to the blog-db database
db = db.getSiblingDB("blog-db");  // Switch to 'blog-db'

// Create a user with readWrite access to 'blog-db'
db.createUser({
  user: "neyo",
  pwd: "neyo@53669",
  roles: [{ role: "readWrite", db: "blog-db" }]
})

