import User from "../model/User.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { generateApiKey } from "../utils/generateApiKeys.js";
import APIKeys from "../model/APIKeys.model.js";

const registerUser = async (req, res) => {
  // get data
  // validate
  // check if user already exits
  // create a user in db
  // create a verification token
  // save token in db
  // send token as email to user
  // send success status to user


  const { name, email, password } = req.body;



  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "user already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({
        message: "user not registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token;

    await user.save();

    //send email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "Verify your email", // Subject line
      text: `Please click on the following link:
        ${process.env.BASE_URL}/api/v1/users/verify/${token}
        `,
    };

    await transporter.sendMail(mailOption);

    res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered",
      error,
      success: false,
    });
  }
};

const verifyUser = async (req, res) => {
  //get token from url
  //validate
  // find user based on token
  //if not
  // set isVerified field to true
  // remove verification token
  // save
  //return response

  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  try {
    console.log("verification started");

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      message: "User verified successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not verified",
      error,
      success: false,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All field are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);


    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },

      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "user not login",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in get me", error);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {});
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout user", error);
  }
};

const forgotPassword = async (req, res) => {
  let user;

  try {
    // 1. Get email from request body
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // 2. Find user based on email
    user = await User.findOne({ email });
    if (!user) {
      // Security: Don't reveal if user exists
      return res.status(200).json({
        message:
          "If an account with this email exists, a password reset link has been sent",
      });
    }

    // 3. Generate reset token and set expiry (10 minutes)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 4. Save hashed token and expiry to user document
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = resetTokenExpiry;

    await user.save({ validateBeforeSave: false });

    // 5. Create reset URL (consider using frontend URL)
    const resetUrl = `${
      process.env.BASE_URL
    }/api/v1/users/reset-password/${resetToken}`;

    // 6. Configure email transport
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    // 7. Create email content
    const mailOptions = {
      to: user.email,
      from:
        process.env.MAILTRAP_SENDEREMAIL ||
        '"Your App Name" <noreply@example.com>',
      subject: "Password Reset Request",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>You requested a password reset for your account. Click the button below to proceed:</p>
            <a href="${resetUrl}" 
                style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; 
                        color: white; text-decoration: none; border-radius: 4px; margin: 15px 0;">
                Reset Password
            </a>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr>
            <p style="font-size: 12px; color: #777;">
                Can't click the button? Copy and paste this link into your browser:<br>
                ${resetUrl}
            </p>
            </div>
        `,
      text: `You requested a password reset. Use this link: ${resetUrl} (expires in 10 minutes)`,
    };

    // 8. Send email
    await transporter.sendMail(mailOptions);

    // 9. Respond to client
    res.status(200).json({
      status: "success",
      message: "Password reset link sent to email",
    });
  } catch (error) {
    // 10. Clean up on error
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false }).catch(console.error);
    }

    console.error("Forgot password error:", error);
    res.status(500).json({
      error:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    // 1. Collect token from params and passwords from body
    const { token } = req.params;
    const { password, confPassword } = req.body;

    // 2. Validate inputs
    if (!password || !confPassword) {
      return res
        .status(400)
        .json({ error: "Both password and confirmation are required" });
    }

    if (password !== confPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    // 3. Hash the token to match what's stored in DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 4. Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Password reset token is invalid or has expired",
      });
    }

    // 5. Update user's password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    // 6. Return success response
    res.status(200).json({
      status: "success",
      message: "Password has been successfully updated",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      error:
        "An error occurred while resetting your password. Please try again.",
    });
  }
};

const generateNewApiKey = async(req, res) => {
  try {
    const userId = req.user.id; // Populated from auth middleware
    const { name, permissions, expiresAt } = req.body;

    
    if (!name) {
      return res.status(400).json({ message: "API key name is required" });
    }

    const apiKey = generateApiKey();

    const newKey = await APIKeys.create({
      userId,
      key: apiKey,
      name,
      permissions,
      expiresAt,
    });

    res.status(201).json({
      message: "API key generated successfully",
      apiKey: newKey.key,
      id: newKey._id,
      expiresAt: newKey.expiresAt,
      permissions: newKey.permissions,
    });

  } catch (error) {
    console.error("API key generation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export {
  registerUser,
  verifyUser,
  login,
  getMe,
  logoutUser,
  forgotPassword,
  resetPassword,
  generateNewApiKey
};
