import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RecommendationRequestCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });



    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const recommendationRequest = {
            id: 17,
            requester_email: "karsten.lansing@gmail.com",
            professor_email: "philconrad@gmail.com",
            explanation: "I need a letter of recommendation for grad school",
            date_requested: "2022-01-02T00:00",
            date_needed: "2022-02-02T00:00",
            done: "false"
        };

        axiosMock.onPost("/api/recommendationrequests/post").reply(202, recommendationRequest);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("RecommendationRequestForm-requester_email")).toBeInTheDocument();
        });

        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requester_email");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professor_email");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-date_requested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-date_needed");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");


        fireEvent.change(requesterEmailField, { target: { value: 'karsten.lansing@gmail.com' } });
        fireEvent.change(professorEmailField, { target: { value: 'philconrad@gmail.com' } });
        fireEvent.change(explanationField, { target: { value: 'I need a letter of recommendation for grad school' } });
        fireEvent.change(dateRequestedField, { target: { value: '2022-01-02T00:00' } });
        fireEvent.change(dateNeededField, { target: { value: '2022-02-02T00:00' } });
        fireEvent.change(doneField, { target: { value: 'false' } })


        expect(submitButton).toBeInTheDocument();
        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "requester_email": "karsten.lansing@gmail.com",
                "professor_email": "philconrad@gmail.com",
                "explanation": "I need a letter of recommendation for grad school",
                "date_requested": "2022-01-02T00:00",
                "date_needed": "2022-02-02T00:00",
                "done": "false"
            });

        expect(mockToast).toBeCalledWith("Recommendation Request Created - id: 17 requesterEmail: karsten.lansing@gmail.com professorEmail:philconrad@gmail.com explanation: I need a letter of recommendation for grad school done: false");
        expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequests" });
    });


    test("when you fill in the form and hit submit, it makes a request to the backend 2", async () => {

        const queryClient = new QueryClient();
        const recommendationRequest = {
            id: 17,
            requester_email: "karsten.lansing@gmail.com",
            professor_email: "philconrad@gmail.com",
            explanation: "I need a letter of recommendation for grad school",
            date_requested: "2022-01-02T00:00",
            date_needed: "2022-02-02T00:00",
            done: "true"
        };

        axiosMock.onPost("/api/recommendationrequests/post").reply(202, recommendationRequest);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("RecommendationRequestForm-requester_email")).toBeInTheDocument();
        });

        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requester_email");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professor_email");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-date_requested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-date_needed");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");


        fireEvent.change(requesterEmailField, { target: { value: 'karsten.lansing@gmail.com' } });
        fireEvent.change(professorEmailField, { target: { value: 'philconrad@gmail.com' } });
        fireEvent.change(explanationField, { target: { value: 'I need a letter of recommendation for grad school' } });
        fireEvent.change(dateRequestedField, { target: { value: '2022-01-02T00:00' } });
        fireEvent.change(dateNeededField, { target: { value: '2022-02-02T00:00' } });
        fireEvent.select(doneField, { target: { value: 'true' } })


        expect(submitButton).toBeInTheDocument();
        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "requester_email": "karsten.lansing@gmail.com",
                "professor_email": "philconrad@gmail.com",
                "explanation": "I need a letter of recommendation for grad school",
                "date_requested": "2022-01-02T00:00",
                "date_needed": "2022-02-02T00:00",
                "done": "true"
            });

        expect(mockToast).toBeCalledWith("Recommendation Request Created - id: 17 requesterEmail: karsten.lansing@gmail.com professorEmail:philconrad@gmail.com explanation: I need a letter of recommendation for grad school done: true");
        expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequests" });
    });

    test("when you fill in the form and hit submit, it makes a request to the backend with false", async () => {

        const queryClient = new QueryClient();
        const recommendationRequest = {
            id: 17,
            requester_email: "asd@gmail.com",
            professor_email: "asdasd@gmail.com",
            explanation: "asdasd",
            date_requested: "2022-01-02T00:00",
            date_needed: "2022-02-02T00:00",
            done: "false"
        };

        axiosMock.onPost("/api/recommendationrequests/post").reply(202, recommendationRequest);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("RecommendationRequestForm-requester_email")).toBeInTheDocument();
        });

    });
});
