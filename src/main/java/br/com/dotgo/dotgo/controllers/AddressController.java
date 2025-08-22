package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.dtos.AddressRequestDto;
import br.com.dotgo.dotgo.dtos.AddressResponseDto;
import br.com.dotgo.dotgo.entities.Address;
import br.com.dotgo.dotgo.repositories.AddressRepository;
import br.com.dotgo.dotgo.repositories.UserRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/address")
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressController(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    //POST para coletar as informações e criar o endereço para o usuário
    @PostMapping
    public AddressResponseDto criarEndereco(
            @RequestBody AddressRequestDto request
            ) {
        Address novo = new Address();

        novo.setCep(request.getCep());
        novo.setStreet(request.getStreet());
        novo.setNeighborhood(request.getNeighborhood());
        novo.setCity(request.getCity());
        novo.setState(request.getState());
        novo.setAddress_number(request.getaddressNumber());

        novo.setUser(userRepository.findById(request.getUserId()).get());

        this.addressRepository.save(novo);
        return new AddressResponseDto(novo);
    }

}
