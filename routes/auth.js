const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
    // ruta de prueba login
    res.render("login");
});

module.exports = router;
