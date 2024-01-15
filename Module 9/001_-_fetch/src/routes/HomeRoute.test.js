import { render, screen } from "@testing-library/react";
import HomeRoute from "./HomeRoute";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router";

import createServer from "../createServer";

const renderComponent = () => {
  render(<HomeRoute />, { wrapper: MemoryRouter });
};

createServer([
  {
    path: "/api/repositories",
    method: "get",
    res: (req, _, _2) => {
      const language = req.url.searchParams.get("q").split("language:")[1];
      return {
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      };
    },
  },
]);

test("it renders 6 popular languages", () => {
  renderComponent();

  const popularLanguages = screen.getAllByText(/most popular/i);

  expect(popularLanguages).toHaveLength(6);
});

test("it renders python and javascript", () => {
  renderComponent();

  const python = screen.getByText(/most popular python/i);
  const java = screen.getByText("Most Popular Java");

  expect(python).toBeInTheDocument();
  expect(java).toBeInTheDocument();
});

test("it renders two links for each langauge", async () => {
  renderComponent();

  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "java",
  ];

  for (let language of languages) {
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${language}_`),
    });

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
  }
});
