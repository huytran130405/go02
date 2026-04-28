export const comments = [

  // === Post 1: "How to learn ReactJS fast?" ===
  {
    commentId: 1,
    postId: 1,
    userId: 2,
    parentId: null,
    content: "Start with the official React documentation.",
    createdAt: "2 hours ago"
  },
  {
    commentId: 11, // Reply cho comment 1
    postId: 1,
    userId: 1,
    parentId: 1,
    content: "Thank you! I will check it out.",
    createdAt: "1 hour ago"
  },
  {
    commentId: 2,
    postId: 1,
    userId: 3,
    parentId: null,
    content: "Scrimba React course is amazing.",
    createdAt: "1 hour ago"
  },
  {
    commentId: 3,
    postId: 1,
    userId: 2,
    parentId: null,
    content: "Build small projects from day one — that's the best way to learn.",
    createdAt: "45 minutes ago"
  },

  // === Post 2: "Connect MySQL with Java" ===
  {
    commentId: 4,
    postId: 2,
    userId: 1,
    parentId: null,
    content: "Make sure you add the MySQL JDBC driver to your pom.xml.",
    createdAt: "4 hours ago"
  },
  {
    commentId: 5,
    postId: 2,
    userId: 3,
    parentId: null,
    content: "Check your application.properties for the datasource URL.",
    createdAt: "3 hours ago"
  },

  // === Post 3: "Best VS Code extensions" ===
  {
    commentId: 6,
    postId: 3,
    userId: 1,
    parentId: null,
    content: "Prettier and ESLint are must-haves for any JS project.",
    createdAt: "20 hours ago"
  },
  {
    commentId: 7,
    postId: 3,
    userId: 2,
    parentId: null,
    content: "GitLens is incredibly useful for tracking code history.",
    createdAt: "18 hours ago"
  },
  {
    commentId: 8,
    postId: 3,
    userId: 3,
    parentId: null,
    content: "Thunder Client as a Postman alternative right inside VS Code!",
    createdAt: "15 hours ago"
  },

];
