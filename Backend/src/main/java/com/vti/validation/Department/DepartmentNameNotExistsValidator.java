package com.vti.validation.Department;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;

import com.vti.service.Department.IDepartmentService;

public class DepartmentNameNotExistsValidator implements ConstraintValidator<DepartmentNameNotExists, String> {

    @Autowired
    private IDepartmentService service;
    
    @Override
    public boolean isValid(String name, ConstraintValidatorContext context) {

        if (StringUtils.isEmpty(name)) {
            return true;
        }
        
        ResponseEntity<Boolean> response = service.isDepartmentExistsByName(name);
        return response.getBody() != null && !response.getBody();
    }
}
