package br.com.dotgo.dotgo.dtos;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CategoryRequestDto {
    @NotBlank(message = "O nome da categoria é obrigatório.")
    private String name;
    @NotNull(message = "O arquivo do ícone é obrigatório.")
    private MultipartFile icon;


    public CategoryRequestDto() {
    }

    public CategoryRequestDto(@NotBlank String name, @NotNull MultipartFile icon) {
        this.name = name;
        this.icon = icon;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public MultipartFile getIcon() {
        return icon;
    }

    public void setIcon(MultipartFile icon) {
        this.icon = icon;
    }
    
    
}
