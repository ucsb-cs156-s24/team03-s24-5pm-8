import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBOrganizationForm tests", () => {

    test('renders correctly', async () => {
        render(<UCSBOrganizationForm />);
    
        const orgCodeInput = await screen.findByTestId('UCSBOrganizationForm-orgCode');
        expect(orgCodeInput).toBeInTheDocument();
    
        const orgTranslationShortInput = await screen.findByTestId('UCSBOrganizationForm-orgTranslationShort');
        expect(orgTranslationShortInput).toBeInTheDocument();
    
        const orgTranslationInput = await screen.findByTestId('UCSBOrganizationForm-orgTranslation');
        expect(orgTranslationInput).toBeInTheDocument();
    
        const inactiveInput = await screen.findByTestId('UCSBOrganizationForm-inactive');
        expect(inactiveInput).toBeInTheDocument();
    });
    


    test("renders correctly when passing in a UCSBOrganization", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm initialContents={ucsbOrganizationFixtures.oneOrganization} />
            </Router>
        );
        await screen.findByTestId(/UCSBOrganizationForm-orgCode/);
        expect(screen.getByText(/orgCode/)).toBeInTheDocument();
        expect(screen.getByTestId(/UCSBOrganizationForm-orgCode/)).toHaveValue("SPE");
    });


    test("Correct Error messages on bad input", async () => {
        render(
            <Router>
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-orgCode");
    
        const orgTranslationShort = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        const orgTranslation = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
        const inactive = screen.getByTestId("UCSBOrganizationForm-inactive");
        const submitButton = screen.getByRole('button', { name: /create/i });
    
        fireEvent.change(inactive, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);
    
        await screen.findByText(/Must be true or false/); 
    });
    
    

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-submit");
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/orgTranslationShort is required./);
        expect(screen.getByText(/orgTranslation is required./)).toBeInTheDocument();
        expect(screen.getByText(/inactive is required./)).toBeInTheDocument();

    });

    test("No Error messages on good input", async () => {
        render(
            <Router>
                <UCSBOrganizationForm />
            </Router>
        );

        const orgCodeInput = screen.getByTestId("UCSBOrganizationForm-orgCode");
        fireEvent.change(orgCodeInput, { target: { value: '1234' } });
    
        const orgTranslationShortInput = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        fireEvent.change(orgTranslationShortInput, { target: { value: 'Translation Short' } });
    
        const orgTranslationInput = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
        fireEvent.change(orgTranslationInput, { target: { value: 'Translation' } });
    
        const inactiveInput = screen.getByTestId("UCSBOrganizationForm-inactive");
        fireEvent.change(inactiveInput, { target: { value: 'false' } });
    
        const submitButton = screen.getByRole('button', { name: /create/i });
        fireEvent.click(submitButton);
    
        expect(screen.queryByText(/orgTranslationShort is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/orgTranslation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/inactive is required./)).not.toBeInTheDocument();
    });    

    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-cancel");
        const cancelButton = screen.getByTestId("UCSBOrganizationForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


