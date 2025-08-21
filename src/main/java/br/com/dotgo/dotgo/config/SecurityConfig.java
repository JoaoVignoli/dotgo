package br.com.dotgo.dotgo.config;

import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import br.com.dotgo.dotgo.filters.JwtAuthFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource; 

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http ) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable( )) // Forma moderna de desabilitar o CSRF
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Essencial para APIs REST com JWT
                .authorizeHttpRequests(auth -> auth                      
                        // Suas outras rotas públicas
                        .requestMatchers(
                            "/auth/login", "/login", "/login.html",
                            "/users", // Mantenha isso se houver outras rotas GET públicas em /users
                            "/registerRole", "/registerRole.html",
                            "/personalInfoRegister", "/personalInfoRegister.html",
                            "/perfilPhoto", "/perfilPhoto.html",
                            "/addressRegister", "/addressRegister.html",
                            "/home", "/home.html",  
                            "/products/**","/newProduct", "/newProduct.html", 
                            "/categories/**", "/productCategories", "/productCategories.html",
                            "/subcategories/**", "/productSubcategories", "/productSubcategories.html",
                            "/css/**", "/js/**"
                        ).permitAll()
                        
                        // Exija autenticação para todas as outras rotas
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build( );
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}