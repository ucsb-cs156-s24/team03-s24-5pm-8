package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

import java.time.LocalDate;
import java.time.LocalDateTime;


@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestIT {
    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    RecommendationRequestRepository recommendationRequestRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @MockBean
    UserRepository userRepository;

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
        LocalDateTime dates = LocalDateTime.parse("2024-02-02T00:00:00");

        RecommendationRequest recommendationRequest = RecommendationRequest.builder()
                .id(1)
                .requester_email("request@gmail.com")
                .professor_email("prof@gmail.com")
                .explanation("asd")
                .date_requested(dates)
                .date_needed(dates)
                .done(true)
                .build();

        recommendationRequestRepository.save(recommendationRequest);

        MvcResult response = mockMvc.perform(get("/api/recommendationrequests?id=1")
            .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

        String expectedJson = mapper.writeValueAsString(recommendationRequest);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_recommendation_request() throws Exception {
        LocalDateTime dates = LocalDateTime.parse("2024-02-02T00:00:00");
        RecommendationRequest recommendationRequest1 = RecommendationRequest.builder()
                .id(1)
                .requester_email("request@gmail.com")
                .professor_email("prof@gmail.com")
                .explanation("asd")
                .date_requested(dates)
                .date_needed(dates)
                .done(true)
                .build();

        // act
        MvcResult response = mockMvc.perform(
                post("/api/recommendationrequests/post?requester_email=request@gmail.com&professor_email=prof@gmail.com&explanation=asd&date_requested=2024-02-02T00:00:00&date_needed=2024-02-02T00:00:00&done=true")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        String expectedJson = mapper.writeValueAsString(recommendationRequest1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }
}