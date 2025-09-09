package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.Favorites;
import br.com.dotgo.dotgo.entities.User;

public class FavoritesResponseDto {
    
    private Integer id;
    private User serviceProvider;
    private String serviceProviderName;
    private Integer serviceProviderRating;
    private String serviceProviderSpecialty;

    public FavoritesResponseDto(Favorites favorites) {
        this.id = favorites.getId();
        this.serviceProvider = favorites.getServiceProvider();
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

    public User getServiceProvider() {
        return serviceProvider;
    }

    public void setServiceProvider(User serviceProvider) {
        this.serviceProvider = serviceProvider;
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
