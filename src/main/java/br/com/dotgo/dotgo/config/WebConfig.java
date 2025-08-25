package br.com.dotgo.dotgo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Home Pages
        registry.addViewController("/").setViewName("forward:/home.html");
        registry.addViewController("/home").setViewName("forward:/home.html");

        // Login Page
        registry.addViewController("/login").setViewName("forward:/login.html");
        
        // Users Register Pages
        registry.addViewController("/register").setViewName("forward:/registerRole.html");
        registry.addViewController("/register/personal").setViewName("forward:/personalInfoRegister.html");
        registry.addViewController("/register/address").setViewName("forward:/addressRegister.html");
        registry.addViewController("/register/profile-photo").setViewName("forward:/perfilPhoto.html");

        // Products Register Pages
        registry.addViewController("/register/products").setViewName("forward:/newProduct.html");
        registry.addViewController("/register/products/category").setViewName("forward:/productCategories.html");
        registry.addViewController("/register/products/subcategory").setViewName("forward:/productSubcategories.html");

        // Forgot Password Pages
        registry.addViewController("/forgot-password").setViewName("forward:/forgotPassword.html");
        registry.addViewController("/forgot-password/verify").setViewName("forward:/verificationCode.html");
        registry.addViewController("/forgot-password/new-password").setViewName("forward:/resetPassword.html");


        registry.addViewController("/provider-profile").setViewName("forward:/profileProvider.html");
        registry.addViewController("/personal-profile").setViewName("forward:/personalProfile.html");
        
    }
} 

