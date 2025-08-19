package br.com.dotgo.dotgo.dtos;

public class CategoryResponseDto {
    private Integer id;
    private String name;
    private String icon;
    private String iconUrl;

    public CategoryResponseDto() {
    }

    public CategoryResponseDto(Integer id, String name, String icon, String iconUrl) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.iconUrl = iconUrl;
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
    
}
