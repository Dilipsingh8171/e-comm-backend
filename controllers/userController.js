import { userModal } from "../modals/userModal.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

//register-controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //validation

    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please Provide all Fields",
      });
    }

    //check existing user
    const existinguser = await userModal.findOne({ email });
    if (existinguser) {
      return res.status(400).send({
        success: false,
        massage: "User Already Registered",
      });
    }

    const user = await userModal.create({
      name,
      email,
      password,
    });

    res.status(201).send({
      message: "Register Successfully Please Login",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in api register",
      error,
    });
  }
};

//login controller

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please Enter Email or Password",
      });
    }

    const user = await userModal.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    //check pass
    const isMatch = await user.comparePassword(password);

    //Validation password
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    //token
    const token = user.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Login SuccessFully",
        token,
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in login api",
      error,
    });
  }
};

//get user profile

export const getUserProfileController = async (req, res) => {
  try {
    const user = await userModal.findById(req.user._id);
    res.status(200).send({
      success: true,
      message: "User Profile Fetched Success ",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error i profile Api",
      error,
    });
  }
};

//logout controller

export const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Logout Successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error in logout api",
      error,
    });
  }
};

// updateprofile
export const updateProfilecontroller = async (req, res) => {
  try {
    const user = await userModal.findById(req.user._id);
    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    //save user

    await user.save();
    res.status(200).send({
      success: true,
      message: "Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error in updatprofile api",
      error,
    });
  }
};

//update-password

export const updatePasswordController = async (req, res) => {
  try {
    const user = await userModal.findById(req.user._id);

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide old or new Password",
      });
    }
    //check old passsword

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
      return res
        .status(400)
        .send({ success: false, message: "InValid Password" });

    user.password = newPassword;
    await user.save();
    return res.status(200).send({
      success: true,
      message: "Password update-Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error in updatpassword api",
      error,
    });
  }
};

//updte profilepic

export const updateprofilePicController = async (req, res) => {
  try {
    const user = await userModal.findById(req.user._id);
    // file get from client photo
    const file = getDataUri(req.file);
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    //update

    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    //save

    await user.save();

    res.status(200).send({
      success: true,
      message: "profile picture updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error in updatprofilepic api",
      error,
    });
  }
};
