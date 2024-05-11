
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import HelpRequestTable from "main/components/HelpRequest/HelpRequestTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();


  test("Has the expected column headers and content for ordinary user", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable dates={helpRequestFixtures.threeHelpRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "requesterEmail", "teamId", "tableOrBreakoutRoom", "requestTime", "explanation", "solved"];
    const expectedFields = ["id", "requesterEmail", "teamId", "tableOrBreakoutRoom", "requestTime", "explanation", "solved"];
    const testId = "HelpRequestTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`)).toHaveTextContent("hannaneh@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-teamId`)).toHaveTextContent("s24-5pm-8");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-tableOrBreakoutRoom`)).toHaveTextContent("8");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-requestTime`)).toHaveTextContent("2022-01-03T00:00:00")
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Need help with Swagger");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-solved`)).toHaveTextContent("false");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-requesterEmail`)).toHaveTextContent("xuser@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-teamId`)).toHaveTextContent("s24-5pm-7");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-tableOrBreakoutRoom`)).toHaveTextContent("10");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-requestTime`)).toHaveTextContent("2023-01-03T12:00:00")
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("Dokku problems");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-solved`)).toHaveTextContent("true");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

    const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).not.toBeInTheDocument();

  });
  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable dates={helpRequestFixtures.threeHelpRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "requesterEmail", "teamId", "tableOrBreakoutRoom", "requestTime", "explanation", "solved"];
    const expectedFields = ["id", "requesterEmail", "teamId", "tableOrBreakoutRoom", "requestTime", "explanation", "solved"];
    const testId = "HelpRequestTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable dates={helpRequestFixtures.threeHelpRequests
          } currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(screen.getByTestId(`HelpRequestTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

    const editButton = screen.getByTestId(`HelpRequestTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/helprequest/edit/1'));

  });

  test("Delete button calls the delete mutation for admin user", async () => {

        const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable dates={helpRequestFixtures.threeHelpRequests
          } currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    // Idk what this does
    await waitFor(() => { expect(screen.getByTestId(`HelpRequestTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

    const deleteButton = screen.getByTestId(`HelpRequestTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);
    });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable dates={helpRequestFixtures.threeHelpRequests
          } currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    // assert - check that the expected content is rendered
    expect(
      await screen.findByTestId(
        `HelpRequestTable-cell-row-0-col-id`,
      ),
    ).toHaveTextContent("1");
    // expect(
    //   screen.getByTestId(`HelpRequestTable-cell-row-0-col-name`),
    // ).toHaveTextContent("");

    const deleteButton = screen.getByTestId(
      `HelpRequestTable-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);
  });
});
