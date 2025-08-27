package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.Favorites;

public class FavoritesResponseDto {
    
    private Integer id;
    private Integer serviceProviderId;
    private String serviceProviderName;
    private Integer serviceProviderRating;
    private String serviceProviderSpecialty;

    public FavoritesResponseDto(Favorites favorites) {
        this.id = favorites.getId();
        this.serviceProviderId = favorites.getServiceProvider().getId();
        this.serviceProviderName = favorites.getServiceProvider().getName();
        this.serviceProviderRating = 5;
        this.serviceProviderSpecialty = favorites.getServiceProvider().getSpecialty();
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

    public String getServiceProviderName() {
        return serviceProviderName;
    }

    public void setServiceProviderName(String serviceProviderName) {
        this.serviceProviderName = serviceProviderName;
    }

    public Integer getServiceProviderRating() {
        return serviceProviderRating;
    }

    public void setServiceProviderRating(Integer serviceProviderRating) {
        this.serviceProviderRating = serviceProviderRating;
    }

    public String getServiceProviderSpecialty() {
        return serviceProviderSpecialty;
    }

    public void setServiceProviderSpecialty(String serviceProviderSpecialty) {
        this.serviceProviderSpecialty = serviceProviderSpecialty;
    }
    
}
