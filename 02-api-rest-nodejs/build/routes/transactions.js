"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/transactions.ts
var transactions_exports = {};
__export(transactions_exports, {
  transactionsRoutes: () => transactionsRoutes
});
module.exports = __toCommonJS(transactions_exports);

// src/database.ts
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  DATABASE_URL: import_zod.z.string(),
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("production"),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("\u274C Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/database.ts
var config2 = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./database/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/routes/transactions.ts
var import_zod2 = require("zod");
var import_crypto = require("crypto");

// src/middlewares/check-session-id-exists.ts
async function checkSessionIdExists(request, response) {
  const sessionId = request.cookies.sessionId;
  if (!sessionId) {
    response.status(401).send();
  }
}

// src/routes/transactions.ts
async function transactionsRoutes(app) {
  const preHandlers = { preHandler: [checkSessionIdExists] };
  app.post("/", async (request, response) => {
    const createTransactionBodySchema = import_zod2.z.object({
      title: import_zod2.z.string(),
      description: import_zod2.z.string(),
      amount: import_zod2.z.number(),
      type: import_zod2.z.enum(["credit", "debit"])
    });
    const { title, description, amount, type } = createTransactionBodySchema.parse(request.body);
    let sessionId = request.cookies.sessionId;
    if (!sessionId) {
      sessionId = (0, import_crypto.randomUUID)();
      response.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
        // 7 days
      });
    }
    await knex("transactions").insert({
      id: (0, import_crypto.randomUUID)(),
      title,
      description,
      amount: type === "credit" ? amount : -amount,
      session_id: sessionId
    });
    return response.status(201).send();
  });
  app.get("/summary", preHandlers, async (request) => {
    const { sessionId } = request.cookies;
    const summary = await knex("transactions").where("session_id", sessionId).sum("amount", { as: "amount" }).first();
    return { summary };
  });
  app.get("/:id", preHandlers, async (request, response) => {
    const { sessionId } = request.cookies;
    const getTransactionPramsSchema = import_zod2.z.object({
      id: import_zod2.z.string().uuid()
    });
    const { id } = getTransactionPramsSchema.parse(request.params);
    const transaction = await knex("transactions").where({ id, session_id: sessionId }).first();
    if (!transaction) {
      return response.status(404).send();
    }
    return { transaction };
  });
  app.delete("/:id", preHandlers, async (request, response) => {
    const { sessionId } = request.cookies;
    const getTransactionPramsSchema = import_zod2.z.object({
      id: import_zod2.z.string().uuid()
    });
    const { id } = getTransactionPramsSchema.parse(request.params);
    await knex("transactions").where({ id, session_id: sessionId }).delete();
    return response.send();
  });
  app.get("/", preHandlers, async (request) => {
    const { sessionId } = request.cookies;
    const transactions = await knex("transactions").where(
      "session_id",
      sessionId
    );
    return { transactions };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  transactionsRoutes
});
