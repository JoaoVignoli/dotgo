package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.dtos.LoginRequestDto;
import br.com.dotgo.dotgo.dtos.LoginResult;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.services.AuthService;
import br.com.dotgo.dotgo.services.FileStorageService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final FileStorageService fileStorageService;
    
    public AuthController(AuthService authService, FileStorageService fileStorageService) {
        this.authService = authService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
        @RequestBody @Valid LoginRequestDto request, 
        HttpServletResponse response
    ) {
        try {
            LoginResult result = authService.login(
                request.getEmail(), 
                request.getPassword()
            );
            
            if (!result.isSuccess()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", result.getErrorMessage()));
            }
            
            // Criar e adicionar cookie
            Cookie jwtCookie = authService.createJwtCookie(result.getToken());
            response.addCookie(jwtCookie);
            
            // Retornar dados do usuário (opcional)
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Login realizado com sucesso");
            
            if (result.getUser() != null) {
                responseBody.put("user", Map.of(
                    "id", result.getUser().getId(),
                    "name", result.getUser().getName(),
                    "email", result.getUser().getEmail(),
                    "role", result.getUser().getRole()
                ));
            }
            
            return ResponseEntity.ok(responseBody);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erro interno do servidor"));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        try {
            // Criar cookie de logout
            Cookie logoutCookie = authService.createLogoutCookie();
            response.addCookie(logoutCookie);
            
            return ResponseEntity.ok(Map.of("message", "Logout realizado com sucesso"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erro interno do servidor"));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAuthStatus() {
        return ResponseEntity.ok(authService.getAuthStatus());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Optional<User> currentUser = authService.getCurrentUser();
            
            if (currentUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Usuário não autenticado"));
            }
            
            User user = currentUser.get();

            Map<String, Object> userData = new HashMap<>();
            userData.put("profilePicture", this.fileStorageService.getPublicFileUrl(user.getPicture()));
            userData.put("name", user.getName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            userData.put("verified", user.getVerified());
            userData.put("favorites", user.getServiceProvidersLikeds());
            userData.put("address", user.getAddresses());
            userData.put("phone", user.getPhone());
            userData.put("products", user.getProducts());
            userData.put("biography", user.getBiography());
            userData.put("especialty", user.getSpecialty());
            
            return ResponseEntity.ok(userData);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erro interno do servidor"));
        }
    }
}
