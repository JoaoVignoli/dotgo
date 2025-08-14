package br.com.dotgo.dotgo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/newProduct").setViewName("forward:/newProduct.html");
        registry.addViewController("/productCategories").setViewName("forward:/productCategories.html");
        registry.addViewController("/productSubcategories").setViewName("forward:/productSubcategories.html");
        registry.addViewController("/forgotPassword").setViewName("forward:/forgotPassword.html");
        registry.addViewController("/profileProvider").setViewName("forward:/profileProvider.html");
    }
} 

