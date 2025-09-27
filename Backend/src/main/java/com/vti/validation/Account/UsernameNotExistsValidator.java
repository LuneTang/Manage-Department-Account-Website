package com.vti.validation.Account;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;

import com.vti.service.Account.IAccountService;

public class UsernameNotExistsValidator implements ConstraintValidator<UsernameNotExists, String> {

    @Autowired
    private IAccountService service;
    
    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {

        if (StringUtils.isEmpty(username)) {
            return true;
        }
        
        ResponseEntity<Boolean> response = service.isAccountExistsByUserame(username);
        return response.getBody() != null && !response.getBody();
    }
}
