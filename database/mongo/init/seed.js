//seed.js
db = db.getSiblingDB("blog-db");

db.posts.insertOne({
  title: "Neyo default Seeded Post",
  content: "This is my first seeded blog post!",
  author: "Admin",
  createdAt: new Date()
});
