package br.com.dotgo.dotgo.dtos;

import jakarta.validation.constraints.NotNull;

public class SubcategoryRequestDto {
    @NotNull
    private String name;
    @NotNull
    private Integer categoryId;

    public SubcategoryRequestDto() {
    }

    public SubcategoryRequestDto(@NotNull String name, @NotNull Integer categoryId) {
        this.name = name;
        this.categoryId = categoryId;
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
        
}
