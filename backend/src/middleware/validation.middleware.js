import validator from 'validator';

export const validateContactInquiry = (req, res, next) => {
    const { name, email, purpose, message, projectType, budget } = req.body;

    // Validate name
    if (!name || typeof name !== 'string' || name.length === 0 || name.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Name is required and must be between 1-100 characters"
        });
    }

    // Validate email
    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Valid email address is required"
        });
    }

    // Validate message
    if (!message || typeof message !== 'string' || message.length < 10 || message.length > 5000) {
        return res.status(400).json({
            success: false,
            message: "Message must be between 10-5000 characters"
        });
    }

    // Validate purpose
    if (!purpose || !['say_hi', 'work'].includes(purpose)) {
        return res.status(400).json({
            success: false,
            message: "Purpose must be either 'say_hi' or 'work'"
        });
    }

    // If work, validate project details
    if (purpose === 'work') {
        const validProjectTypes = ['frontend', 'backend', 'fullstack', 'mobile_app', 'cms', 'ci_cd', 'other'];
        const validBudgets = ['under_1k', '1k_5k', '5k_10k', '10k_plus', 'not_sure'];

        if (!projectType || !validProjectTypes.includes(projectType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project type selected"
            });
        }

        if (!budget || !validBudgets.includes(budget)) {
            return res.status(400).json({
                success: false,
                message: "Invalid budget selected"
            });
        }
    }

    // Validate optional fields
    if (req.body.organization && typeof req.body.organization === 'string' && req.body.organization.length > 200) {
        return res.status(400).json({
            success: false,
            message: "Organization name must be less than 200 characters"
        });
    }

    if (req.body.role && typeof req.body.role === 'string' && req.body.role.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Role must be less than 100 characters"
        });
    }

    next();
};