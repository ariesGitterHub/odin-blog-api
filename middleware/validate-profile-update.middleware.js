const { check } = require("express-validator");
const passwordRules = require("../config/password-rules.config.js");

const emailValidator = check("email")
  .optional() // REMINDER - this makes the check conditional, so it is only used if something is typed into the email field
  .trim()
  // .notEmpty() // REMINDER - this cannot exits along side optional(), this requires that the field have a typed string
  // .withMessage("Email cannot be empty")
  .isEmail()
  .withMessage("Invalid email format");

const passwordValidator = check("password")
  .optional() // REMINDER - same scenario as above
  .custom((value) => {
    const hasMinLength = value.length >= passwordRules.minLength;
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);

    const hasSpecial = new RegExp("[" + passwordRules.specialChars + "]").test(
      value,
    );

    if (!(hasMinLength && hasLower && hasUpper && hasNumber && hasSpecial)) {
      throw new Error("Weak password, see requirements.");
    }

    return true;
  });

module.exports = {
  validateProfileUpdate: [emailValidator, passwordValidator],
};
