import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe ("MenuItemReviewForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByText(/Item ID/);
        await screen.findByText(/Create/);

    });

    test("renders correctly when passing in a MenuItemReview", async () => {

        render(
            <Router  >
                <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneReview} />
            </Router>
        );
        await screen.findByTestId(/MenuItemReviewForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/MenuItemReviewForm-id/)).toHaveValue("1");
    });

    test("Correct Error messsages on bad input", async () => {
            
        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-reviewerEmail");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(reviewerEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(starsField, { target: { value: 6 } });
        fireEvent.change(dateReviewedField, { target: { value: "bad-input" } });
        fireEvent.click(submitButton);
        
        await screen.findByText(/Reviewer email must be a valid email./);
        await screen.findByText(/Stars must be between 1 and 5./);
        
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Item ID is required./);
        await screen.findByText(/Date of review is required./);
        await screen.findByText(/Reviewer email is required./);
        await screen.findByText(/Stars is required./);
        await screen.findByText(/Comments are required./);
    });

    test("No Error messsages on good input", async () => {
        const mockSubmitAction = jest.fn();

        render(
            <Router  >
                <MenuItemReviewForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");
        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const starField = screen.getByTestId("MenuItemReviewForm-stars");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");

        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: 1 } });
        fireEvent.change(starField, { target: { value: 5 } });
        fireEvent.change(reviewerEmailField, { target: { value: "xinyaosong@ucsb.edu" } });
        fireEvent.change(dateReviewedField, { target: { value: "2022-01-02T12:00" } });
        fireEvent.change(commentsField, { target: { value: "The food is kinda salty." } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Item ID is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date of review is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Stars is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Reviewer email is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Comments are required./)).not.toBeInTheDocument();

        expect(screen.queryByText(/Reviewer email must be a valid email./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Stars must be between 1 and 5./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Reviewed must be in the format YYYY-MM-DDTHH:MM:SS/)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );

        await screen.findByTestId("MenuItemReviewForm-cancel");
        const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");
        fireEvent.click(cancelButton);
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

});