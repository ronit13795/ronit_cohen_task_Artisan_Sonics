const router = require("express").Router();
const { find } = require("../controllers/patients");

router.get("/find", find);

module.exports = router;
