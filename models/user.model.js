import { mongoose } from "../utility/db.js";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: false,
    trim: true,
    minLength: 1,
    maxLength: 32,
  },
  surname: {
    type: String,
    required: false,
    trim: true,
    minLength: 1,
    maxLength: 32,
  },
  password: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 128,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 128,
    unique: true,
    match: /.+\@.+\..+/,
  },
  role: {
    type: String,
    required: false,
    trim: true,
    minLength: 1,
    maxLength: 12,
    default: "user",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.validPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("User", userSchema);

function makeUser(email, password) {
  let role = "user";
  if (email.indexOf("admin") >= 0) role = "admin"; // tylko do celów testowych !!!
  return new User({
    _id: new mongoose.Types.ObjectId(),
    email: email,
    password: password,
    role: role,
  });
}

export { User, makeUser };
