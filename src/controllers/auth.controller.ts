import httpStatusCodes from "http-status-codes";
import { IController } from "../types/IController";
import { formatError } from "../utils/formatError";
import { forgotPasswordSchema, loginSchema, UserSchema } from "../../src/validators/auth.validator";
import { createUserService, forgotpasswordService, loginUserService, refreshTokenService } from "../services/auth.serivce";


// ----------------------------- Auth Controller -----------------------------
const createUpdateUser: IController = async (req, res) => {

  try {
    const id = parseInt(req.params.id);
    const loggedInUser = req.user?.userId;

    const { error, value } = UserSchema.validate(req.body, { abortEarly: false, });

    if (error) {
      return res.sendRes(httpStatusCodes.BAD_REQUEST, "Bad Request", {
        error: error.details,
      });
    }
    const response = await createUserService(value);

    if (response.success) {
      return res.sendRes(httpStatusCodes.OK, response.message, response.data);
    } else {
      return res.sendRes(httpStatusCodes.BAD_REQUEST, response.message, response.error);
    }

  } catch (error) {
    let formattedError = formatError(error);
    return res.sendRes(httpStatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", formattedError);
  }
};

const loginUser: IController = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.sendRes(httpStatusCodes.BAD_REQUEST, "Bad Request", {
        error: error.details,
      });
    }

    const loginResponse = await loginUserService(value.email, value.password);

    if (loginResponse.success) {
      return res.sendRes(
        httpStatusCodes.OK,
        loginResponse.message,
        loginResponse
      );
    } else {
      return res.sendRes(
        httpStatusCodes.BAD_REQUEST,
        loginResponse.message,
        loginResponse.error
      );
    }
  } catch (err) {
    let formattedError = formatError(err);
    return res.sendRes(500, "Internal Server Error", formattedError);
  }
};

const forgotPassword: IController = async (req, res) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.sendRes(httpStatusCodes.BAD_REQUEST, "Bad Request", {
        error: error.message,
      });
    }

    const forgotPasswordResponse = await forgotpasswordService(value.email);

    if (forgotPasswordResponse.success === true) {
      return res.sendRes(
        httpStatusCodes.OK,
        "Email Sent Successfully",
        forgotPasswordResponse.message
      );
    } else {
      return res.sendRes(
        httpStatusCodes.BAD_REQUEST,
        forgotPasswordResponse.message,
        forgotPasswordResponse.error
      );
    }
  } catch (err) {
    let formattedError = formatError(err);
    return res.sendRes(500, "Internal Server Error", formattedError);
  }
};

const refreshToken: IController = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(httpStatusCodes.BAD_REQUEST)
        .json({ msg: "Token not found" });
    }

    const refreshTokenResponse = await refreshTokenService(refreshToken);

    if (refreshTokenResponse.success === true) {
      return res.sendRes(httpStatusCodes.OK, refreshTokenResponse.message, {
        data: refreshTokenResponse.data,
      });
    } else {
      return res.sendRes(
        httpStatusCodes.BAD_REQUEST,
        refreshTokenResponse.message,
        refreshTokenResponse.error
      );
    }
  } catch (err) {
    let formattedError = formatError(err);
    return res.sendRes(500, "Internal Server Error", formattedError);
  }
};

export { createUpdateUser, loginUser, forgotPassword, refreshToken };