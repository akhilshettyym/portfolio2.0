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
                role: "ADMIN"
            });
            console.log("Main Admin account initialized successfully.");
        } else {
            if (
                existingAdmin.name !== nameFromEnv ||
                existingAdmin.email !== emailFromEnv ||
                passwordFromEnv
            ) {
                existingAdmin.name = nameFromEnv;
                existingAdmin.email = emailFromEnv;
                existingAdmin.password = passwordFromEnv;

                await existingAdmin.save();
                console.log("Admin credentials synchronized with current .env file.");
            }
        }
    } catch (error) {
        console.error("Error creating/updating admin setup:", error);
    }
};