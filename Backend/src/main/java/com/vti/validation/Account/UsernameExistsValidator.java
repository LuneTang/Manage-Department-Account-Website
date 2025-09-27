package com.vti.validation.Account;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;

import com.vti.service.Account.IAccountService;

public class UsernameExistsValidator implements ConstraintValidator<UsernameExists, String> {

    @Autowired
    private IAccountService service;

    @SuppressWarnings("deprecation")
    @Override
    public boolean isValid(String username, ConstraintValidatorContext constraintValidatorContext) {

        if (StringUtils.isEmpty(username)) {
            return false;
        }

        ResponseEntity<Boolean> response = service.isAccountExistsByUserame(username);
        return response.getBody() != null && response.getBody();
    }
}
