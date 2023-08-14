const express = require("express");
const bodyParser = require("body-parser");
const env = require("./configs/env");
const auth = require("./apis/auth/auth.route");
const wallet = require("./apis/wallet/wallet.route");
const listing = require("./apis/listing/listing.route");
const project = require("./apis/project/project.route");
const settings = require("./apis/settings/settings.route");
const admin = require("./apis/admin-auth/admin.route");
const userManager = require("./apis/user-manager/user_manager.route");
const listingsManager = require("./apis/listing-management/listing_management.route");
const bidsManager = require("./apis/bids-management/bids_management.route");
const projectsManager = require("./apis/project-management/project_management.route");
const disputeManager = require("./apis/dispute-management/dispute_management.route");
const stripe = require("./apis/stripe/stripe.route");
const paypal = require("./apis/paypal/paypal.route");

const app = express();
app.use(express.static("public"));
// app.use(express.bodyParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, X-Requested-With, Range, Content-Type"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

auth.authRoutes(app);
wallet.walletRoutes(app);
listing.listingRoutes(app);
project.projectRoutes(app);
settings.settingsRoutes(app);
admin.adminRoutes(app);
userManager.userManagerRoutes(app);
listingsManager.listingsManagerRoutes(app);
bidsManager.bidsManagerRoutes(app);
projectsManager.projectsManagerRoutes(app);
disputeManager.disputesManagerRoutes(app);
stripe.stripeRoutes(app);
paypal.paypalRoutes(app);

app.listen(env.port, function () {
  console.log("app listening at port %s", env.port);
});
