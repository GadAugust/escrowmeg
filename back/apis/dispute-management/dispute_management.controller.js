const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { disputesManagerModel } = require("./dispute_management.model");
const Utils = require("../../configs/utils");
const config = require("./../../configs/auth");
const Mailer = require("./../../libs/emails/mailchimp");
// const { helpers } = require("../../libs/utilities/helpers");

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.disputesManagerController = {
  fetchDisputes: (req, res) => {
    disputesManagerModel.fetchDisputes().then(
      (resp) => {
        if (resp.length > 0) {
          console.log(resp);
          let data = resp;
          const groupedData = data.reduce((result, obj) => {
            const project = obj.dataValues.project_id;
            if (!result[project]) {
              result[project] = [];
            }
            result[project].push(obj.dataValues);
            return result;
          }, {});

          // console.log(groupedData);
          res.status(successful.ok).send({ data: groupedData });
        } else {
          res.status(successful.no_content).send({ data: [] });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
};
