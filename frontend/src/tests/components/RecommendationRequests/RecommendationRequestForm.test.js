import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import RecommendationRequestForm from 'main/components/RecommendationRequest/RecommendationRequestForm';
import { recommendationRequestFixtures } from 'fixtures/recommendationRequestFixtures';
import { BrowserRouter as Router } from 'react-router-dom';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe('RecommendationRequestForm tests', () => {

    test('renders correctly', async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByText(/Requester email/);
        await screen.findByText(/Create/);
    });

    test('renders correctly when passing in a RecommendationRequest', async () => {
            
        render(
            <Router  >
                <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRecommendationRequest} />
            </Router>
        );
        await screen.findByTestId(/RecommendationRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue('1');
        expect(screen.getByTestId(/RecommendationRequestForm-requester_email/)).toHaveValue('requester_email1@gmail.com');
        expect(screen.getByTestId(/RecommendationRequestForm-professor_email/)).toHaveValue('professor_email1@gmail.com');
        expect(screen.getByTestId(/RecommendationRequestForm-explanation/)).toHaveValue('explanationData1');
        expect(screen.getByTestId(/RecommendationRequestForm-date_requested/)).toHaveValue('2022-01-02T12:00');
        expect(screen.getByTestId(/RecommendationRequestForm-date_needed/)).toHaveValue('2022-01-03T12:00');
        expect(screen.getByTestId(/RecommendationRequestForm-done/)).toHaveValue('true');
    });


    test('Correct Error messsages on bad input', async () => {
            
        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId('RecommendationRequestForm-done');
        const doneField = screen.getByTestId('RecommendationRequestForm-done');
        const submitButton = screen.getByTestId('RecommendationRequestForm-submit');

        fireEvent.change(doneField, { target: { value: 'bad input' } });

        fireEvent.click(submitButton);

        await screen.findByText(/Requester email is required/);
        await screen.findByText(/Professor email is required/);
        await screen.findByText(/Explanation is required/);
        await screen.findByText(/Date requested is required/);
        await screen.findByText(/Date needed is required/);
    });

    test('Correct Error messsages on missing input', async () => {
            
        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );

        await screen.findByTestId('RecommendationRequestForm-requester_email');
        const submitButton = screen.getByTestId('RecommendationRequestForm-submit');

        fireEvent.click(submitButton);

        await screen.findByText(/Requester email is required/);
        await screen.findByText(/Professor email is required/);
        await screen.findByText(/Explanation is required/);
        await screen.findByText(/Date requested is required/);
        await screen.findByText(/Date needed is required/);
    });

    test("No Error messages on good input", async () => {

        const submitAction = jest.fn();

        render(
            <Router  >
                <RecommendationRequestForm submitAction={submitAction} />
            </Router>
        );

        await screen.findByTestId('RecommendationRequestForm-requester_email');
        const requester_emailField = screen.getByTestId('RecommendationRequestForm-requester_email');
        const professor_emailField = screen.getByTestId('RecommendationRequestForm-professor_email');
        const explanationField = screen.getByTestId('RecommendationRequestForm-explanation');
        const date_requestedField = screen.getByTestId('RecommendationRequestForm-date_requested');
        const date_neededField = screen.getByTestId('RecommendationRequestForm-date_needed');
        const doneField = screen.getByTestId('RecommendationRequestForm-done');
        const submitButton = screen.getByTestId('RecommendationRequestForm-submit');

        fireEvent.change(requester_emailField, { target: { value: 'test@gmail.com' } });
        fireEvent.change(professor_emailField, { target: { value: 'proftest@gmail.com' } });
        fireEvent.change(explanationField, { target: { value: 'test explanation' } });
        fireEvent.change(date_requestedField, { target: { value: '2022-01-01T12:00' } });
        fireEvent.change(date_neededField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(doneField, { target: { value: 'true' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(submitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Requester email is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Professor email is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date requested is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date needed is required/)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
            
            render(
                <Router  >
                    <RecommendationRequestForm />
                </Router>
            );
    
            await screen.findByTestId('RecommendationRequestForm-cancel');
            const cancelButton = screen.getByTestId('RecommendationRequestForm-cancel');
    
            fireEvent.click(cancelButton);
    
            expect(mockedNavigate).toHaveBeenCalledWith(-1);
    });

});