require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 3334;
const clientURL = process.env.CLIENT_URL || "";
const mongodbURL =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/DPSMT";
const smtpUserName = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "Siam_Samir_DPSMT";
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "Logging_Access_Is_Here";
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || "Logging_Refresh_Is_Here";
module.exports = {
  serverPort,
  mongodbURL,
  smtpUserName,
  smtpPassword,
  jwtActivationKey,
  jwtAccessKey,
  jwtRefreshKey,
  clientURL,
};
