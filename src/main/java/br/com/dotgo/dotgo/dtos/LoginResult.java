package br.com.dotgo.dotgo.dtos;

import br.com.dotgo.dotgo.entities.User;

public class LoginResult {

    private final boolean success;
    private final String token;
    private final String errorMessage;
    private final User user;
    
    private LoginResult(boolean success, String token, String errorMessage, User user) {
        this.success = success;
        this.token = token;
        this.errorMessage = errorMessage;
        this.user = user;
    }
    
    public static LoginResult success(String token, User user) {
        return new LoginResult(true, token, null, user);
    }
    
    public static LoginResult failure(String errorMessage) {
        return new LoginResult(false, null, errorMessage, null);
    }
    
    public boolean isSuccess() { return success; }
    public String getToken() { return token; }
    public String getErrorMessage() { return errorMessage; }
    public User getUser() { return user; }

}

