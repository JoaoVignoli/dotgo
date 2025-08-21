package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.dtos.UserPersonalDataRequestDto;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.repositories.UserRepository;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody @Valid UserPersonalDataRequestDto request) {

        if (this.userRepository.findByEmail(request.getEmail()).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        User newUser = new User();

        newUser.setRole(request.getRole());
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setTaxId(request.getTaxId());
        newUser.setPhone(request.getPhone());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setBirthday(request.getBirthday());
        newUser.setCreatedAt(LocalDateTime.now());

        this.userRepository.save(newUser);
        
        // Ajustar para deixar o verificado como false
        // Ajustar retorno para que retorne um DTO
        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }

    @GetMapping
    public List<User> getUsers() {
        return this.userRepository.findAll();
    }
    

}
