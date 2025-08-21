package br.com.dotgo.dotgo.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.dotgo.dotgo.dtos.ProductCreateDto;
import br.com.dotgo.dotgo.entities.Product;
import br.com.dotgo.dotgo.entities.ProductAssigment;
import br.com.dotgo.dotgo.entities.Subcategory;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.repositories.ProductAssigmentRepository;
import br.com.dotgo.dotgo.repositories.ProductPictureRepository;
import br.com.dotgo.dotgo.repositories.ProductRepository;
import br.com.dotgo.dotgo.repositories.SubcategoryRepository;
import br.com.dotgo.dotgo.repositories.UserRepository;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductAssigmentRepository productAssigmentRepository;
    private final ProductPictureRepository productPictureRepository;
    private final UserRepository userRepository;
    private final SubcategoryRepository subcategoryRepository;
    private static final String CATEGORY_PICTURES_FOLDER = "pictures/products"; 

    public ProductController(
        ProductRepository productRepository, ProductAssigmentRepository productAssigmentRepository, 
        ProductPictureRepository productPictureRepository, UserRepository userRepository, SubcategoryRepository subcategoryRepository
    ) {
        this.productRepository = productRepository;
        this.productAssigmentRepository = productAssigmentRepository;
        this.productPictureRepository = productPictureRepository;
        this.userRepository = userRepository;
        this.subcategoryRepository = subcategoryRepository;
    }

    @PostMapping
    public ResponseEntity<?> createNewProduct(
        @ModelAttribute @Valid ProductCreateDto productCreateDto
    ) {

        Optional<User> serviceHolder = userRepository.findById(productCreateDto.getServiceHolderId());
        Optional<Subcategory> subcategory = subcategoryRepository.findById(productCreateDto.getSubcategoryId());

        if (serviceHolder.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Usuário não localizado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        
        if (subcategory.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Subcategoria não localizada.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Product newProduct = new Product();
        newProduct.setName(productCreateDto.getName());
        newProduct.setPrice(productCreateDto.getPrice());
        newProduct.setDescription(productCreateDto.getDescription());
        newProduct.setEstimatedTime(productCreateDto.getEstimatedTime());
        newProduct.setAutoApprove(productCreateDto.getAutoApprove());
        newProduct.setPriceToBeAgreed(productCreateDto.getPriceToBeAgreed());
        newProduct.setReceiveAttachments(productCreateDto.getReceiveAttachments());
        newProduct.setTimeToBeAgreed(productCreateDto.getTimeToBeAgreed());
        newProduct.setCreatedAt(LocalDateTime.now());

        var savedProduct = this.productRepository.save(newProduct);

        ProductAssigment newProductAssigment = new ProductAssigment();

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    
}
