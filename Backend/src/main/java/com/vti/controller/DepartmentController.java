package com.vti.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vti.form.Department.CreateDepartmentForm;
import com.vti.form.Department.DeleteDepartmentsForm;
import com.vti.form.Department.UpdateDepartmentForm;
import com.vti.service.Department.IDepartmentService;
import com.vti.validation.Department.DepartmentIDExists;

@SuppressWarnings("ALL")
@RestController
@RequestMapping(value = "api/v1/departments")
@Validated
public class DepartmentController {

    @Autowired
    private IDepartmentService departmentService;
    
    @PostMapping
    public ResponseEntity<String> createDepartment(@RequestBody @Valid CreateDepartmentForm createForm,
                                                   @RequestParam(name = "lang", required = false) String lang) {
        try {
            departmentService.createDepartment(createForm);
            return ResponseEntity.status(HttpStatus.CREATED).body("Department created successfully.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PutMapping(value = "/update")
    public ResponseEntity<String> updateDepartment(@RequestBody @Valid UpdateDepartmentForm updateForm,
                                                   @RequestParam(name = "lang", required = false) String lang) {
        try {
            departmentService.updateDepartment(updateForm);
            return ResponseEntity.ok("Department updated successfully.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
    
    @DeleteMapping(value = "/delete")
    public ResponseEntity<String> deleteDepartments(@RequestBody DeleteDepartmentsForm deleteForm,
                                                    @RequestParam(name = "lang", required = false) String lang) {
        return departmentService.deleteDepartments(deleteForm.getIds());
    }
}
