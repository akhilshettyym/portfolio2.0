import AdminModel from "../models/adminModel.js";

export const createAdmin = async () => {
  try {
    const nameFromEnv = process.env.ADMIN_NAME;
    const emailFromEnv = process.env.ADMIN_EMAIL?.toLowerCase();
    const passwordFromEnv = process.env.ADMIN_PASSWORD;

    if (!nameFromEnv || !emailFromEnv || !passwordFromEnv) {
      console.log("Admin startup credentials missing in environment variables.");
      return;
    }

    const existingAdmin = await AdminModel.findOne({ role: "ADMIN" });

    if (!existingAdmin) {
      await AdminModel.create({
        name: nameFromEnv,
        email: emailFromEnv,
        password: passwordFromEnv,
        role: "ADMIN",
      });
      console.log("Main Admin account initialized successfully.");
    } else {
      const isNameDifferent = existingAdmin.name !== nameFromEnv;
      const isEmailDifferent = existingAdmin.email !== emailFromEnv;

      const isPasswordDifferent = existingAdmin.password !== passwordFromEnv;

      if (isNameDifferent || isEmailDifferent || isPasswordDifferent) {
        existingAdmin.name = nameFromEnv;
        existingAdmin.email = emailFromEnv;

        if (isPasswordDifferent) {
          existingAdmin.password = passwordFromEnv;
        }

        await existingAdmin.save();
        console.log("Main Admin account updated to match environment variables.");
      }
    }
  } catch (error) {
    console.error("Error creating/updating admin setup:", error);
  }
};
