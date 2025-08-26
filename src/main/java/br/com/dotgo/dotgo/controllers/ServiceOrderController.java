package br.com.dotgo.dotgo.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/service-orders")
public class ServiceOrderController {

    @PostMapping
    private ResponseEntity<?> createServiceOrder() {
        
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}


