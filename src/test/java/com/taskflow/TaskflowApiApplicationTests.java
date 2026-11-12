package com.taskflow;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.containsString;

@SpringBootTest(properties = "app.cors.allowed-origin=https://taskflow-ui.netlify.app")
@AutoConfigureMockMvc
class TaskflowApiApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
	}

	@Test
	void allowsPreflightRequestsFromConfiguredFrontend() throws Exception {
		mockMvc.perform(options("/api/tasks")
				.header("Origin", "https://taskflow-ui.netlify.app")
				.header("Access-Control-Request-Method", "POST"))
				.andExpect(status().isOk())
				.andExpect(header().string("Access-Control-Allow-Origin", "https://taskflow-ui.netlify.app"))
				.andExpect(header().string("Access-Control-Allow-Methods", containsString("POST")));
	}

}
