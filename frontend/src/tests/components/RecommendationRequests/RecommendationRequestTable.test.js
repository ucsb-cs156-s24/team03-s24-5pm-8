import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { hasRole } from "main/utils/currentUser";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RecommendationRequestTable tests", () => {
    const queryClient = new QueryClient();

    test("Has the expected column headers and content for ordinary user", () => {

        const currentUser = currentUserFixtures.userOnly;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestTable recommendationRequests={recommendationRequestFixtures.threeRecommendationRequests} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>

        );

        const expectedHeaders = ["id", "Requester email", "Professor email", "Explanation", "Date Requested", "Date Needed", "Done"];
        const expectedFields = ["id", "requester_email", "professor_email", "explanation", "date_requested", "date_needed", "Done"];
        const testid = "RecommendationRequestTable";

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testid}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testid}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testid}-cell-row-1-col-id`)).toHaveTextContent("2");

        const editButton = screen.queryByTestId(`${testid}-cell-row-0-col-Edit-button`);
        expect(editButton).not.toBeInTheDocument();

        const deleteButton = screen.queryByTestId(`${testid}-cell-row-0-col-Delete-button`);
        expect(deleteButton).not.toBeInTheDocument();

    });

    test("Has the expected column headers and content for adminUser", () => {

        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestTable recommendationRequests={recommendationRequestFixtures.threeRecommendationRequests} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>

        );

        const expectedHeaders = ["id", "Requester email", "Professor email", "Explanation", "Date Requested", "Date Needed", "Done"];
        const expectedFields = ["id", "requester_email", "professor_email", "explanation", "date_requested", "date_needed", "Done",];
        const testid = "RecommendationRequestTable";

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testid}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testid}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testid}-cell-row-1-col-id`)).toHaveTextContent("2");

        const doneField = screen.getByTestId(`${testid}-cell-row-0-col-Done`);
        expect(doneField).toHaveTextContent("false");

        const editButton = screen.queryByTestId(`${testid}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveTextContent("Edit");
        expect(editButton).toHaveClass("btn btn-primary");

        const deleteButton = screen.queryByTestId(`${testid}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn btn-danger");
        expect(deleteButton).toHaveTextContent("Delete");

    });

    test("Edit button navigates to the edit page for admin user + delete button", async () => {

        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestTable recommendationRequests={recommendationRequestFixtures.threeRecommendationRequests} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>

        );

        var testNumber = 0;
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            testNumber = 1;
        }
        expect(testNumber).toBe(1);


        const deleteButton = screen.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button");
        fireEvent.click(deleteButton);


        const editButton = screen.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button");
        fireEvent.click(editButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith("/recommendationrequests/edit/1"));
    });
}); 