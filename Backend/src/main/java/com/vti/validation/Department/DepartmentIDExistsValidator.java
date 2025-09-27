package com.vti.validation.Department;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.vti.service.Department.IDepartmentService;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class DepartmentIDExistsValidator implements ConstraintValidator<DepartmentIDExists, Integer> {

    @Autowired
    private IDepartmentService service;
    
    @Override
    public boolean isValid(Integer id, ConstraintValidatorContext context) {

        if (id == null || id < 0) {
            return false;
        }

        ResponseEntity<Boolean> response = service.isDepartmentExistsByID(id);
        return response.getBody() != null && response.getBody();
    }
}
