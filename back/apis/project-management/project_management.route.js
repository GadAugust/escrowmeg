const {
  projectsManagerController,
} = require("./project_management.controller");
const { getRoute } = require("../../libs/middlewares/get_route");
const { jwtAuthentication } = require("../../libs/middlewares/jwt_auth");
const { uploadImage } = require("../../libs/middlewares/upload_image");
require("express-group-routes");

exports.projectsManagerRoutes = function (app) {
  app.group("/api/v1/projects_manager/", (router) => {
    router.post(
      "/fetch-projects",
      [getRoute],
      projectsManagerController.fetchProjects
    );
    router.post(
      "/get-project-details",
      [getRoute],
      projectsManagerController.getProjectDetails
    );
  });
};
