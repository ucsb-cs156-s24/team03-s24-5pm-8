import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";

import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/recommendationRequestUtils";


export default function RecommendationRequestTable({ recommendationRequests, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/recommendationrequests/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/recommendationrequests/all"]
    );
    // Stryker restore all

    // Stryker disable next-line all
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }
    
    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: "Requester email",
            accessor: "requester_email"
        },
        {
            Header: "Professor email",
            accessor: "professor_email"
        },
        {
            Header: "Explanation",
            accessor: "explanation"
        },
        {
            Header: "Date Requested",
            accessor: "date_requested"
        },
        {
            Header: "Date Needed",
            accessor: "date_needed"
        },
        {
            Header: "Done",
            accessor: "done",
            Cell: ({ cell }) => cell.value ? "true" : "false"
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "RecommendationRequestTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "RecommendationRequestTable"));
    }

    return <OurTable
        data={recommendationRequests}
        columns={columns}
        testid={"RecommendationRequestTable"}
    />;

};
