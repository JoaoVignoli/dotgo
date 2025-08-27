package br.com.dotgo.dotgo.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import br.com.dotgo.dotgo.dtos.ProductCreateDto;
import br.com.dotgo.dotgo.dtos.ProductResponseDto;
import br.com.dotgo.dotgo.entities.Product;
import br.com.dotgo.dotgo.entities.Subcategory;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.repositories.ProductRepository;
import br.com.dotgo.dotgo.repositories.SubcategoryRepository;
import br.com.dotgo.dotgo.repositories.UserRepository;
import br.com.dotgo.dotgo.services.FileStorageService;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final FileStorageService fileStorageService;
    private static final String PRODUCTS_PICTURES_FOLDER = "pictures/products"; 

    public ProductController(
        ProductRepository productRepository,UserRepository userRepository, 
        SubcategoryRepository subcategoryRepository, FileStorageService fileStorageService
    ) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.subcategoryRepository = subcategoryRepository;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<?> createNewProduct(
        @RequestBody @Valid ProductCreateDto productCreateDto
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
        newProduct.setSubcategory(subcategory.get());
        newProduct.setUser(serviceHolder.get());

        var productSaved = this.productRepository.save(newProduct);

        this.productRepository.save(productSaved);

        ProductResponseDto response = new ProductResponseDto(productSaved);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{productId}/upload")
    public ResponseEntity<?> saveProductPicture (@RequestParam("picture") MultipartFile picture, @PathVariable Integer productId) {

        Optional<Product> product = this.productRepository.findById(productId);

        if (product.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Produto não localizado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        String folderPathWithId = PRODUCTS_PICTURES_FOLDER + "/" + productId;

        String status = fileStorageService.uploadFile(picture, folderPathWithId);

        product.get().setPicture(status);

        this.productRepository.save(product.get());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
