package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.repositories.ProductRepository;
import br.com.dotgo.dotgo.repositories.ServiceOrderRepository;
import br.com.dotgo.dotgo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping
    private ResponseEntity<?> createServiceOrder() {


        
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}


