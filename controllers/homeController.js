const Url = require("../models/Url");
const { nanoid } = require("nanoid");

const leerUrls = async (req, res) => {
    // console.log(req.user);
    try {
        const urls = await Url.find({ user: req.user.id }).lean();
        return res.render("home", { urls: urls });
    } catch (error) {
        // console.log(error);
        // return res.send("falló algo...");
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const agregarUrl = async (req, res) => {
    // console.log(req.user);
    const { origin } = req.body;

    try {
        const url = new Url({
            origin: origin,
            shortURL: nanoid(8),
            user: req.user.id,
        });
        await url.save();
        req.flash("mensajes", [{ msg: "Url agregada" }]);
        return res.redirect("/");
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const eliminarUrl = async (req, res) => {
    // console.log(req.user.id);
    const { id } = req.params;
    try {
        // await Url.findByIdAndDelete(id);
        const url = await Url.findById(id);
        if (!url.user.equals(req.user.id)) {
            throw new Error("No es tu url payaso");
        }

        await url.remove();
        req.flash("mensajes", [{ msg: "Url eliminada" }]);
        return res.redirect("/");
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const editarUrlForm = async (req, res) => {
    // console.log(req.user.id);
    const { id } = req.params;
    try {
        const url = await Url.findById(id).lean();

        if (!url.user.equals(req.user.id)) {
            throw new Error("No es tu url payaso");
        }

        return res.render("home", { url });
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const editarUrl = async (req, res) => {
    // console.log(req.user.id);
    const { id } = req.params;
    const { origin } = req.body;
    try {
        const url = await Url.findById(id);
        if (!url.user.equals(req.user.id)) {
            throw new Error("No es tu url payaso");
        }

        await url.updateOne({ origin });
        req.flash("mensajes", [{ msg: "Url editada" }]);

        // await Url.findByIdAndUpdate(id, { origin: origin });
        res.redirect("/");
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const redireccionamiento = async (req, res) => {
    const { shortURL } = req.params;
    // console.log(shortURL);
    try {
        const urlDB = await Url.findOne({ shortURL: shortURL });
        return res.redirect(urlDB.origin);
    } catch (error) {
        req.flash("mensajes", [{ msg: "No existe esta url configurada" }]);
        return res.redirect("/auth/login");
    }
};

module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionamiento,
};
