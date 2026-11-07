const { validationResult } = require("express-validator");

const {
  formatValidationErrors,
} = require("../utils/format-validation-errors.utils.js");

const { verifyLogin, getUserById } = require("../services/auth.service.js");

const {
  createUser,
  checkIfEmailExistsForSignUp,
  updateLastLoginAt,
} = require("../services/user.service.js");

const jwt = require("jsonwebtoken");

const allowedRoles = ["ADMIN", "WRITER"];

// NOTE - Because I'm using Express 5, I don't need the try/catch merely to forward rejected async operations to your error middleware. However, keeping the try/catch for now is fine.

async function signUp(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = formatValidationErrors(validationErrors);
      return res.status(400).json({
        errors,
      });
    }

    const { first_name, last_name, email, password } = req.body;

    // NOTE - checking the frontend first is useful for giving the frontend a nice, dedicated 409 response, but the database constraint remains the real protection.
    const existingUser = await checkIfEmailExistsForSignUp(
      email.trim().toLowerCase(),
    );

    if (existingUser) {
      return res.status(409).json({
        error: {
          message: "An account with that email already exists.",
        },
      });
    }

    const user = await createUser({
      firstName: first_name,
      lastName: last_name,
      email: email.trim().toLowerCase(),
      password,
    });

    return res.status(201).json({
      user,
    });
  } catch (err) {
    next(err);
  }
}

// D.R.Y. helper function
function issueAccessToken(res, user) {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600000,
  });
}

// NOTE - below is the base user login for "blog-reader"
async function logIn(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = formatValidationErrors(validationErrors);

      return res.status(400).json({
        errors,
      });
    }

    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await verifyLogin(normalizedEmail, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Adds lastLoginAt to users in db
    // if (user) {
    //   const userId = user.id;
    // await updateLastLoginAt(userId);
    await updateLastLoginAt(user.id);
    // }

    // NOTE - a big note too, because "role" is in the JWT, changing a user's role in the database won't automatically update an already-issued token. E.g.:
    // 1. A user logs in as ADMIN.
    // 2. An admin changes that user's role to USER.
    // 3. The existing JWT still contains ADMIN.
    // 4. Until that JWT expires, middleware that trusts only its role claim could continue granting admin access.
    // The one-hour expiration limits this exposure, but it doesn't eliminate it.

    // Now using helper function issueAccessToken()
    // const accessToken = jwt.sign(
    //   {
    //     userId: user.id,
    //     role: user.role,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "1h",
    //   },
    // );

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 3600000,
    // });

    issueAccessToken(res, user);

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (err) {
    // Don't bypass my centralized error middleware by use the two lines below
    // console.error("Login controller error:", err);
    // return res.status(500).json({ message: "Internal server error." });
    next(err);
  }
}

async function writerLogIn(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = formatValidationErrors(validationErrors);

      return res.status(400).json({
        errors,
      });
    }

    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await verifyLogin(normalizedEmail, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // NOTE - below is what separates the logIn above from the bespoke writerLogIn used on Blog Writer

    // const allowedRoles = ["ADMIN", "WRITER"]; // Moved to top
    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    // Adds lastLoginAt to users in db
    if (user) {
      const userId = user.id;
      await updateLastLoginAt(userId);
    }

    // Now using helper function issueAccessToken()
    // const accessToken = jwt.sign(
    //   {
    //     userId: user.id,
    //     role: user.role,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "1h",
    //   },
    // );

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 3600000,
    // });

    issueAccessToken(res, user);

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (err) {
    // Don't bypass my centralized error middleware by use the two lines below
    // console.error("Login controller error:", err);
    // return res.status(500).json({ message: "Internal server error." });
    next(err);
  }
}

// NOTE - the cookie-clearing options need to match the original cookie's relevant attributes, particularly its path and domain if you set either when creating it.My current cookie doesn't specify either, so the default path behavior should be consistent.Also, clearing the cookie doesn't invalidate the JWT itself. It simply removes the browser's copy. This might be okay, given the one-hour token expiration...

async function logOut(req, res, next) {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out.",
    });
  } catch (err) {
    next(err);
  }
}
// Note this code below was not returning null for non-auth users. It needs to though or this controller that is meant to check if a current user is authenticated via /api/auth/me will crash the app. Null is a needed response.
// async function getCurrentUser(req, res,next) {
//   try {
//     const user = await getUserById(req.user.userId);

//     if(!user) {
//       return res.sendStatus(401);
//     }

//     return res.status(200).json({
//       user
//     })
//   } catch (err) {
//     next(err)
//   }
// }

// This tells me whether a user is currently logged in... so user...or null...
async function getCurrentUser(req, res, next) {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(200).json({ user: null });
    }

    let authData;

    try {
      // authData = jwt.verify(token, process.env.JWT_SECRET);
      // The jwt.sign() currently uses the default HMAC SHA-256 algorithm, so this makes my verification expectations explicit.
      authData = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
    } catch (err) {
      if (
        err.name === "TokenExpiredError" ||
        err.name === "JsonWebTokenError"
      ) {
        return res.status(200).json({ user: null });
      }

      throw err;
    }

    const user = await getUserById(authData.userId);

    if (!user) {
      return res.status(200).json({ user: null });
    }

    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signUp,
  logIn,
  writerLogIn,
  logOut,
  getCurrentUser,
};
