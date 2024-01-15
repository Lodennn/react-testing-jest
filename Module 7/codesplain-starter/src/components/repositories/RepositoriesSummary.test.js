import { render, screen, within } from "@testing-library/react";
import RepositoriesSummary from "./RepositoriesSummary";

test("it displays the main language of the repo", () => {
  const repository = {
    language: "JavaScript",
    forks: 5,
    stargazers_count: 10,
    open_issues: 2,
  };

  render(<RepositoriesSummary repository={repository} />);

  const summaryContainer = screen.getByTestId("summary-container");
  const languageLabel = within(summaryContainer).getByText(
    repository.language,
    { exact: false }
  );

  expect(summaryContainer.children).toHaveLength(4);
  expect(languageLabel).toBeInTheDocument();
});
