import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "../../test/server";
import AuthButtons from "./AuthButtons";

const renderComponent = async () => {
  render(
    <MemoryRouter>
      <AuthButtons />
    </MemoryRouter>
  );
  await screen.findAllByRole("link");
};

describe("when user is not signed in", () => {
  // createServer() ---> GET /api/user ---> { user: null }

  createServer([
    {
      path: "/api/user",
      res: () => {
        return {
          user: null,
        };
      },
    },
  ]);

  test("when user is not signed in, sign in and sign up are visible", async () => {
    await renderComponent();

    const signInBtn = screen.getByRole("link", { name: /sign in/i });
    const signUpBtn = screen.getByRole("link", { name: /sign up/i });

    expect(signInBtn).toBeInTheDocument();
    expect(signInBtn).toHaveAttribute("href", "/signin");

    expect(signUpBtn).toBeInTheDocument();
    expect(signUpBtn).toHaveAttribute("href", "/signup");
  });

  test("when user is not signed in, sign out is not visible", async () => {
    await renderComponent();

    const signOutBtn = screen.queryByRole("link", { name: /sign out/i });

    expect(signOutBtn).toBe(null);
  });
});

describe("when user is signed in", () => {
  // createServer() ---> GET /api/user ---> { user: { id: 1, name: test } }

  createServer([
    {
      path: "/api/user",
      res: () => {
        return {
          user: { id: 1, email: "khaled@mail.com" },
        };
      },
    },
  ]);
  test("when user is signed in, sign in and sign up are not visible", async () => {
    await renderComponent();
    const signInBtn = screen.queryByRole("link", { name: /sign in/i });
    const signUpBtn = screen.queryByRole("link", { name: /sign up/i });

    expect(signInBtn).toBe(null);
    expect(signUpBtn).toBe(null);
  });
  test("when user is signed in, sign out is visible", async () => {
    await renderComponent();

    const signOutBtn = screen.getByRole("link", { name: /sign out/i });

    expect(signOutBtn).toBeInTheDocument();
    expect(signOutBtn).toHaveAttribute("href", "/signout");
  });
});
