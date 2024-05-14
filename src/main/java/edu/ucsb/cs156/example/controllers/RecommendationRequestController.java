package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.time.LocalDateTime;

@Tag(name = "RecommendationRequests")
@RequestMapping("/api/recommendationrequests")
@RestController
@Slf4j
public class RecommendationRequestController extends ApiController {

    @Autowired
    RecommendationRequestRepository recommendationRequestRepository;

    @Operation(summary = "List all recommendation requests")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<RecommendationRequest> allRecommendationRequests() {
        Iterable<RecommendationRequest> requests = recommendationRequestRepository.findAll();
        return requests;
    }

    @Operation(summary = "Get a recommendation request by ID")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public RecommendationRequest getRecommendationRequestById(@Parameter(name = "id") @RequestParam long id) {
        RecommendationRequest request = recommendationRequestRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));
        return request;

    }


    @Operation(summary = "Create a new recommendation request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public RecommendationRequest postRecommendationDate(
            @Parameter(name = "requester_email") @RequestParam String requester_email,
            @Parameter(name = "professor_email") @RequestParam String professor_email,
            @Parameter(name = "explanation") @RequestParam String explanation,
            @Parameter(name = "date_requested") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date_requested,
            @Parameter(name = "date_needed") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date_needed,
            @Parameter(name = "done") @RequestParam boolean done)  
            
            throws JsonProcessingException {
        RecommendationRequest requestToPost = new RecommendationRequest();
        
        log.info("date_requested:", date_requested);
        log.info("date_needed:", date_needed);

        requestToPost.setRequester_email(requester_email);
        requestToPost.setProfessor_email(professor_email);
        requestToPost.setExplanation(explanation);
        requestToPost.setDate_requested(date_requested);
        requestToPost.setDate_needed(date_needed);
        requestToPost.setDone(done);


        

        RecommendationRequest savedRequest = recommendationRequestRepository.save(requestToPost);

        return savedRequest;
    }

    @Operation(summary = "Delete a recommendation request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteRecommendationRequest(@Parameter(name = "id") @RequestParam long id) {
        RecommendationRequest request = recommendationRequestRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));
        recommendationRequestRepository.delete(request);
        return genericMessage("record %s deleted".formatted(id));
    }

    @Operation(summary = "Update a single recommendation request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public RecommendationRequest updateRecommendationRequest(@Parameter(name = "id") @RequestParam Long id,
            @RequestBody @Valid RecommendationRequest incoming) {
        RecommendationRequest recommendationRequest = recommendationRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

        recommendationRequest.setRequester_email(incoming.getRequester_email());
        recommendationRequest.setProfessor_email(incoming.getProfessor_email());
        recommendationRequest.setExplanation(incoming.getExplanation());
        recommendationRequest.setDate_requested(incoming.getDate_requested());
        recommendationRequest.setDate_needed(incoming.getDate_needed());
        recommendationRequest.setDone(incoming.getDone());

        recommendationRequestRepository.save(recommendationRequest);

        return recommendationRequest;

    }


}