package br.com.dotgo.dotgo.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import br.com.dotgo.dotgo.dtos.LoginResult;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.enums.UserRole;
import br.com.dotgo.dotgo.repositories.UserRepository;

import jakarta.servlet.http.Cookie;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JWTService jwtService;
    private final UserRepository userRepository;

    public AuthService(
        AuthenticationManager authenticationManager,
        UserDetailsService userDetailsService,
        JWTService jwtService,
        UserRepository userRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    public LoginResult login(String email, String password) {
        try {
            // Autenticar usuário
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );
            
            if (!authentication.isAuthenticated()) {
                return LoginResult.failure("Credenciais inválidas");
            }
            
            // Carregar detalhes do usuário e gerar token
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            String token = jwtService.generateToken(userDetails);
            
            // Buscar dados adicionais do usuário
            Optional<User> user = userRepository.findByEmail(email);
            
            return LoginResult.success(token, user.orElse(null));
            
        } catch (BadCredentialsException e) {
            return LoginResult.failure("Email ou senha incorretos");
        } catch (Exception e) {
            return LoginResult.failure("Erro interno durante autenticação");
        }
    }

    
    // Cria cookie JWT com configurações de segurança
    public Cookie createJwtCookie(String token) {
        Cookie cookie = new Cookie("jwt_token", token);
        cookie.setHttpOnly(true);  // Impede acesso via JavaScript
        cookie.setSecure(true);    // Envia apenas em HTTPS
        cookie.setPath("/");       // Disponível para todo o site
        cookie.setMaxAge(60 * 60); // 1 hora
        return cookie;
    }
    
    // Cria cookie para logout (expira imediatamente)

    public Cookie createLogoutCookie() {
        Cookie cookie = new Cookie("jwt_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Expira imediatamente
        return cookie;
    }

    // Verifica se o usuário está autenticado
    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && 
               authentication.isAuthenticated() &&
               !(authentication.getPrincipal() instanceof String && 
                 authentication.getPrincipal().equals("anonymousUser"));
    }
    
    // Retorna o Authentication atual
    public Authentication getCurrentAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }
    
    // Retorna informações do usuário autenticado
    public Map<String, Object> getAuthStatus() {
        Authentication authentication = getCurrentAuthentication();
        Map<String, Object> response = new HashMap<>();
        
        boolean isAuthenticated = isAuthenticated();
        response.put("isAuthenticated", isAuthenticated);
        
        if (isAuthenticated) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            response.put("userName", userDetails.getUsername());
            
            // Buscar dados adicionais do usuário se necessário
            Optional<User> user = userRepository.findByEmail(userDetails.getUsername());
            if (user.isPresent()) {
                response.put("userId", user.get().getId());
                response.put("userRole", user.get().getRole());
            }
        }
        
        return response;
    }
    
    // Retorna o usuário atual autenticado
    public Optional<User> getCurrentUser() {
        if (!isAuthenticated()) {
            return Optional.empty();
        }
        
        Authentication authentication = getCurrentAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername());
    }
    
    // Retorna as roles que o usuário atual pode acessar
    public List<UserRole> getAccessibleRoles() {
        Optional<User> currentUser = getCurrentUser();
        
        // Usuário não autenticado - apenas prestadores públicos
        if (currentUser.isEmpty()) {
            return List.of(UserRole.SERVICE_HOLDER);
        }
        
        User user = currentUser.get();
        
        // Admin pode acessar todas as roles
        if (user.getRole() == UserRole.ADMIN) {
            return List.of(UserRole.values());
        }
        
        // Cliente pode ver apenas prestadores
        if (user.getRole() == UserRole.CLIENT) {
            return List.of(UserRole.SERVICE_HOLDER);
        }
        
        // Prestador pode ver apenas outros prestadores
        if (user.getRole() == UserRole.SERVICE_HOLDER) {
            return List.of(UserRole.SERVICE_HOLDER);
        }
        
        // Fallback - nenhuma role acessível
        return List.of();
    }
    
    // Verifica se o usuário pode acessar uma role específica
    public boolean canAccessRole(UserRole targetRole) {
        return getAccessibleRoles().contains(targetRole);
    }
    
    // Verifica se o usuário pode acessar dados específicos de outro usuário
    // (Para dados privados como email, telefone, etc.)
    public boolean canAccessSpecificUser(Integer targetUserId) {
        Optional<User> currentUser = getCurrentUser();
        
        if (currentUser.isEmpty()) {
            return false; // Usuário não autenticado não pode acessar dados privados
        }
        
        User user = currentUser.get();
        
        // Admin pode acessar qualquer usuário
        if (user.getRole() == UserRole.ADMIN) {
            return true;
        }
        
        // Usuário pode acessar apenas seus próprios dados privados
        return user.getId().equals(targetUserId);
    }
    
    // Método mantido para compatibilidade (deprecated)
    @Deprecated
    public List<UserRole> canAccessUser(Integer targetUserId) {
        return getAccessibleRoles();
    }

    // Verifica se o usuário atual é admin
    public boolean isCurrentUserAdmin() {
        Optional<User> currentUser = getCurrentUser();
        return currentUser.map(user -> user.getRole() == UserRole.ADMIN).orElse(false);
    }
    
    // Verifica se o usuário atual é prestador de serviço
    public boolean isCurrentUserServiceHolder() {
        Optional<User> currentUser = getCurrentUser();
        return currentUser.map(user -> user.getRole() == UserRole.SERVICE_HOLDER).orElse(false);
    }
    
    // Retorna o ID do usuário atual (se autenticado)
    public Optional<Integer> getCurrentUserId() {
        return getCurrentUser().map(User::getId);
    }
    
    // Verifica se o usuário atual é o proprietário dos dados
    public boolean isOwner(Integer targetUserId) {
        return getCurrentUserId().map(id -> id.equals(targetUserId)).orElse(false);
    }
    
    // Retorna informações completas do status de autenticação
    public Map<String, Object> getCompleteAuthStatus() {
        Map<String, Object> status = getAuthStatus();
        
        if ((Boolean) status.get("isAuthenticated")) {
            Optional<User> user = getCurrentUser();
            if (user.isPresent()) {
                status.put("userRole", user.get().getRole());
                status.put("userName", user.get().getName());
                status.put("accessibleRoles", getAccessibleRoles());
                status.put("isAdmin", isCurrentUserAdmin());
            }
        } else {
            status.put("accessibleRoles", getAccessibleRoles());
            status.put("isAdmin", false);
        }
        
        return status;
    }
}
