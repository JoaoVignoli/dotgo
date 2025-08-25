package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.Favorites;

public class FavoritesResponseDto {
    
    private Integer id;
    private Integer serviceProviderId;

    public FavoritesResponseDto(Favorites favorites) {
        this.id = favorites.getId();
        this.serviceProviderId = favorites.getServiceProvider().getId();
    }

    public FavoritesResponseDto() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getServiceProviderId() {
        return serviceProviderId;
    }

    public void setServiceProviderId(Integer serviceProviderId) {
        this.serviceProviderId = serviceProviderId;
    }
    
}
