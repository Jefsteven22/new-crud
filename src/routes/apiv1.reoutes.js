import userRoutes from "../modules/users/user.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../swagger.json" assert { type: "json" };

export const apiv1Routes = (app) => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
};
