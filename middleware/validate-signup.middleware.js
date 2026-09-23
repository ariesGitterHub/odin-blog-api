const { check } = require("express-validator");
const passwordRules = require("../config/password-rules.config.js");

const emailValidator = check("email")
  .trim()
  .notEmpty()
  .withMessage("Email cannot be empty")
  .isEmail()
  .withMessage("Invalid email format");

const passwordValidator = check("password").custom((value) => {
  const hasMinLength = value.length >= passwordRules.minLength;
  const hasLower = /[a-z]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);

  const hasSpecial = new RegExp("[" + passwordRules.specialChars + "]").test(
    value,
  );

  if (!(hasMinLength && hasLower && hasUpper && hasNumber && hasSpecial)) {
    throw new Error("Weak password, see password requirements.");
  }

  return true;
});

module.exports = {
  validateSignUp: [emailValidator, passwordValidator],
};
