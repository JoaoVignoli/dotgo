package br.com.dotgo.dotgo.dtos;

public class SubcategoryResponseDto {
    private Integer id;
    private String name;
    private Integer categoryId;
    private String icon;
    private String iconUrl;
    private Boolean isLeaf;

    public SubcategoryResponseDto() {
    }

    public SubcategoryResponseDto(Integer id, String name, Integer categoryId, String icon, String iconUrl) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.icon = icon;
        this.iconUrl = iconUrl;
        this.isLeaf = true;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public Boolean getIsLeaf() {
        return isLeaf;
    }

    public void setIsLeaf(Boolean isLeaf) {
        this.isLeaf = isLeaf;
    }
    
}
