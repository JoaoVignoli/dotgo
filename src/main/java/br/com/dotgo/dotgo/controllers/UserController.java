package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.dtos.UserPersonalDataRequestDto;
import br.com.dotgo.dotgo.dtos.UserPersonalDataResponseDto;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.repositories.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //POST para postar os dados pessoais de uma pessoa
    @PostMapping("/register")
    public UserPersonalDataResponseDto registerUser(@RequestBody UserPersonalDataRequestDto request) {

        User newUser = new User();

        newUser.setRole(request.getRole());
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setTax_id(request.getTaxId());
        newUser.setPhone(request.getPhone());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setBirthday(request.getBirthday());
        LocalDate dataAtual = LocalDate.now();
        newUser.setCreated_at(dataAtual);

        this.userRepository.save(newUser);
        return new UserPersonalDataResponseDto(newUser);
    }


}
