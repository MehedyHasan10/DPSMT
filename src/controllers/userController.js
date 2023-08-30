const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse, errorResponse } = require("./responseController");
const emailWithNodeMailer = require("../middlewares/email");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createJsonWebToken } = require("../middlewares/jsonWebToken");
const {
  jwtActivationKey,
  clientURL,
  jwtRestPasswordKey,
} = require("../secret");

const getUsersForAdmin = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const type = req.query.type || false;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
        { nidNo: { $regex: searchRegExp } },
      ],
    };
    const filterUserType = {
      isAdmin: { $ne: true },
      userType:
        type === "customer"
          ? "customer"
          : type === "fillingStationOwner"
          ? "fillingStationOwner"
          : type === "serviceCenterOwner"
          ? "serviceCenterOwner"
          : type === "deliveryman"
          ? "deliveryman"
          : "serviceman",
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
        { nidNo: { $regex: searchRegExp } },
      ],
    };

    const options = {
      password: 0,
    };

    const users = await User.find(type ? filterUserType : filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();

    if (users.length === 0) {
      throw createError(404, "Users Not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Users Returned...........",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPAge: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserByIdForAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const type = req.query.type || false;

    const filter = {
      _id: id,
    };

    const filterUserType = {
      _id: id,
      userType:
        type === "customer"
          ? "customer"
          : type === "fillingStationOwner"
          ? "fillingStationOwner"
          : type === "serviceCenterOwner"
          ? "serviceCenterOwner"
          : type === "deliveryman"
          ? "deliveryman"
          : "serviceman",
    };

    const user = await User.findOne(type ? filterUserType : filter, options);

    if (!user) {
      throw createError(404, "User not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User returned successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserByIdForAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const type = req.query.type || false;

    const filter = {
      _id: id,
    };

    const filterUserType = {
      _id: id,
      userType:
        type === "customer"
          ? "customer"
          : type === "fillingStationOwner"
          ? "fillingStationOwner"
          : type === "serviceCenterOwner"
          ? "serviceCenterOwner"
          : type === "deliveryman"
          ? "deliveryman"
          : "serviceman",
    };

    const user = await User.findById(type ? filterUserType : filter, options);

    if (!user) {
      throw createError(404, "user not found");
    }

    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
    return successResponse(res, {
      statusCode: 200,
      message: "user delete sucessfully",
    });
  } catch (error) {
    next(error);
  }
};

const userBannedByIdForAdmin = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await User.findById(userId);
    const updates = { isBanned: true };
    const UpdateOptions = { new: true, context: "query" }; // runValidation: true,

    const updateUser = await User.findByIdAndUpdate(
      userId,
      updates,
      UpdateOptions
    ).select("-password"); // .select("-password") use for deselected
    if (!updateUser) {
      throw new Error("User is not banned successfuly");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User is banned successfuly",
    });
  } catch (error) {
    next(error);
  }
};

const userUnbannedByIdForAdmin = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await User.findById(userId);
    const updates = { isBanned: false };
    const UpdateOptions = { new: true, context: "query" }; // runValidation: true,

    const updateUser = await User.findByIdAndUpdate(
      userId,
      updates,
      UpdateOptions
    ).select("-password"); // .select("-password") use for deselected
    if (!updateUser) {
      throw new Error("User is not unbanned successfuly");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User is unbanned successfuly",
    });
  } catch (error) {
    next(error);
  }
};

const userToOwnerShipByIdForAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;
    const type = req.query.type || false;

    const filter = {
      _id: id,
    };

    const filterUserType = {
      _id: id,
      userType:
        type === "fillingStationOwner"
          ? "fillingStationOwner"
          : "serviceCenterOwner",
    };
    const existingUser = await User.findById(type ? filterUserType : filter);

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (
      existingUser.userType === "fillingStationOwner" &&
      type === "serviceCenterOwner"
    ) {
      throw new Error(
        "Cannot change Filling Station Owner to Service Center Owner"
      );
    }

    const updates = {
      isFellingStationOwner: type === "fillingStationOwner",
      isServiceCenterOwner: type === "serviceCenterOwner",
    };
    const UpdateOptions = { new: true, context: "query" }; // runValidation: true,

    const updateUser = await User.findByIdAndUpdate(
      id,
      updates,
      UpdateOptions
    ).select("-password");

    if (!updateUser) {
      throw new Error("User ownership transformation was not successful");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User ownership transformation was successful",
    });
  } catch (error) {
    next(error);
  }
};

const userToUnOwnerShipByIdForAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const updates = {
      isFellingStationOwner: false,
      isServiceCenterOwner: false,
    };

    const updateOptions = { new: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw new Error("User ownership transformation was not successful");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User ownership reverted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateUserByIdForAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const type = req.query.type || false;

    const filter = {
      _id: id,
    };

    const filterUserType = {
      _id: id,
      userType:
        type === "customer"
          ? "customer"
          : type === "fillingStationOwner"
          ? "fillingStationOwner"
          : type === "serviceCenterOwner"
          ? "serviceCenterOwner"
          : type === "deliveryman"
          ? "deliveryman"
          : "serviceman",
    };

    const user = await User.findOne(type ? filterUserType : filter, options);

    if (!user) {
      throw createError(404, "User not found");
    }

    const UpdateOptions = { new: true, context: "query" }; // ! runValidation: true,
    let updates = {};

    for (let key in req.body) {
      if (["name"].includes(key)) {
        //! , 'password', 'address', 'phone','centerName','nidNo'
        updates[key] = req.body[key];
      } else if (["email"].includes(key)) {
        throw createError(400, "email can not be update");
      }
    }

    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 5) {
        throw new Error("File is too large, it must be less than 5 MB");
      }
      updates.image = image.buffer.toString("base64");
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      updates,
      UpdateOptions
    ).select("-password");
    if (!updateUser) {
      throw new Error("User with this ID does not exist");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User updated successfully",
      payload: updateUser,
    });
  } catch (error) {
    console.error(error);

    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { userType, name, email, password, phone, address, nidNo } = req.body;

    const image = req.file;

    if (!image) {
      throw new Error("Image file is required");
    }
    if (image.size > 1024 * 1024 * 2) {
      throw new Error("File is too large,It must be less than 2 mb");
    }

    const imageBufferString = image.buffer.toString("base64");

    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw new Error("User with this email already exists, please sign in");
    }
    //create jwt
    const token = createJsonWebToken(
      "15m",
      {
        userType,
        name,
        email,
        password,
        phone,
        address,
        image: imageBufferString,
        nidNo,
      },
      jwtActivationKey
    );

    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
        <h2>Hello ${name}</h2>
        <p>Please click here to
         <a href="${clientURL}/api/users/activate/${token}" target="_blank">
        activate your account</a> 
        </p>  `,
    };

    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send verification email"));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} to complete your registration`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const activateAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    console.log("Token Length:", token.length);
    if (!token) {
      throw createError(404, "Token not found");
    }

    const decoded = jwt.verify(token, jwtActivationKey);
    console.log(decoded);

    await User.create(decoded);

    return successResponse(res, {
      statusCode: 201,
      message: "User was registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const id = req.params.id;
    const user = await User.findById(id);

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(400, "Old Password did not match");
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      { password: newPassword },
      { new: true }
    ).select("-password");

    if (!updateUser) {
      throw new Error("Password did not update");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Update password successfully",
      payload: { updateUser },
    });
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw createError(404, "Email is incorrect");
    }

    const token = createJsonWebToken(
      "15m", // expiresIn
      { email },
      jwtRestPasswordKey
    );

    const emailData = {
      email,
      subject: "Reset Password Email",
      html: `
        <h2>Hello ${user.name}</h2>
        <p>Please click here to
         <a href="${clientURL}/api/users/reset-password/${token}" target="_blank">
        reset your password</a> 
        </p>  `,
    };

    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send reset password email"));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} to reset password`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, jwtRestPasswordKey);
    if (!decoded) {
      throw createError(400, "Invalid token");
    }

    const updateUser = await User.findOneAndUpdate(
      { email: decoded.email },
      { password: password },
      { new: true }
    ).select("-password");

    if (!updateUser) {
      throw new Error("Password did not reset");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Reset password successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsersForAdmin,
  getUserByIdForAdmin,
  deleteUserByIdForAdmin,
  updateUserByIdForAdmin,
  userBannedByIdForAdmin,
  userUnbannedByIdForAdmin,
  userToOwnerShipByIdForAdmin,
  userToUnOwnerShipByIdForAdmin,
  processRegister,
  activateAccount,
  updatePassword,
  forgetPassword,
  resetPassword,
};
