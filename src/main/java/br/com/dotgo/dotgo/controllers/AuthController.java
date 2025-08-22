package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.dtos.LoginRequestDto;
import br.com.dotgo.dotgo.services.JWTService;
import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JWTService jwtService;

    public AuthController(
        UserDetailsService userDetailsService, JWTService jwtService, 
        PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager
    ) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request, HttpServletResponse response) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        if (authentication.isAuthenticated()) {
            UserDetails user = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtService.generateToken(user);

            Cookie cookie = new Cookie("jwt_token", token);
            cookie.setHttpOnly(true); // Impede acesso via JavaScript
            cookie.setSecure(true);   // Envia apenas em HTTPS (use true em produção)
            cookie.setPath("/");      // Disponível para todo o site
            cookie.setMaxAge(60 * 60); // 1 hora (tempo de vida do cookie em segundos)

            response.addCookie(cookie);
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(401).body("Credenciais inválidas");
        }     

    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("jwt_token", null); // Seta o valor como nulo
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Expira o cookie imediatamente

        response.addCookie(cookie);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAuthStatus() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> response = new HashMap<>();

        // Verifica se o usuário está autenticado e não é o usuário anônimo padrão do Spring Security
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated() &&
                                  !(authentication.getPrincipal() instanceof String && authentication.getPrincipal().equals("anonymousUser"));

        response.put("isAuthenticated", isAuthenticated);

        if (isAuthenticated) {
            // Se autenticado, adicione informações do usuário
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            response.put("username", userDetails.getUsername());
            // Você pode adicionar mais dados do usuário aqui, se precisar no frontend
        }

        return ResponseEntity.ok(response);
    }
}
