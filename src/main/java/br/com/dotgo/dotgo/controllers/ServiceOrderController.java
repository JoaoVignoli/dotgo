package br.com.dotgo.dotgo.controllers;

import br.com.dotgo.dotgo.dtos.ServiceOrderRequestDto;
import br.com.dotgo.dotgo.dtos.ServiceOrderResponseDto;
import br.com.dotgo.dotgo.entities.Product;
import br.com.dotgo.dotgo.entities.ServiceOrder;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.repositories.ProductRepository;
import br.com.dotgo.dotgo.repositories.ServiceOrderRepository;
import br.com.dotgo.dotgo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    public ResponseEntity<?> createServiceOrder(
            @RequestBody ServiceOrderRequestDto request
    ) {

        Optional<User> optionalClient = this.userRepository.findById(request.getClientId());
        Optional<User> optionalServiceProvider = this.userRepository.findById(request.getUserApproval());
        Optional<Product> optionalProduct = this.productRepository.findById(request.getProductId());

        if (optionalClient.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Cliente não localizado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        if (optionalServiceProvider.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Provedor de serviço não localizado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        if (optionalProduct.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Produto não localizado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User client = optionalClient.get();
        User serviceProvider = optionalServiceProvider.get();
        Product product = optionalProduct.get();
        
        //Inicia a nova ServiceOrder
        ServiceOrder newServiceOrder = new ServiceOrder();

        //Adiciona todos os atributos do request a nova ServiceOrder
        newServiceOrder.setClient(client);
        newServiceOrder.setProduct(product);
        newServiceOrder.setTotal_value(request.getTotal_value());
        newServiceOrder.setObservation(request.getObservation());
        newServiceOrder.setCreatedAt(LocalDateTime.now());
        newServiceOrder.setInitialDate(request.getInitialDate());
        newServiceOrder.setPreviousEndDate(request.getPreviousEndDate());
        newServiceOrder.setApproval(request.getApproval());
        newServiceOrder.setWaitApproval(request.getWaitApproval());
        newServiceOrder.setUserApproval(serviceProvider);

        //Salva a nova ServiceOrder no banco de dados
        ServiceOrder orderSaved = this.serviceOrderRepository.save(newServiceOrder);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(new ServiceOrderResponseDto(orderSaved));
    }

    @GetMapping
    public ResponseEntity<List<ServiceOrder>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(this.serviceOrderRepository.findAll());
    }
}


