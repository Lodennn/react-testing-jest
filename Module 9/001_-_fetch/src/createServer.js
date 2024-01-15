import { rest } from "msw";
import { setupServer } from "msw/lib/node";

export default function (configList) {
  const handlers = configList.map((conf) =>
    rest[conf.method || "get"](conf.path, (req, res, ctx) => {
      return res(ctx.json(conf.res(req, res, ctx)));
    })
  );

  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });
}
