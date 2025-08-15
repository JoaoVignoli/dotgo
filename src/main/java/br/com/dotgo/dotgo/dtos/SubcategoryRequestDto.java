package br.com.dotgo.dotgo.dtos;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SubcategoryRequestDto {
    @NotBlank(message = "O nome da subcategoria é obrigatório.")
    private String name;
    @NotNull(message = "Necessário informar o id da categoria pai.")
    private Integer categoryId;
    @NotNull(message = "O icone da subcategoria é obrigatório.")
    private MultipartFile icon;

    public SubcategoryRequestDto() {
    }

    public SubcategoryRequestDto(@NotBlank String name, @NotNull Integer categoryId, @NotNull MultipartFile icon) {
        this.name = name;
        this.categoryId = categoryId;
        this.icon = icon;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public MultipartFile getIcon() {
        return icon;
    }

    public void setIcon(MultipartFile icon) {
        this.icon = icon;
    }

}
