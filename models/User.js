const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Por favor rellena tu nombre"] },
    email: {
      type: String,
      match: [/.+\@.+\..+/, "Este correo no es válido"],
      required: [true, "Por favor rellena tu correo"],
    },
    password: { type: String, required: [true, "Por favor rellena tu password"] },
    birthday: Date,
    role: String,
    tokens: [],
    orderIds: [{ type: ObjectId, ref: "Order" }],
    wishList: [{ type: ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.tokens;
  delete user.password;
  delete user.__v;
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
