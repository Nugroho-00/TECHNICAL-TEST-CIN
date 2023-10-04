require("dotenv").config();
const { SECRET_KEY } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const joi = require("joi");
const authModel = require("../models/authModels");
const { responseStandard } = require("../helpers/response");

const registerAccount = async (req, res) => {
  try {
    const schema = joi.object({
      name: joi
        .string()
        .pattern(/^[a-z ,.'-]+$/i)
        .required()
        .messages({
          "string.base": "Name should be a type of 'text'",
          "string.empty": "Name cannot be an empty field",
          "any.required": "Name is a required field",
          "string.pattern.base": "Name cannot contain number",
        }),
      email: joi.string().email({ minDomainSegments: 2 }).required().messages({
        "string.email": "Wrong Email format!!",
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is a required field",
      }),
      password: joi
        .string()
        .required()
        .min(8)
        .pattern(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%^*#?&])[A-Za-z\d@$!%^*#?&]{8,}$/
        )
        .messages({
          "string.empty": "Password cannot be an empty field",
          "string.min": "Password should have a minimum length of {#limit}",
          "any.required": "Password is a required field",
          "string.pattern.base":
            "Password must contain letter, number and special character",
        }),
    });
    const { value, error } = schema.validate(req.body);
    if (error) {
      return responseStandard(
        res,
        "Error!!",
        { error: error.message },
        400,
        false
      );
    }
    const isExist = await authModel.checkEmailModel(value.email);
    if (isExist.length) {
      return responseStandard(res, "Email already exist!!", {}, 400, false);
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(value.password, salt);
    const users = {
      name: value.name,
      email: value.email,
      password: hashPassword,
    };
    await authModel.createAccountModel(users);
    return responseStandard(res, "Success registered account", {}, 200, true);
  } catch (error) {
    return responseStandard(
      res,
      "Internal server Error!",
      { error: error.message },
      500,
      false
    );
  }
};

const loginAccount = async (req, res) => {
  try {
    const schema = joi.object({
      email: joi.string().email({ minDomainSegments: 2 }).required().messages({
        "string.email": "Wrong Email format!!",
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is a required field",
      }),
      password: joi
        .string()
        .required()
        .min(8)
        .messages({
          "string.empty": "Password cannot be an empty field",
          "string.min": "Password should have a minimum length of {#limit}",
          "any.required": "Password is a required field",
        }),
    });
    const { value, error } = schema.validate(req.body);
    if (error) {
      return responseStandard(
        res,
        "Error!!",
        { error: error.message },
        400,
        false
      );
    }
    const results = await authModel.userByEmailModel(value.email);
    if (results.length) {
      const hashed = results[0].password;
      const validUser = await bcrypt.compare(value.password, hashed);
      if (!validUser) {
        return responseStandard(res, "Wrong password!!!", {}, 400, false);
      } else {
        const { id, name } = results[0];
        const payload = { id, name };
        const token = jwt.sign(payload, SECRET_KEY);
        return responseStandard(
          res,
          "Login successfully ",
          { token },
          200,
          true
        );
      }
    } else {
      return responseStandard(
        res,
        "User doesn't exist! or Wrong email !!",
        {},
        400,
        false
      );
    }
  } catch (error) {
    return responseStandard(
      res,
      "Internal server Error!",
      { error: error.message },
      500,
      false
    );
  }
};

const getProfileInfo = async (req, res) => {
    try {
      const { id } = req.user;
      const users = await authModel.getAccountInfo(id);
      if (users.length) {
        return responseStandard(res, "User Profile Info", { users }, 200, true);
      } else {
        return responseStandard(res, "User profile not found!!", {}, 404, false);
      }
    } catch (error) {
      return responseStandard(res, error, {}, 500, false);
    }
  };

module.exports = {
  registerAccount,
  loginAccount,
  getProfileInfo
};