import { findByRole, render, screen } from "@testing-library/react";
import RepositoriesListItem from "./RepositoriesListItem";
import { BrowserRouter } from "react-router-dom";

function AllWrappers(props) {
  return <BrowserRouter>{props.children}</BrowserRouter>;
}

function renderComponent() {
  const props = {
    full_name: "x",
    language: "x",
    description: "x",
    owner: { login: "facebook" },
    name: "x",
    html_url: "https://github.com/omergulcicek/react",
  };
  render(<RepositoriesListItem repository={props} />, {
    wrapper: AllWrappers,
  });
  return props;
}

const pause = () => new Promise((resolve) => setTimeout(resolve, 100));

// jest.mock("../../components/tree/FileIcon.js", () => {
//   return () => {
//     return "FileIcon Mocked";
//   };
// });

test("it renders link to repo at the end of repo list item row", async () => {
  const repoProps = renderComponent();

  await screen.findByRole("img", { name: repoProps.name });

  //   const anchor = screen.getByText(/repo link/i);

  const anchor = screen.getByRole("link", { name: /github repository/i });

  expect(anchor).toHaveAttribute("href", repoProps.html_url);
});

test("it renders the right link as repo name", async () => {
  const repository = renderComponent();

  const link = await screen.findByRole("link", {
    name: new RegExp(repository.owner.login),
  });

  expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`);
});
