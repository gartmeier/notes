package dev.gartmeier.notes;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.oauth2.jwt.JwtDecoder;

@SpringBootTest
class ApplicationTests {

	@MockitoBean
	JwtDecoder jwtDecoder;

	@Test
	void contextLoads() {
	}

}
