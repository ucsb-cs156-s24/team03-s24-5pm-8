import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

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
            orgCode: "SPE"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsborganization", { params: { orgCode: "SPE" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBOrganization");
            expect(screen.queryByTestId("UCSBOrganizationForm-orgTranslationShort")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/ucsborganization", { params: { orgCode: "SPE" } }).reply(200, {
                orgCode: "SPE",
                orgTranslationShort: "SigEp",
                orgTranslation: "Sigma Phi Epsilon",
                inactive: "false"
            });
            axiosMock.onPut('/api/ucsborganization').reply(200, {
                orgCode: 'SPE',
                orgTranslationShort: 'SigEp',
                orgTranslation: "Sigma Phi Epsilon",
                inactive: "true"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgTranslationShort");

            const orgCode = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const orgTranslationShort = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const orgTranslation = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactive = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgCode).toHaveValue("SPE");
            expect(orgTranslationShort).toHaveValue("SigEp");
            expect(orgTranslation).toHaveValue("Sigma Phi Epsilon");
            expect(inactive).not.toBeChecked();
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgTranslationShort");

            const orgCode = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const orgTranslationShort = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const orgTranslation = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactive = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgCode).toHaveValue("SPE");
            expect(orgTranslationShort).toHaveValue("SigEp");
            expect(orgTranslation).toHaveValue("Sigma Phi Epsilon");
            expect(inactive).not.toBeChecked();

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(orgTranslationShort, { target: { value: 'SigEp' } })
            fireEvent.change(orgTranslation, { target: { value: 'Sigma Phi Epsilon' } })
            fireEvent.change(inactive, { target: { checked: "false" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBOrganization Updated - orgCode: SPE orgTranslationShort: SigEp");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: "SPE" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgCode: "SPE",
                orgTranslationShort: 'SigEp',
                orgTranslation: "Sigma Phi Epsilon",
                inactive: "false"
            })); // posted object

        });
    });
});
