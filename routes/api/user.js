const router = require("express").Router();
const auth = require("../auth");
// const Users = mongoose.model("User");
const usersController = require("../../controllers/userController");

//POST new user route (optional, everyone has access)
// router.post("/", auth.optional, (req, res, next) => {
//   const {
//     body: { user }
//   } = req;

//   if (!user.email) {
//     return res.status(422).json({
//       errors: {
//         email: "is required"
//       }
//     });
//   }

//   if (!user.password) {
//     return res.status(422).json({
//       errors: {
//         password: "is required"
//       }
//     });
//   }

//   const finalUser = new Users(user);

//   finalUser.setPassword(user.password);

//   return finalUser.save().then(() => res.json({ user: finalUser.toAuthJSON() }));
// });

//POST login route (optional, everyone has access)
router.route("/login").post(usersController.login, auth.optional);

//GET current route (required, only authenticated users have access)
router.route("/current").get(auth.required, usersController.currentUser);

module.exports = router;
