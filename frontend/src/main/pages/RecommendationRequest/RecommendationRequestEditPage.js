import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestEditPage({ storybook = false }) {
    let { id } = useParams();

    const { data: recommendationRequest, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/recommendationrequests?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/recommendationrequests`,
                params: {
                    id
                }
            }
        );


    const objectToAxiosPutParams = (recommendationRequest) => ({
        url: "/api/recommendationrequests",
        method: "PUT",
        params: {
            id: recommendationRequest.id,
        },
        data: {
            requester_email: recommendationRequest.requester_email,
            professor_email: recommendationRequest.professor_email,
            explanation: recommendationRequest.explanation,
            date_requested: recommendationRequest.date_requested,
            date_needed: recommendationRequest.date_needed,
            done: recommendationRequest.done
        }
    });

    const onSuccess = (recommendationRequest) => {
        toast(`RecommendationRequest Updated - id: ${recommendationRequest.id} requester_email: ${recommendationRequest.requester_email}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/recommendationrequests?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }


    if (isSuccess && !storybook) {
        return <Navigate to="/recommendationrequests" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Recommendation Request</h1>
                {
                    recommendationRequest && <RecommendationRequestForm initialContents={recommendationRequest} submitAction={onSubmit} buttonLabel="Update" />
                }
            </div>
        </BasicLayout>
    )
}
