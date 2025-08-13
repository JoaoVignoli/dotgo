package br.com.dotgo.dotgo.dtos;

import jakarta.validation.constraints.NotNull;

public class CategoryRequestDto {
    @NotNull
    private String name;

    public CategoryRequestDto() {
    }

    public CategoryRequestDto(@NotNull String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
}
