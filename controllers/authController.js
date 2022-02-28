const User = require("../models/User");
const { nanoid } = require("nanoid");

const registerForm = (req, res) => {
    res.render("register");
};

const registerUser = async (req, res) => {
    console.log(req.body);
    const { userName, email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (user) throw new Error("ya existe usuario");

        user = new User({ userName, email, password, tokenConfirm: nanoid() });
        await user.save();

        // enviar correo electrónico con la confirmación de la cuenta

        res.redirect("/auth/login");
        // res.render("login");
    } catch (error) {
        res.json({ error: error.message });
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

        res.redirect("/auth/login");
        // res.render("login");
    } catch (error) {
        res.json({ error: error.message });
    }
};

const loginForm = (req, res) => {
    res.render("login");
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("No existe este email");

        if (!user.cuentaConfirmada) throw new Error("Falta confirmar cuenta");

        if (!(await user.comparePassword(password)))
            throw new Error("Contraseña no correcta");

        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
};

module.exports = {
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
};
