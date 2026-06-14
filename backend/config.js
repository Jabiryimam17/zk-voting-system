const national_id_host =
  process.env.NATIONAL_ID_HOST || "http://localhost:5000";
const frontend_host = process.env.FRONTEND_HOST || "http://localhost:3000";

module.exports = {
  national_id_host,
  frontend_host,
};
