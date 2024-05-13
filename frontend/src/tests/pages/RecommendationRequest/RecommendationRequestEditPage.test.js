import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

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

describe("RecommendationRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/recommendationrequests", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByText("Edit Recommendation Request");
            expect(screen.queryByTestId("RecommendationRequestForm-requester_email")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/recommendationrequests", { params: { id: 17 } }).reply(200, {
                id: 17,
                requester_email: 'requester_email@gmail.com',
                professor_email: 'professor_email@gmail.com',
                explanation: 'explanation',
                date_requested: '2022-03-14T15:00',
                date_needed: '2022-03-14T15:00',
                done: 'false'
            });
            axiosMock.onPut('/api/recommendationrequests').reply(200, {
                id: "17",
                requester_email: 'requester_emailPUT@gmail.com',
                professor_email: 'professor_emailPUT@gmail.com',
                explanation: 'explanationPUT',
                date_requested: '2022-03-14T16:00',
                date_needed: '2022-03-14T16:00',
                done: 'true'
            });
        });
            const queryClient = new QueryClient();
            test("renders without crashing", () => {
                render(
                    <QueryClientProvider client={queryClient}>
                        <MemoryRouter>
                            <RecommendationRequestEditPage />
                        </MemoryRouter>
                    </QueryClientProvider>
                );
            });

            test("is populated with the data provided", async () => {

                render(
                    <QueryClientProvider client={queryClient}>
                        <MemoryRouter>
                            <RecommendationRequestEditPage />
                        </MemoryRouter>
                    </QueryClientProvider>
                );

                await screen.findByTestId("RecommendationRequestForm-requester_email");

                const idField = screen.getByTestId("RecommendationRequestForm-id");
                const requester_email = screen.getByTestId("RecommendationRequestForm-requester_email");
                const professor_email = screen.getByTestId("RecommendationRequestForm-professor_email");
                const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
                const date_requested = screen.getByTestId("RecommendationRequestForm-date_requested");
                const date_needed = screen.getByTestId("RecommendationRequestForm-date_needed");
                const done = screen.getByTestId("RecommendationRequestForm-done");

                const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

                expect(idField).toHaveValue("17");
                expect(requester_email).toHaveValue("requester_email@gmail.com");
                expect(professor_email).toHaveValue("professor_email@gmail.com")
                expect(explanation).toHaveValue("explanation");
                expect(date_requested).toHaveValue("2022-03-14T15:00");
                expect(date_needed).toHaveValue("2022-03-14T15:00");
                expect(done).toHaveValue("false");

                expect(submitButton).toBeInTheDocument();
            });

            test("changes when you click Update", async () => {
                render (
                    <QueryClientProvider client={queryClient}>
                        <MemoryRouter>
                            <RecommendationRequestEditPage />
                        </MemoryRouter>
                    </QueryClientProvider>
                );

                await screen.findByTestId("RecommendationRequestForm-requester_email");

                const idField = screen.getByTestId("RecommendationRequestForm-id");
                const requester_emailField = screen.getByTestId("RecommendationRequestForm-requester_email");
                const professor_emailField = screen.getByTestId("RecommendationRequestForm-professor_email");
                const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
                const date_requestedField = screen.getByTestId("RecommendationRequestForm-date_requested");
                const date_neededField = screen.getByTestId("RecommendationRequestForm-date_needed");
                const doneField = screen.getByTestId("RecommendationRequestForm-done");

                const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

                expect(idField).toHaveValue("17");
                expect(requester_emailField).toHaveValue("requester_email@gmail.com");
                expect(professor_emailField).toHaveValue("professor_email@gmail.com")
                expect(explanationField).toHaveValue("explanation");
                expect(date_requestedField).toHaveValue("2022-03-14T15:00");
                expect(date_neededField).toHaveValue("2022-03-14T15:00");
                expect(doneField).toHaveValue("false");

                expect(submitButton).toBeInTheDocument();

                fireEvent.change(requester_emailField, { target: { value: 'requester_emailPUT@gmail.com' } } )
                fireEvent.change(professor_emailField, { target: { value: 'professor_emailPUT@gmail.com' } } )
                fireEvent.change(explanationField, { target: { value: 'explanationPUT' } } )
                fireEvent.change(date_requestedField, { target: { value: '2022-03-14T16:00' } } )
                fireEvent.change(date_neededField, { target: { value: '2022-03-14T16:00' } } )
                fireEvent.change(doneField, { target: { value: 'true' } } )

                fireEvent.click(submitButton);

                await waitFor(() => expect(mockToast).toBeCalled());
                expect(mockToast).toHaveBeenCalledWith("RecommendationRequest Updated - id: 17 requester_email: requester_emailPUT@gmail.com");
                expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequests" });

                expect(axiosMock.history.put.length).toBe(1); // times called
                expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
                expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                    requester_email: 'requester_emailPUT@gmail.com',
                    professor_email: 'professor_emailPUT@gmail.com',
                    explanation: 'explanationPUT',
                    date_requested: '2022-03-14T16:00',
                    date_needed: '2022-03-14T16:00',
                    done: 'true'
                }));

            });
        });

    });