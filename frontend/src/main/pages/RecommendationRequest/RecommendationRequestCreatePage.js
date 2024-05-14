import BasicLayout  from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({storybook=false}) {
    
    const objectToAxiosParams = (recommendationRequest) => ({
        url: "/api/recommendationrequests/post",
        method: "POST",
        params: {
            requester_email: recommendationRequest.requester_email,
            professor_email: recommendationRequest.professor_email,
            explanation: recommendationRequest.explanation,
            date_requested: recommendationRequest.date_requested,
            date_needed: recommendationRequest.date_needed,
            done: recommendationRequest.done
        }
    });


    const onSuccess = (recommendationRequest) => {
        toast(`Recommendation Request Created - id: ${recommendationRequest.id} requesterEmail: ${recommendationRequest.requester_email} professorEmail:${recommendationRequest.professor_email} explanation: ${recommendationRequest.explanation} done: ${recommendationRequest.done}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/recommendationrequests/all"]
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
                <h1>Create New Recommendation Request</h1>

                <RecommendationRequestForm submitAction={onSubmit} />

            </div>
        </BasicLayout>
    )
}
