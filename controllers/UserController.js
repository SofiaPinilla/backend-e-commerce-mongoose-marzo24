const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");
require("dotenv").config();
const { JWT_SECRET,API_URL } = process.env;

const UserController = {
  async create(req, res, next) {
    try {
      if (!req.body.password) {
        return res.status(400).send({ message: "Rellena la contraseña" });
      }
      const password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({ ...req.body, password, role: "user" });
      res.status(201).send(user);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  async login(req, res) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return res.status(400).send("correo o contraseña incorrectos");
      }
      const isMatch = bcrypt.compareSync(req.body.password, user.password);
      //   if(isMatch == false)
      if (!isMatch) {
        return res.status(400).send("correo o contraseña incorrectos");
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.send({ message: "Bienvenid@ " + user.name, token });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  async logout(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.send({ message: "Desconectado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Hubo un problema al intentar desconectar al usuario",
      });
    }
  },
  async getInfo(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .populate({
          path: "orderIds",
          populate: {
            path: "productIds",
          },
        })
        .populate("wishList");
      res.send(user);
    } catch (error) {
      console.error(error);
    }
  },
  async recoverPassword(req, res) {
    try {
      const recoverToken = jwt.sign({ email: req.params.email }, JWT_SECRET, {
        expiresIn: "48h",
      });
      const url = API_URL+"/users/resetPassword/" + recoverToken;
      await transporter.sendMail({
        to: req.params.email,
        subject: "Recuperar contraseña",
        html: `<h3> Recuperar contraseña </h3>
  <a href="${url}">Recuperar contraseña</a>
  El enlace expirará en 48 horas
  `,
      });
      res.send({
        message: "Un correo de recuperación se envio a tu dirección de correo",
      });
    } catch (error) {
      console.error(error);
    }
  },
  async resetPassword(req, res) {
    try {
      const recoverToken = req.params.recoverToken;
      const payload = jwt.verify(recoverToken, JWT_SECRET);
      const password = bcrypt.hashSync(req.body.password,10)
      await User.findOneAndUpdate(
        { email: payload.email },
        { password }
      );
      res.send({ message: "contraseña cambiada con éxito" });
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = UserController;
