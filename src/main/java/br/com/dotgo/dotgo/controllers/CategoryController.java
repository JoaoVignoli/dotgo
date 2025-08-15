package br.com.dotgo.dotgo.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.dotgo.dotgo.dtos.CategoryRequestDto;
import br.com.dotgo.dotgo.dtos.CategoryResponseDto;
import br.com.dotgo.dotgo.dtos.SubcategoryResponseDto;
import br.com.dotgo.dotgo.entities.Category;
import br.com.dotgo.dotgo.entities.Subcategory;
import br.com.dotgo.dotgo.repositories.CategoryRepository;
import br.com.dotgo.dotgo.services.FileStorageService;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;
    private static final String CATEGORY_ICON_FOLDER = "icons/categories"; 

    public CategoryController(CategoryRepository categoryRepository, FileStorageService fileStorageService) {
        this.categoryRepository = categoryRepository;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<?> createNewCategory(
        @ModelAttribute @Valid CategoryRequestDto categoryRequestDto
    ) {

        // Criando categoria no banco de dados.
        Category newCategory = new Category();
        newCategory.setName(categoryRequestDto.getName());
        var savedCategory = this.categoryRepository.save(newCategory);

        // Salvando icon da categoria no MinIO seu caminho será o CATEGORY_ICON_FOLDER (Padrão) + ID do objeto no banco.
        String folderPathWithId = CATEGORY_ICON_FOLDER + "/" + savedCategory.getId();
        String objectKey = this.fileStorageService.uploadFile(categoryRequestDto.getIcon(), folderPathWithId);

        // Atualizando objeto no Banco de Dados com o caminho do arquivo no MinIO.
        savedCategory.setIcon(objectKey);
        this.categoryRepository.save(savedCategory);

        // Gerando URL para que possa ser exibida no FrontEnd.
        String iconUrl = this.fileStorageService.getPublicFileUrl(objectKey);

        CategoryResponseDto response = new CategoryResponseDto(
            savedCategory.getId(), 
            savedCategory.getName(), 
            savedCategory.getIcon(), 
            iconUrl
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping
    public ResponseEntity<List<CategoryResponseDto>> getCategories() {
        List<Category> categories = this.categoryRepository.findAll();

        ArrayList<CategoryResponseDto> response = new ArrayList<>();

        for (Category category : categories) {
            CategoryResponseDto categoryDto = new CategoryResponseDto(
                category.getId(),
                category.getName(),
                category.getIcon(),
                this.fileStorageService.getPublicFileUrl(category.getIcon())
            );
            
            response.add(categoryDto);
        }

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @GetMapping("/{categoryId}/subcategories")
    public ResponseEntity<List<SubcategoryResponseDto>> getMethodName(@PathVariable Integer categoryId) {

        Optional<Category> category = this.categoryRepository.findById(categoryId);

        if (category.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Subcategory> subcategories = category.get().getSubcategories();
        ArrayList<SubcategoryResponseDto> responseList = new ArrayList<>();
        
        for (Subcategory subcategory : subcategories) {
            SubcategoryResponseDto subcategoryResponseDto = new SubcategoryResponseDto(
                subcategory.getId(),
                subcategory.getName(),
                subcategory.getCategory().getId(),
                subcategory.getIcon(),
                this.fileStorageService.getPublicFileUrl(subcategory.getIcon())
            );

            responseList.add(subcategoryResponseDto);
        }

        return ResponseEntity.status(HttpStatus.OK).body(responseList);
    }
    
}
