import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});


describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/MenuItemReview", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit MenuItemReview");
            expect(screen.queryByTestId("MenuItemReviewForm-itemid")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/MenuItemReview", { params: { id: 17 } }).reply(200, {
                id: 1,
                itemId: "1",
                reviewerEmail: "xinyaosong@ucsb.edu",
                stars: "5",
                dateReviewed: "2022-02-02T00:00",
                comments: "Good food"
            });
            axiosMock.onPut('/api/MenuItemReview').reply(200, {
                id: "1",
                itemId: "1",
                reviewerEmail: "xinyaosong@ucsb.edu",
                stars: "5",
                dateReviewed: "2022-02-02T00:00",
                comments: "Good food"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-itemId");

            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(itemIdField).toHaveValue("1");
            expect(reviewerEmailField).toHaveValue("xinyaosong@ucsb.edu");
            expect(dateReviewedField).toHaveValue("2022-02-02T00:00");
            expect(starsField).toHaveValue(5);
            expect(commentsField).toHaveValue("Good food");
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-itemId");

            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(itemIdField).toHaveValue("1");
            expect(reviewerEmailField).toHaveValue("xinyaosong@ucsb.edu");
            expect(dateReviewedField).toHaveValue("2022-02-02T00:00");
            expect(starsField).toHaveValue(5);
            expect(commentsField).toHaveValue("Good food");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(itemIdField, { target: { value: 1 } });
            fireEvent.change(reviewerEmailField, { target: { value: "xinyaosong@ucsb.edu" } });
            fireEvent.change(dateReviewedField, { target: { value: "2022-02-02T00:00" } });
            fireEvent.change(starsField, { target: { value: 5 } });
            fireEvent.change(commentsField, { target: { value: "Good food" } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("MenuItemReview Updated - id: 1 reviewerEmail: xinyaosong@ucsb.edu");
            expect(mockNavigate).toBeCalledWith({ "to": "/MenuItemReview" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: "1",
                reviewerEmail: "xinyaosong@ucsb.edu",
                dateReviewed: "2022-02-02T00:00",
                stars: "5",
                comments: "Good food"
            })); // posted object

        });

       
    });

});



