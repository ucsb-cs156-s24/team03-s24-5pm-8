import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

function ArticlesForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    // Stryker restore all

    // Stryker disable next-line Regex
    // const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   
    const navigate = useNavigate();

    const testIdPrefix = "ArticlesForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
        <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="ArticlesForm-id"
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
                    <Form.Label htmlFor="dateAdded">Date Added(iso format)</Form.Label>
                    <Form.Control
                        data-testid="ArticlesForm-dateAdded"
                        id="dateAdded"
                        type="datetime-local"
                        isInvalid={Boolean(errors.dateAdded)}
                        {...register("dateAdded", { required: true, pattern: isodate_regex })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.dateAdded && 'Date added is required.'}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>

            <Col>
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="title">Title</Form.Label>
                    <Form.Control
                        data-testid="ArticlesForm-title"
                        id="title"
                        type="text"
                        isInvalid={Boolean(errors.title)}
                        {...register("title", {
                            required: "Title is required.",
                            maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.title?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>
        </Row>

        <Row>
            <Col>
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="url">Url</Form.Label>
                    <Form.Control
                        data-testid="ArticlesForm-url"
                        id="url"
                        type="text"
                        isInvalid={Boolean(errors.url)}
                        {...register("url", {
                            required: "Url is required."
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.url?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>

            <Col>
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="explanation">Explanation</Form.Label>
                    <Form.Control
                        data-testid="ArticlesForm-explanation"
                        id="explanation"
                        type="text"
                        isInvalid={Boolean(errors.explanation)}
                        {...register("explanation", {
                            required: "Explanation is required.",
                            maxLength : {
                            value: 200,
                            message: "Max length 200 characters"
                        }
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                       {errors.explanation?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>
        </Row>

        <Row>
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                    data-testid="ArticlesForm-email"
                    id="email"
                    type="text"
                    isInvalid={Boolean(errors.email)}
                    {...register("email", {
                        required: "Email is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                </Form.Control.Feedback>
            </Form.Group>
        </Row>


            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default ArticlesForm;