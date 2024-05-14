import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );
    await screen.findByText(/requesterEmail/);
    await screen.findByText(/teamId/);
    await screen.findByText(/tableOrBreakoutRoom/);
    await screen.findByText(/explanation/);
    await screen.findByText(/solved/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a HelpRequest", async () => {
    render(
      <Router>
        <HelpRequestForm initialContents={helpRequestFixtures.oneHelpRequest} />
      </Router>
    );
    await screen.findByTestId(/HelpRequestForm-id/);
    expect(screen.getByText(/Iden/)).toBeInTheDocument(); // TODO: getByTestId makes this work, but code coverage doesn't
    expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );

    await screen.findByTestId("HelpRequestForm-requestTime");
    const quarterYYYYQField = screen.getByTestId("HelpRequestForm-requestTime");
    const localDateTimeField = screen.getByTestId(
      "HelpRequestForm-requestTime"
    );
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(quarterYYYYQField, { target: { value: "bad-input" } });
    fireEvent.change(localDateTimeField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    // TODO: Check if this needs tobe fixed
    await screen.findByText(/requestTime is required./);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );
    await screen.findByTestId("HelpRequestForm-submit");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/requesterEmail is required./);
    expect(screen.getByText(/teamId is required./)).toBeInTheDocument();
    expect(
      screen.getByText(/tableOrBreakoutRoom is required./)
    ).toBeInTheDocument();
    expect(screen.getByText(/requestTime is required./)).toBeInTheDocument();
    expect(screen.getByText(/explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/solved is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <HelpRequestForm submitAction={mockSubmitAction} />
      </Router>
    );

    await screen.findByTestId("HelpRequestForm-requesterEmail"); // TODO: Fix this and all below

    const requesterEmailField = screen.getByTestId(
      "HelpRequestForm-requesterEmail"
    );
    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
    const tableOrBreakoutRoomField = screen.getByTestId(
      "HelpRequestForm-tableOrBreakoutRoom"
    );
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const solvedField = screen.getByTestId("HelpRequestForm-solved");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(requesterEmailField, {
      target: { value: "requesterEmail" },
    });
    fireEvent.change(teamIdField, { target: { value: "teamId" } });
    fireEvent.change(tableOrBreakoutRoomField, {
      target: { value: "tableOrBreakoutRoom" },
    });
    fireEvent.change(requestTimeField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(explanationField, { target: { value: "explanation" } });
    fireEvent.change(solvedField, { target: { value: "true" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/requesterEmail is required./)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/teamId is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/tableOrBreakoutRoom is required./)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/requestTime is required./)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/explanation is required./)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/solved is required./)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );
    await screen.findByTestId("HelpRequestForm-cancel");
    const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});