import { recaptchaErrorResponse, verifyRecaptchaToken } from "../services/recaptcha.service.js";

export const requireRecaptcha = (getAction) => async (req, res, next) => {
  const expectedAction = getAction(req);

  const result = await verifyRecaptchaToken({
    token: req.body?.captchaToken,
    remoteIp: req.ip,
    expectedAction,
    route: `${req.method} ${req.baseUrl}${req.path}`,
  });

  if (!result.ok) return recaptchaErrorResponse(res, result.reason);
  return next();
};

export default requireRecaptcha;
