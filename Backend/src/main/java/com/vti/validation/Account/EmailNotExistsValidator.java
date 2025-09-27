package com.vti.validation.Account;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;

import com.vti.entity.Account;
import com.vti.service.Account.IAccountService;

public class EmailNotExistsValidator implements ConstraintValidator<EmailNotExists, String>{

	@Autowired
	private IAccountService service;
	
	@Override
	public boolean isValid(String email, ConstraintValidatorContext context) {

		if (StringUtils.isEmpty(email)) {
			return true;
		}
		
		ResponseEntity<Account> response = service.getAccountByEmail(email);
        return response.getBody() != null ? false : true;
	}

}
