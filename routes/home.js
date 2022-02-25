const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const urls = [
        { origin: "www.google.com/bluuweb1", shortURL: "fjadsk1" },
        { origin: "www.google.com/bluuweb2", shortURL: "fjadsk2" },
        { origin: "www.google.com/bluuweb3", shortURL: "fjadsk3" },
        { origin: "www.google.com/bluuweb4", shortURL: "fjadsk4" },
    ];
    res.render("home", { urls: urls });
});

module.exports = router;
