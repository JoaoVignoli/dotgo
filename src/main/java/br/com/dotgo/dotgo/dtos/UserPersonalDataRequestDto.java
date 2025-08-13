package br.com.dotgo.dotgo.dtos;

import java.util.Date;

public class UserPersonalDataRequestDto {

    private String name;
    private String email;
    private String tax_id;
    private String phone;
    private String password;
    private Date birthday;

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getTax_id() {
        return tax_id;
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
