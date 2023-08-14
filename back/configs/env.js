module.exports = {
  port: 8080,
  //db_port: 25060,
  environment: "dev",
  db_name: "escrow_db",
  db_username: "postgres",
  db_password: "    ",
  db_host: "localhost",
  db_dialect: "postgres",

  paypal_client_id:
    "AZd5nIVCc7o5bvGZ5euCMc4QArpEnACWo-VNom7D-U1wgQp2H_6MXTza6b57UJPNqUBOuMpStTic8Y4P",
  paypal_client_secret:
    "EMwKMghJpQ9WC3vDE44iRSeKaW-D6j0ELiWwUaLTZMyVY8_kaTeNSDPl89J0zW1R0KMO9pTNHPqMan-R",
  paypal_success_url: "http://157.230.111.222:8080/api/v1/paypal/success/",
  paypal_cancel_url: "http://157.230.111.222:8080/api/v1/paypal/cancel",

  stripe_client_id:
    "sk_test_51NSrdYEujEihIXWgmTLzgr1uIu3PxtHG10BIsCctpzS0soKkVeZlirLHwXSkCVZ5za68uL0Q4f9L10y1DXdaE2FJ00DBgDy0yI",
};
