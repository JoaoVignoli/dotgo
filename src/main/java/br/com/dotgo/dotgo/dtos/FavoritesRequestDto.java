package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.User;

public class FavoritesRequestDto {
    private Integer serviceProviderId;
    private Integer userId;

    public FavoritesRequestDto(User serviceProvider, User user) {
        this.serviceProviderId = serviceProvider.getId();
        this.userId = user.getId();
    }

    public FavoritesRequestDto() {
    }

    public Integer getServiceProviderId() {
        return serviceProviderId;
    }

    public void setServiceProviderId(Integer serviceProviderId) {
        this.serviceProviderId = serviceProviderId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
}
