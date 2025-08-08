db = db.getSiblingDB("blog-db");

db.posts.insertOne({
  title: "Hello World",
  content: "This is my first seeded blog post!",
  author: "Admin",
  createdAt: new Date()
});
