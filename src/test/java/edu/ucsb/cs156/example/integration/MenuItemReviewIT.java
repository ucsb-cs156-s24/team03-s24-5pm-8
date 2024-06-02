package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

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

import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

import java.time.LocalDateTime;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewIT {
    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    MenuItemReviewRepository menuItemReviewRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @MockBean
    UserRepository userRepository;

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
        // arrange
        LocalDateTime ldt = LocalDateTime.parse("2023-06-19T11:00:00");

        MenuItemReview review = MenuItemReview.builder()
                .itemId(1L)
                .reviewerEmail("xinyaosong@ucsb.edu")
                .stars(5)
                .dateReviewed(ldt)
                .comments("Amazing food!")
                .build();

        menuItemReviewRepository.save(review);

        // act
        MvcResult response = mockMvc.perform(get("/api/MenuItemReview?id=1"))
                .andExpect(status().isOk()).andReturn();

        // assert
        String expectedJson = mapper.writeValueAsString(review);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_menu_item_review() throws Exception {
        // arrange
        LocalDateTime ldt = LocalDateTime.parse("2023-06-19T11:00:00");

        MenuItemReview review = MenuItemReview.builder()
                .id(1L)
                .itemId(1L)
                .reviewerEmail("xinyaosong@ucsb.edu")
                .stars(5)
                .dateReviewed(ldt)
                .comments("Amazing food!")
                .build();

        // act
        MvcResult response = mockMvc.perform(
                post("/api/MenuItemReview/post?itemId=1&reviewerEmail=xinyaosong@ucsb.edu&stars=5&dateReviewed=2023-06-19T11:00:00&comments=Amazing food!")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        // directly assert each field of the MenuItemReview object as the id field is
        // auto-generated,
        // which causes fialure in assertEquals(expectedJson, responseString);
        String expectedJson = mapper.writeValueAsString(review);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

}
