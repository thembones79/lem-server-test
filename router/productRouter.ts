import { Express } from "express";
import { ProductController } from "../controllers";
import { requireAuth } from "../services/requireAuth";

export const productRouter = function (app: Express) {
  app.post("/api/product", requireAuth, ProductController.addProduct);
  app.post("/api/product/link", requireAuth, ProductController.addLink);
  app.post(
    "/api/product/redirection",
    requireAuth,
    ProductController.addRedirection
  );
  app.put(
    "/api/product/redirection/:_id",
    requireAuth,
    ProductController.updateManyProdsWithOneRedir
  );
  app.put("/api/product", requireAuth, ProductController.changeProduct);
  app.get("/api/product", requireAuth, ProductController.getProducts);
  app.get("/api/product/:_id", requireAuth, ProductController.getProduct);
  app.delete("/api/product/:_id", requireAuth, ProductController.deleteProduct);
};
