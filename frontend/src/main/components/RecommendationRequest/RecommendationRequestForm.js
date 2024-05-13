import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function RecommendationRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {
    
        // Stryker disable all
        const {
            register,
            formState: { errors },
            handleSubmit,
        } = useForm(
            { defaultValues: initialContents || {}, }
        );
        // Stryker restore all
        
    const navigate = useNavigate();
    
    return (

        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="RecommendationRequestForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requester_email">Requester email</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-requester_email"
                            id="requester_email"
                            type="email"
                            isInvalid={Boolean(errors.requester_email)}
                            {...register("requester_email", {
                                required: "Requester email is required",
                            })}
                        />
                        <Form.Control.Feedback type = "invalid" >
                            {errors.requester_email?.message }
                        </Form.Control.Feedback>

                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="professor_email">Professor email</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-professor_email"
                            id="professor_email"
                            type="email"
                            isInvalid={Boolean(errors.professorEmail)}
                            {...register("professor_email", {
                                required: "Professor email is required",
                            })}
                        />
                        <Form.Control.Feedback type = "invalid" >
                            {errors.professor_email?.message }
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="explanation">Explanation</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-explanation"
                            id="explanation"
                            type="text"
                            isInvalid={Boolean(errors.explanation)}
                            {...register("explanation", {
                                required: "Explanation is required",
                            })}
                        />
                        <Form.Control.Feedback type = "invalid" >
                            {errors.explanation?.message }
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="date_requested">Date requested</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-date_requested"
                            id="date_requested"
                            type="datetime-local"
                            isInvalid={Boolean(errors.dateRequested)}
                            {...register("date_requested", { 
                                required: "Date requested is required." 
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.date_requested?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="date_needed">Date needed</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-date_needed"
                            id="date_needed"
                            type="datetime-local"
                            isInvalid={Boolean(errors.dateNeeded)}
                            {...register("date_needed", { required: "Date needed is required."})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.date_needed?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className='mb-3'>
                        <Form.Label htmlFor="done">Done</Form.Label>
                        <Form.Check
                            data-testid="RecommendationRequestForm-done"
                            id="done"
                            value={true}
                            type="checkbox"
                            {...register("done")}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="RecommendationRequestForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="RecommendationRequestForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default RecommendationRequestForm;