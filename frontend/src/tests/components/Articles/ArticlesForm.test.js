import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("ArticlesForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        // await screen.findByText(/Id/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a Article", async () => {

        render(
            <Router  >
                <ArticlesForm initialContents={articlesFixtures.oneArticle[0]} />
            </Router>
        );
        await screen.findByTestId(/ArticlesForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-title");
        const titleField = screen.getByTestId("ArticlesForm-title");
        const explanationField = screen.getByTestId("ArticlesForm-explanation");
        const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.change(titleField, { target: { value: 'morethanthirtycharactersforthetitlecausesanerrorjustlikethis' } });
        fireEvent.change(explanationField, { target: { value: '00afjeadfkijaoweijfoiwaejfaiojfaoifjdkfjadkfjfkdjajdslkfjakdfjifjknfvfghfjkdfjhgjfkdfjhgjfkdfjghjfkfjghjfkjghjfkjghjfkjghjfkjghjfkjghjfkjgjfkjgfkjghjfkfjkfjgfkfjgjfkjgjfkfjkfjgjfkfjghjfkdfjjkfjjkfjjkawjfakwefgjdhbcvhjfgegfjhdjshdjshdjshdjshdjshdjsdhjshdjshdjshdjshdjshdjshdjshdjshdjshdjshdjshdjshdjhsjdjshdjshdjshdjshdjssjdhsjdhjsdhdjshdjshdjshjsdhjshdjshdjshdjhdjshdjshdjshfdjfhakwefhsjdfhajkfhkajdfhalkjdfhkdjfhkjsdhfkjsdhfsjfhkjdshfksjdhfksjdhfksjdfhksjdhfskjdfkhfskdjfhksjdhfksjdhfksjdfhskjfhskjdhfskjdfhdksjfhskjdfhdksjhfskjdhfdskjhfjdsf' } });
        fireEvent.change(dateAddedField, { target: { value: "bad-input" } });
        fireEvent.click(submitButton);

        await screen.findByText(/Max length 30 characters/);
        await screen.findByText(/Max length 200 characters/);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-submit");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Date added is required./);
        await screen.findByText(/Title is required./);
        await screen.findByText(/Url is required./);
        await screen.findByText(/Explanation is required./);
        await screen.findByText(/Email is required./);

    });

    test("No Error messsages on good input", async () => {
        const mockSubmitAction = jest.fn();

        render(
            <Router  >
                <ArticlesForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-email");
        const emailField = screen.getByTestId("ArticlesForm-email");
        const titleField = screen.getByTestId("ArticlesForm-title");
        const urlField = screen.getByTestId("ArticlesForm-url");
        const explanationField = screen.getByTestId("ArticlesForm-explanation");
        const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");

        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.change(dateAddedField, { target: { value: "2022-01-02T12:00" } });
        fireEvent.change(titleField, { target: { value: "Computer Science" } });
        fireEvent.change(urlField, { target: { value: "google.com" } });
        fireEvent.change(explanationField, { target: { value: "There are so many homeoworks." } });
        fireEvent.change(emailField, { target: { value: "spark686@ucsb.edu" } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Date added is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Title is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Url is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Email is required./)).not.toBeInTheDocument();

        expect(screen.queryByText(/Max length 30 characters./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Added must be in the format YYYY-MM-DDTHH:MM:SS/)).not.toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-cancel");
        const cancelButton = screen.getByTestId("ArticlesForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});