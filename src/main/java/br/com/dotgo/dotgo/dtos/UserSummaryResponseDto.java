package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.User;
import br.com.dotgo.dotgo.enums.UserRole;

public class UserSummaryResponseDto {

    private Integer id;
    private String name;
    private String urlProfilePhoto;
    private String specialty;
    private Boolean verified;
    private Integer rating;

    public UserSummaryResponseDto(User user, String publicPictureUrl) {
        this.id = user.getId();
        this.name = user.getName();
        this.urlProfilePhoto = publicPictureUrl;

        if (user.getRole() == UserRole.SERVICE_HOLDER) {
            this.rating = 5;
            this.verified = user.getVerified();
            this.specialty = user.getSpecialty();
        }

    }

    public UserSummaryResponseDto() {
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

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public String getUrlProfilePhoto() {
        return urlProfilePhoto;
    }

    public void setUrlProfilePhoto(String urlProfilePhoto) {
        this.urlProfilePhoto = urlProfilePhoto;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

}
