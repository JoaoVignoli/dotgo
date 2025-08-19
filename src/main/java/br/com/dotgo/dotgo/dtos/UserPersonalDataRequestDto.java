package br.com.dotgo.dotgo.dtos;

import java.util.Date;

import br.com.dotgo.dotgo.enums.UserRole;

public class UserPersonalDataRequestDto {

    private String name;
    private String email;
    private String taxId;
    private String phone;
    private String password;
    private Date birthday;
    private UserRole role;

    public UserRole getRole() {
        return role;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getTaxId() {
        return taxId;
    }

    public String getPhone() {
        return phone;
    }

    public String getPassword() {
        return password;
    }

    public Date getBirthday() {
        return birthday;
    }
}
