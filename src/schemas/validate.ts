import type { RequestHandler } from "express";
import { ZodTypeAny } from "zod";

type Schemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export const validate = (schemas: Schemas): RequestHandler => {
  return async (req, _res, next) => {
    try {
      if (schemas.body) {
        const result = await schemas.body.safeParseAsync(req.body);
        if (!result.success) throw result.error;
        req.body = result.data; // sanitized
      }
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) throw result.error;
        req.query = result.data;
      }
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) throw result.error;
        req.params = result.data;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
