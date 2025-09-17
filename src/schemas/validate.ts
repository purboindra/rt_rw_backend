import type { RequestHandler } from "express";
import { ZodType } from "zod";

type Schemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export const validate = (schemas: Schemas): RequestHandler => {
  return async (req, _res, next) => {
    try {
      if (schemas.body) {
        const result = await schemas.body.safeParseAsync(req.body);
        if (!result.success) throw result.error;
        req.body = result.data;
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
