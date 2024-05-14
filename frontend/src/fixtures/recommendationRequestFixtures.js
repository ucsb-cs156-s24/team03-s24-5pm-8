const recommendationRequestFixtures = {
    oneRecommendationRequest: {
        "id": 1,
        "requester_email": "requester_email1@gmail.com",
        "professor_email": "professor_email1@gmail.com",
        "explanation": "explanationData1",
        "date_requested": "2022-01-02T12:00:00",
        "date_needed": "2022-01-03T12:00:00",
        "done": "true"
    },
    threeRecommendationRequests: [
        {
            "id": 1,
            "requester_email": "requester_email2@gmail.com",
            "professor_email": "professor_email2@gmail.com",
            "explanation": "explanationData2",
            "date_requested": "2022-02-02T12:00:00",
            "date_needed": "2022-03-03T12:00:00",
            "done": "false"
        },
        {
            "id": 2,
            "requester_email": "requester_email3@gmail.com",
            "professor_email": "professor_email3@gmail.com",
            "explanation": "explanationData3",
            "date_requested": "2022-01-04T12:00:00",
            "date_needed": "2022-01-05T12:00:00",
            "done": "true"
        },
        {
            "id": 3,
            "requester_email": "requester_email4@gmail.com",
            "professor_email": "professor_email4@gmail.com",
            "explanation": "explanationData4",
            "date_requested": "2022-01-06T12:00:00",
            "date_needed": "2022-01-07T12:00:00",
            "done": "false"
        }
    ]
};

export { recommendationRequestFixtures };
