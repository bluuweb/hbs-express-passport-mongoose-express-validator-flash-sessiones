const User = require("../models/User");
const { validationResult } = require("express-validator");
const { nanoid } = require("nanoid");

const registerForm = (req, res) => {
    res.render("register", { mensajes: req.flash("mensajes") });
};

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.json(errors);
        req.flash("mensajes", errors.array());
        return res.redirect("/auth/register");
    }

    const { userName, email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (user) throw new Error("ya existe usuario");

        user = new User({ userName, email, password, tokenConfirm: nanoid() });
        await user.save();

        // enviar correo electrónico con la confirmación de la cuenta

        req.flash("mensajes", [
            { msg: "Revisa tu correo electrónico y valida cuenta" },
        ]);
        return res.redirect("/auth/login");
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/auth/register");
        // return res.json({ error: error.message });
    }
};

const confirmarCuenta = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ tokenConfirm: token });

        if (!user) throw new Error("No existe este usuario");

        user.cuentaConfirmada = true;
        user.tokenConfirm = null;

        await user.save();

        req.flash("mensajes", [
            { msg: "Cuenta verificada, puedes iniciar sesión." },
        ]);
        return res.redirect("/auth/login");
        // res.render("login");
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/auth/login");
        // return res.json({ error: error.message });
    }
};

const loginForm = (req, res) => {
    res.render("login", { mensajes: req.flash("mensajes") });
};

const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array());
        return res.redirect("/auth/login");
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("No existe este email");

        if (!user.cuentaConfirmada) throw new Error("Falta confirmar cuenta");

        if (!(await user.comparePassword(password)))
            throw new Error("Contraseña no correcta");

        // me está creando la sesión de usuario a través de passport
        req.login(user, function (err) {
            if (err) throw new Error("Error con al crear la sesión");
            return res.redirect("/");
        });
    } catch (error) {
        // console.log(error);
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/auth/login");
        // return res.send(error.message);
    }
};

const cerrarSesion = (req, res) => {
    req.logout();
    return res.redirect("/auth/login");
};

module.exports = {
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
    cerrarSesion,
};
