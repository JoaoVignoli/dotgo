package br.com.dotgo.dotgo.dtos;

import org.springframework.web.multipart.MultipartFile;

public class FeedRequestDto {

    private Integer userId;
    private MultipartFile picture;

    public FeedRequestDto() {
    }

    public FeedRequestDto(Integer userId, MultipartFile picture) {
        this.userId = userId;
        this.picture = picture;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public MultipartFile getPicture() {
        return picture;
    }

    public void setPicture(MultipartFile picture) {
        this.picture = picture;
    }

}
