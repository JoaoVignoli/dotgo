package br.com.dotgo.dotgo.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.dotgo.dotgo.dtos.CategoryRequestDto;
import br.com.dotgo.dotgo.dtos.SubcategoryRequestDto;
import br.com.dotgo.dotgo.dtos.SubcategoryResponseDto;
import br.com.dotgo.dotgo.entities.Category;
import br.com.dotgo.dotgo.entities.Subcategory;
import br.com.dotgo.dotgo.repositories.CategoryRepository;
import br.com.dotgo.dotgo.repositories.SubcategoryRepository;
import br.com.dotgo.dotgo.services.FileStorageService;
import jakarta.validation.Valid;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/subcategories")
public class SubcategoryController {

    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;
    private static final String SUBCATEGORY_ICON_FOLDER = "icons/subcategories";
    
    public SubcategoryController(
        SubcategoryRepository subcategoryRepository, CategoryRepository categoryRepository, FileStorageService fileStorageService
    ) {
        this.subcategoryRepository = subcategoryRepository;
        this.categoryRepository = categoryRepository;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<?> createNewSubcategory(
        @RequestParam("file") MultipartFile subcategoryIcon,
        @ModelAttribute @Valid SubcategoryRequestDto subcategoryRequestDto
    ) {
        
        if (subcategoryIcon.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O ícone da subcategoria não pode ser vazio."); 
        }

        Optional<Category> category = this.categoryRepository.findById(subcategoryRequestDto.getCategoryId());
        
        Subcategory newSubcategory = new Subcategory();
        newSubcategory.setName(subcategoryRequestDto.getName());
        newSubcategory.setCategory(category.get());

        var savedSubcategory = this.subcategoryRepository.save(newSubcategory);

        String folderPathWithId = SUBCATEGORY_ICON_FOLDER + "/" + savedSubcategory.getId();

        String objectKey = this.fileStorageService.uploadFile(subcategoryIcon, folderPathWithId);

        savedSubcategory.setIcon(objectKey);
        this.subcategoryRepository.save(savedSubcategory);
        
        String iconUrl = this.fileStorageService.getPublicFileUrl(objectKey);

        SubcategoryResponseDto response = new SubcategoryResponseDto(
            savedSubcategory.getId(),
            savedSubcategory.getName(),
            savedSubcategory.getCategory().getId(),
            savedSubcategory.getIcon(),
            iconUrl
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
}
