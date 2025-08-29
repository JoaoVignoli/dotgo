package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.dtos.ServiceOrderRequestDto;
import br.com.dotgo.dotgo.dtos.ServiceOrderResponseDto;
import br.com.dotgo.dotgo.entities.ServiceOrder;
import br.com.dotgo.dotgo.repositories.ProductRepository;
import br.com.dotgo.dotgo.repositories.ServiceOrderRepository;
import br.com.dotgo.dotgo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/service-orders")
public class ServiceOrderController {

    private final ServiceOrderRepository serviceOrderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;


    public ServiceOrderController(ServiceOrderRepository serviceOrderRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.serviceOrderRepository = serviceOrderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    //Metodo para a criação de uma nova ordem de serviço
    @PostMapping
    public ServiceOrderResponseDto createServiceOrder(
            @RequestBody ServiceOrderRequestDto request
            ) {

        //Inicia a nova ServiceOrder
        ServiceOrder novo = new ServiceOrder();

        //Adiciona todos os atributos do request a nova ServiceOrder
        novo.setUser(userRepository.findById(request.getClientId()).get());
        novo.setProduct(productRepository.findById(request.getProductId()).get());
        novo.setTotal_value(request.getTotal_value());
        novo.setObservation(request.getObservation());
        novo.setCreatedAt(LocalDateTime.now());
        novo.setInitialDate(request.getInitialDate());
        novo.setPreviousEndDate(request.getPreviousEndDate());
        novo.setApproval(request.getApproval());
        novo.setWaitApproval(request.getWaitApproval());
        novo.setUserApproval(request.getUserApproval());

        //Salva a nova ServiceOrder no banco de dados
        this.serviceOrderRepository.save(novo);
        
        return new ServiceOrderResponseDto(novo);
    }
}


