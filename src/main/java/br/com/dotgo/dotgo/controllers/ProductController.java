package br.com.dotgo.dotgo.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.dotgo.dotgo.dtos.ProductCreateDto;
import br.com.dotgo.dotgo.entities.Product;
import br.com.dotgo.dotgo.entities.ProductAssignment;
import br.com.dotgo.dotgo.entities.ProductPicture;
import br.com.dotgo.dotgo.entities.Subcategory;
import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.repositories.ProductAssignmentRepository;
import br.com.dotgo.dotgo.repositories.ProductPictureRepository;
import br.com.dotgo.dotgo.repositories.ProductRepository;
import br.com.dotgo.dotgo.repositories.SubcategoryRepository;
import br.com.dotgo.dotgo.repositories.UserRepository;
import br.com.dotgo.dotgo.services.FileStorageService;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private final ProductAssignmentRepository productAssignmentRepository;
    private final ProductPictureRepository productPictureRepository;
    private final UserRepository userRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final FileStorageService fileStorageService;
    private static final String PRODUCTS_PICTURES_FOLDER = "pictures/products"; 

    public ProductController(
        ProductRepository productRepository, ProductAssignmentRepository productAssignmentRepository, 
        ProductPictureRepository productPictureRepository, UserRepository userRepository, 
        SubcategoryRepository subcategoryRepository, FileStorageService fileStorageService
    ) {
        this.productRepository = productRepository;
        this.productAssignmentRepository = productAssignmentRepository;
        this.productPictureRepository = productPictureRepository;
        this.userRepository = userRepository;
        this.subcategoryRepository = subcategoryRepository;
        this.fileStorageService = fileStorageService;
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

        var productSaved = this.productRepository.save(newProduct);

        ProductAssignment newProductAssigment = new ProductAssignment();
        newProductAssigment.setSubcategory(subcategory.get());
        newProductAssigment.setUser(serviceHolder.get());
        newProductAssigment.setProduct(productSaved);

        this.productAssignmentRepository.save(newProductAssigment);

        ArrayList<MultipartFile> productPictures = productCreateDto.getPictures();

        if (productPictures == null) {
            productPictures = new ArrayList<>();
        }

        ArrayList<String> picturesUrls = new ArrayList<>();
        String folderPathWithId = PRODUCTS_PICTURES_FOLDER + "/" + productSaved.getId();
        
        if (productPictures.size() == 0) {
            picturesUrls.add(subcategory.get().getIcon());
        } else {
            for (MultipartFile picture : productPictures) {
                picturesUrls.add(this.fileStorageService.uploadFile(picture, folderPathWithId));
            }
        }

        for (String url : picturesUrls) {
            ProductPicture productPicture = new ProductPicture();
            productPicture.setProduct(productSaved);
            productPicture.setUrl(url);
            this.productPictureRepository.save(productPicture);
        }



        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    
}
