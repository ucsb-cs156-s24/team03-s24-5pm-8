const helpRequestFixtures = {
    oneHelpRequest: {
        "id": 1,
        "requesterEmail": "hannaneh@ucsb.edu",
        "teamId": "s24-5pm-8",
        "tableOrBreakoutRoom": "8",
        "requestTime": "2022-01-03T00:00:00",
        "explanation": "Need help with Swagger",
        "solved": false
    },
    threeHelpRequests: [
        {
            "id": 1,
            "requesterEmail": "hannaneh@ucsb.edu",
            "teamId": "s24-5pm-8",
            "tableOrBreakoutRoom": "8",
            "requestTime": "2022-01-02T12:00:00",
            "explanation": "Need help with Swagger",
            "solved": false
        },
        {
            "id": 2,
            "requesterEmail": "xuser@ucsb.edu",
            "teamId": "s24-5pm-7",
            "tableOrBreakoutRoom": "10",
            "requestTime": "2023-01-03T12:00:00",
            "explanation": "Dokku problems",
            "solved": false
        },
        {
            "id": 3,
            "requesterEmail": "xinyaosong@ucsb.edu",
            "teamId": "s24-5pm-6",
            "tableOrBreakoutRoom": "6",
            "requestTime": "2024-01-04T12:00:00",
            "explanation": "Merge conflict",
            "solved": true
        }
    ]
};


export { helpRequestFixtures };