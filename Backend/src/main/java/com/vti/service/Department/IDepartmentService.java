package com.vti.service.Department;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.vti.entity.Department;
import com.vti.entity.Department.Type;
import com.vti.form.Department.CreateDepartmentForm;
import com.vti.form.Department.FilterDepartmentForm;
import com.vti.form.Department.UpdateDepartmentForm;

@SuppressWarnings("ALL")
public interface IDepartmentService {

    ResponseEntity<Page<Department>> getAllDepartments(Pageable pageable, String search, FilterDepartmentForm filterDepartmentForm);

    ResponseEntity<List<Department>> getListDepartments();

    ResponseEntity<Department> getDepartmentByID(int id);
    
    ResponseEntity<Department> getDepartmentByName(String name);

    ResponseEntity<String> createDepartment(CreateDepartmentForm form);

    ResponseEntity<String> updateDepartment(UpdateDepartmentForm form);

    ResponseEntity<Boolean> isDepartmentExistsByName(String name);

    ResponseEntity<Boolean> isDepartmentExistsByID(Integer id);

    ResponseEntity<String> deleteDepartments(Set<Integer> idList);
    
    ResponseEntity<List<Type>> getListType();
}
