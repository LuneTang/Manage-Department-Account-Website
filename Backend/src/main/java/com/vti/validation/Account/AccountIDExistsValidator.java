package com.vti.validation.Account;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.vti.service.Account.IAccountService;

public class AccountIDExistsValidator implements ConstraintValidator<AccountIDExists, Integer> {

    @Autowired
    private IAccountService service;
    
    @Override
    public boolean isValid(Integer id, ConstraintValidatorContext context) {

        if (id == null || id < 0) {
            return false;
        }

        ResponseEntity<Boolean> response = service.isAccountExistsByID(id);
        return response.getBody() != null && response.getBody();
    }

}
