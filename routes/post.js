const router = require("express").Router();
const postController = require("../controller/post");
const { checkAuth } = require("../middleware/auth");

router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.post("/create", checkAuth, postController.createPost);
router.put("/update/:id", checkAuth, postController.updatePost);
router.put("/like/:id", checkAuth, postController.likePost);
router.delete("/delete/:id", checkAuth, postController.deletePost);

module.exports = router;
