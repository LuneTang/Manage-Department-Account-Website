package com.vti.service.Department;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vti.entity.Account;
import com.vti.entity.Department;
import com.vti.entity.Department.Type;
import com.vti.form.Department.CreateDepartmentForm;
import com.vti.form.Department.FilterDepartmentForm;
import com.vti.form.Department.UpdateDepartmentForm;
import com.vti.repository.IAccountRepository;
import com.vti.repository.IDepartmentRepository;
import com.vti.specification.DepartmentSpecification;

@SuppressWarnings("ALL")
@Service
public class DepartmentService implements IDepartmentService {

    @Autowired
    private IDepartmentRepository departmentRepository;

    @Autowired
    private IAccountRepository accountRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ResponseEntity<Page<Department>> getAllDepartments(Pageable pageable, String search, FilterDepartmentForm filterDepartmentForm) {
        Specification<Department> where = DepartmentSpecification.buildWhere(search, filterDepartmentForm);
        Page<Department> departments = departmentRepository.findAll(where, pageable);
        return ResponseEntity.ok(departments);
    }

    @Override
    public ResponseEntity<List<Department>> getListDepartments() {
        
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @Override
    public ResponseEntity<Department> getDepartmentByID(int id) {
        return departmentRepository.findById(id)
                .map(department -> ResponseEntity.ok(department))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }
    
    @Override
    public ResponseEntity<Department> getDepartmentByName(String name) {
        return ResponseEntity.ok(departmentRepository.findByName(name));
    }

    @Override
    @Transactional
    public ResponseEntity<String> createDepartment(CreateDepartmentForm form) {
        try {
            Department department = modelMapper.map(form, Department.class);
            // Set total member
            department.setTotalMember(form.getAccounts().size());
            // Save department
            departmentRepository.save(department);
            
            // Update account's department
            if (!form.getAccounts().isEmpty()) {
                List<Account> accounts = new ArrayList<>();
                for (CreateDepartmentForm.Account account : form.getAccounts()) {
                    // Get account
                    Account acc = accountRepository.findByUsername(account.getUsername());
                    // Set department
                    acc.setDepartment(department);
                    // Add to list
                    accounts.add(acc);
                }
                // Update accounts
                accountRepository.saveAll(accounts);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body("Department created successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @Override
    @Transactional
    public ResponseEntity<String> updateDepartment(UpdateDepartmentForm form) {
        try {
        	Department updateDepartment = modelMapper.map(form, Department.class);
            // Fetch the existing department
            Department existingDepartment = departmentRepository.findById(form.getId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));

            // Fetch the current accounts of the department
            List<Account> existingAccounts = existingDepartment.getAccounts();

            // Add new accounts to the existing list
            for (UpdateDepartmentForm.Account accountForm : form.getAccounts()) {
                // Find the account by ID
                Account account = accountRepository.findById(accountForm.getId())
                        .orElseThrow(() -> new RuntimeException("Account not found"));

                // Check if the account is already associated with the department
                if (!existingAccounts.contains(account)) {
                    // Set the department for the account
                    account.setDepartment(existingDepartment);
                    // Add the account to the existing list
                    existingAccounts.add(account);
                }
            }

            // Update the department's account list and total member count
            updateDepartment.setAccounts(existingAccounts);
            updateDepartment.setTotalMember(existingAccounts.size());
           
            // Preserve the original created date
            updateDepartment.setCreatedDate(existingDepartment.getCreatedDate());

            // Save the updated department
            departmentRepository.save(updateDepartment);

            return ResponseEntity.ok("Department updated successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }


    @Override
    public ResponseEntity<Boolean> isDepartmentExistsByName(String name) {
        boolean exists = departmentRepository.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    @Override
    public ResponseEntity<Boolean> isDepartmentExistsByID(Integer id) {
        boolean exists = departmentRepository.existsById(id);
        return ResponseEntity.ok(exists);
    }

    @Override
    public ResponseEntity<String> deleteDepartments(Set<Integer> idList) {
        try {
            departmentRepository.deleteAllById(idList);
            return ResponseEntity.ok("Departments deleted successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }


	@Override
	public ResponseEntity<List<Type>> getListType() {
		List<Type> types = departmentRepository.findDistinctTypes();
		return ResponseEntity.ok(types);
	}
}
