package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.dtos.UserPersonalDataRequestDto;
import br.com.dotgo.dotgo.dtos.UserPersonalDataResponseDto;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.repositories.UserRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Date;

@RestController
@RequestMapping("/cadastroUsuario")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //POST para postar os dados pessoais de uma pessoa
    @PostMapping
    public UserPersonalDataResponseDto cadastrarDadosPessoais(
            @RequestBody UserPersonalDataRequestDto request
            ) {
        User novo = new User();

        novo.setRole(request.getRole());
        novo.setName(request.getName());
        novo.setEmail(request.getEmail());
        novo.setTax_id(request.getTax_id());
        novo.setPhone(request.getPhone());
        novo.setPassword(request.getPassword());
        novo.setBirthday(request.getBirthday());
        LocalDate dataAtual = LocalDate.now();
        novo.setCreated_at(dataAtual);

        this.userRepository.save(novo);
        return new UserPersonalDataResponseDto(novo);
    }


}
