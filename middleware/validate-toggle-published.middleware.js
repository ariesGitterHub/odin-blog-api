const { body } = require("express-validator");

const validateTogglePublished = [
  body("published")
    .isBoolean({ strict: true })
    .withMessage("Published must be a boolean."),
];

module.exports = {
  validateTogglePublished,
};
