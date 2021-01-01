import { Request, Response } from "express";
import sinon from "sinon";
import * as TE from "fp-ts/lib/TaskEither";
import * as jwt from "jsonwebtoken";
import * as US from "back-end/services/User.services";
import * as UC from "back-end/controllers/User.controller";
import * as M from "utils/messages";
import { User } from "models/User";

const initialSecretKey = process.env.JWT_SECRET_KEY;

const makeReq = <A>(a: A): Request => (a as unknown) as Request;

const makeRes = (): Response =>
  (({
    status: jest.fn(),
    send: jest.fn()
  } as unknown) as Response);

describe("Controllers > User > POST", () => {
  it("refuses malformed body", async () => {
    const expected = M.malformedInputError("Unexpected malformed body")(
      `required property "password"\n└─ cannot decode 1995, should be string`
    );
    const req = makeReq({
      body: {
        email: "123",
        password: 1995,
        display_name: "789"
      }
    });
    const res = makeRes();
    const next = jest.fn();
    await UC.USER_POST(req, res, next);
    expect(next).toHaveBeenCalledWith(expected);
  });
  it("permits valid body", async () => {
    const newUser: User = {
      id: "1234",
      email: "1234",
      password: "1234",
      display_name: "1234",
      current_refresh_token: null
    };
    const userCreate = sinon.stub(US, "create");
    const expected = M.successfulCreate(
      `Successfully created user with email: ${newUser.email}`
    )(newUser);
    userCreate.returns(TE.right(expected));
    const req = makeReq({
      body: {
        email: newUser.email,
        password: newUser.password,
        display_name: newUser.display_name
      }
    });
    const res = makeRes();
    const next = jest.fn();
    await UC.USER_POST(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(expected.status_number);
    expect(res.send).toHaveBeenCalledWith(expected);
  });
});

describe("Controllers > User > PUT", () => {
  it("refuses malformed auth headers", async () => {
    const expected = M.malformedInputError("Unexpected malformed headers")(
      `required property "Authorization"\n└─ cannot decode 1234, should be string`
    );
    const req = makeReq({
      headers: {
        Authorization: 1234
      }
    });
    const res = makeRes();
    const next = jest.fn();
    await UC.USER_PUT(req, res, next);
    expect(next).toHaveBeenCalledWith(expected);
  });
  it("Refuses invalid JWT", async () => {
    const expected = M.unauthorizedError("Unauthorized")(
      `JsonWebTokenError: invalid token`
    );
    const req = makeReq({
      headers: {
        Authorization: "Bearer 1234.abcd.defg5"
      }
    });
    const res = makeRes();
    const next = jest.fn();
    await UC.USER_PUT(req, res, next);
    expect(next).toHaveBeenCalledWith(expected);
  });
  it("Refuses bad params", async () => {
    const expected = M.malformedInputError("Unexpected malformed parameters")(
      `cannot decode undefined, should be Record<string, unknown>`
    );
    const JWT = jwt.sign(
      {
        email: "jacob.alford@me.com",
        user_id: "1234",
        display_name: "Jacob"
      },
      process.env.JWT_SECRET_KEY as string
    );
    const req = makeReq({
      headers: {
        Authorization: `Bearer ${JWT}`
      }
    });
    const res = makeRes();
    const next = jest.fn();
    await UC.USER_PUT(req, res, next);
    expect(next).toHaveBeenCalledWith(expected);
  });
  it("Refuses bad body", async () => {
    const expected = M.malformedInputError("Unexpected malformed body")(
      `required property "email"\n└─ cannot decode 1234, should be string`
    );
    const JWT = jwt.sign(
      {
        email: "jacob.alford@me.com",
        user_id: "1234",
        display_name: "Jacob"
      },
      process.env.JWT_SECRET_KEY as string
    );
    const req = makeReq({
      headers: {
        Authorization: `Bearer ${JWT}`
      },
      params: {
        user_id: "5678"
      },
      body: {
        email: 1234,
        display_name: "John"
      }
    });
    const res = makeRes();
    const next = jest.fn();
    await UC.USER_PUT(req, res, next);
    expect(next).toHaveBeenCalledWith(expected);
  });
  it("refuses request to update another user", async () => {
    const expected = M.unauthorizedError("Unauthorized")(
      `user_id found in token does not match that of request!`
    );
    const JWT = jwt.sign(
      {
        email: "jacob.alford@me.com",
        user_id: "1234",
        display_name: "Jacob"
      },
      process.env.JWT_SECRET_KEY as string
    );
    const req = makeReq({
      headers: {
        Authorization: `Bearer ${JWT}`
      },
      params: {
        user_id: "5678"
      },
      body: {
        email: "891011",
        display_name: "John"
      }
    });
    const res = makeRes();
    const next = jest.fn();
    await UC.USER_PUT(req, res, next);
    expect(next).toHaveBeenCalledWith(expected);
  });
  it("allows update to authentic user", async () => {
    const userUpdate = sinon.stub(US, "updateById");
    const updatedUser: User = {
      id: "1234",
      email: "891011",
      password: "1234",
      display_name: "John",
      current_refresh_token: null
    };
    const expected = M.successfulUpdate(
      `Successfully updated user with id: ${updatedUser.id}`
    )(updatedUser);
    userUpdate.returns(TE.right(expected));
    const JWT = jwt.sign(
      {
        email: "jacob.alford@me.com",
        user_id: "1234",
        display_name: "Jacob"
      },
      process.env.JWT_SECRET_KEY as string
    );
    const req = makeReq({
      headers: {
        Authorization: `Bearer ${JWT}`
      },
      params: {
        user_id: "1234"
      },
      body: {
        email: "891011",
        display_name: "John"
      }
    });
    const res = makeRes();
    const next = jest.fn();
    await UC.USER_PUT(req, res, next);
    expect(res.status).toHaveBeenCalledWith(expected.status_number);
    expect(res.send).toHaveBeenCalledWith(expected);
  });
});
