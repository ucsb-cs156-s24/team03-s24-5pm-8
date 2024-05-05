const recommendationRequestFixtures = {
    oneRecommendationRequest: {
        "id": 1,
        "requesterEmail": "requesterEmailData1",
        "professorEmail": "professorEmailData1",
        "explanation": "explanationData1",
        "dateRequested": "2022-01-02T12:00:00",
        "dateFulfilled": "2022-01-03T12:00:00",
        "done": "false"
    },
    threeRecommendationRequests: [
        {
            "id": 1,
            "requesterEmail": "requesterEmailData2",
            "professorEmail": "professorEmailData2",
            "explanation": "explanationData2",
            "dateRequested": "2022-02-02T12:00:00",
            "dateFulfilled": "2022-03-03T12:00:00",
            "done": "false"
        },
        {
            "id": 2,
            "requesterEmail": "requesterEmailData3",
            "professorEmail": "professorEmailData3",
            "explanation": "explanationData3",
            "dateRequested": "2022-01-04T12:00:00",
            "dateFulfilled": "2022-01-05T12:00:00",
            "done": "false"
        },
        {
            "id": 3,
            "requesterEmail": "requesterEmailData4",
            "professorEmail": "professorEmailData4",
            "explanation": "explanationData4",
            "dateRequested": "2022-01-06T12:00:00",
            "dateFulfilled": "2022-01-07T12:00:00",
            "done": "false"
        }
    ]
};

export { recommendationRequestFixtures };
