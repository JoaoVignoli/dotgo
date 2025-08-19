package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.dtos.LoginRequestDto;
import br.com.dotgo.dotgo.dtos.LoginResponseDto;
import br.com.dotgo.dotgo.repositories.UserRepository;
import br.com.dotgo.dotgo.services.JWTService;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
        UserRepository usuarioRepository, UserDetailsService userDetailsService, JWTService jwtService, PasswordEncoder passwordEncoder
    ) {
        this.userRepository = usuarioRepository;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody LoginRequestDto request) {
        UserDetails user = userDetailsService.loadUserByUsername(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Senha inválida");
        }

        String token = jwtService.generateToken(user);
        return new LoginResponseDto(token);
    }
}
