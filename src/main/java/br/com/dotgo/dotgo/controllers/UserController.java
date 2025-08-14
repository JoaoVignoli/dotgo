package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.dtos.UserPersonalDataRequestDto;
import br.com.dotgo.dotgo.dtos.UserPersonalDataResponseDto;
import br.com.dotgo.dotgo.repositories.UserRepository;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cadastroUsuario")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }




    //POST para solicitar os dados pessoais de uma pessoa
    public UserPersonalDataResponseDto cadastrarDadosPessoais(
            @RequestBody UserPersonalDataRequestDto request
            ) {

    }


}
