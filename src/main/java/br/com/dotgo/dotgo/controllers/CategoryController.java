package br.com.dotgo.dotgo.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.dotgo.dotgo.dtos.CategoryRequestDto;
import br.com.dotgo.dotgo.dtos.CategoryResponseDto;
import br.com.dotgo.dotgo.entities.Category;
import br.com.dotgo.dotgo.repositories.CategoryRepository;
import br.com.dotgo.dotgo.services.FileStorageService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;


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
        @RequestParam("file") MultipartFile categoryIcon,
        @ModelAttribute @Valid CategoryRequestDto categoryRequestDto
    ) {
        // Validando se o icone é válido.
        if (categoryIcon.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O ícone da categoria não pode ser vazio.");
        }

        // Criando categoria no banco de dados.
        Category newCategory = new Category();
        newCategory.setName(categoryRequestDto.getName());
        var savedCategory = this.categoryRepository.save(newCategory); 

        // Salvando icon da categoria no MinIO seu caminho será o CATEGORY_ICON_FOLDER (Padrão) + ID do objeto no banco.
        String folderPathWithId = CATEGORY_ICON_FOLDER + "/" + savedCategory.getId();
        String objectKey = this.fileStorageService.uploadFile(categoryIcon, folderPathWithId);

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

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
}
