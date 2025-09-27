package com.vti.controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vti.dto.AccountDTO;
import com.vti.dto.DepartmentDTO;
import com.vti.entity.Account;
import com.vti.entity.Department;
import com.vti.entity.Department.Type;
import com.vti.form.Account.FilterAccountForm;
import com.vti.form.Department.FilterDepartmentForm;
import com.vti.service.Account.IAccountService;
import com.vti.service.Department.IDepartmentService;
import com.vti.validation.Account.AccountIDExists;
import com.vti.validation.Department.DepartmentIDExists;
import com.vti.validation.Department.DepartmentNameExists;

@RestController
@RequestMapping(value = "api/v1/view")
public class ViewController {

    @Autowired
    private IAccountService accountService;
    
    @Autowired
    private IDepartmentService departmentService;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @GetMapping(value = "/accounts")
    public ResponseEntity<Page<AccountDTO>> getAllAccounts(
            @PageableDefault(sort = { "lastName" }, direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(name = "search", required = false) String search,
            FilterAccountForm filterAccountForm,
            @RequestParam(name = "lang", required = false) String lang) {

        ResponseEntity<Page<Account>> responseEntity = accountService.getAllAccounts(pageable, search, filterAccountForm);
        Page<Account> accountPage = responseEntity.getBody();

        // Convert Account to AccountDTO
        List<AccountDTO> dtos = modelMapper.map(accountPage.getContent(), new TypeToken<List<AccountDTO>>() {}.getType());

        // Add HATEOAS
        for (AccountDTO dto : dtos) {
            dto.add(linkTo(methodOn(ViewController.class).getAccountById(dto.getId(), lang)).withSelfRel());
        }

        Page<AccountDTO> accountDTOPage = new PageImpl<>(dtos, pageable, accountPage.getTotalElements());

        return ResponseEntity.ok(accountDTOPage);
    }
    
    @GetMapping(value = "/accounts/undef")
    public ResponseEntity<Page<AccountDTO>> getListAccountsUnDef(Pageable pageable, @RequestParam(name = "lang", required = false) String lang) {
        ResponseEntity<Page<Account>> responseEntity = accountService.getListAccountsUnDef(pageable);
        Page<Account> accountPage = responseEntity.getBody();
        
        // Convert Account to AccountDTO
        List<AccountDTO> dtos = modelMapper.map(accountPage.getContent(), new TypeToken<List<AccountDTO>>() {}.getType());
        
        for (AccountDTO dto : dtos) {
        	dto.add(linkTo(methodOn(ViewController.class).getAccountById(dto.getId(), lang)).withSelfRel());
        }
        
        // Create a new Page with the filtered list
        Page<AccountDTO> accountDTOPage = new PageImpl<>(dtos, pageable, accountPage.getTotalElements());

        return ResponseEntity.ok(accountDTOPage);
    }


    @GetMapping(value = "/accounts/{id}")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable @AccountIDExists int id,
                                                     @RequestParam(name = "lang", required = false) String lang) {
        ResponseEntity<Account> responseEntity = accountService.getAccountByID(id);
        Account account = responseEntity.getBody();

        AccountDTO dto = modelMapper.map(account, AccountDTO.class);

        // Add HATEOAS
        dto.add(linkTo(methodOn(ViewController.class).getAccountById(id, lang)).withSelfRel());

        return ResponseEntity.ok(dto);
    }

    @GetMapping(value = "/accountName/{username}")
    public ResponseEntity<Boolean> checkAccountExistByUsername(@PathVariable String username,
                                                               @RequestParam(name = "lang", required = false) String lang) {
        ResponseEntity<Boolean> responseEntity = accountService.isAccountExistsByUserame(username);
        return responseEntity;
    }
    
    // Department
    
    @GetMapping(value = "/departments")
    public ResponseEntity<Page<DepartmentDTO>> getAllDepartments(
            @PageableDefault(sort = { "totalMember" }, direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(name = "search", required = false) String search,
            FilterDepartmentForm filterDepartmentForm,
            @RequestParam(name = "lang", required = false) String lang) {

        ResponseEntity<Page<Department>> responseEntity = departmentService.getAllDepartments(pageable, search, filterDepartmentForm);
        Page<Department> departmentPage = responseEntity.getBody();

        // Convert department to departmentDTO
        List<DepartmentDTO> dtos = modelMapper.map(departmentPage.getContent(), new TypeToken<List<DepartmentDTO>>() {}.getType());

        // Add HATEOAS
        for (DepartmentDTO dto : dtos) {
            dto.add(linkTo(methodOn(ViewController.class).getDepartmentById(dto.getId(), lang)).withSelfRel());
        }

        Page<DepartmentDTO> departmentDTOPage = new PageImpl<>(dtos, pageable, departmentPage.getTotalElements());

        return ResponseEntity.ok(departmentDTOPage);
    }
    
    @GetMapping(value = "/departments/list")
    public ResponseEntity<List<DepartmentDTO>> getListDepartments(@RequestParam(name = "lang", required = false) String lang) {
        // Get the list of departments
        ResponseEntity<List<Department>> responseEntity = departmentService.getListDepartments();
        List<Department> departments = responseEntity.getBody();
        
        // Convert List<Department> to List<DepartmentDTO>
        List<DepartmentDTO> dtos = modelMapper.map(departments, new TypeToken<List<DepartmentDTO>>() {}.getType());
        
        // Add HATEOAS links
        for (DepartmentDTO dto : dtos) {
            dto.add(linkTo(methodOn(ViewController.class).getDepartmentById(dto.getId(), lang)).withSelfRel());
        }
        
        // Return the list of DepartmentDTO objects
        return ResponseEntity.ok(dtos);
    }

    @GetMapping(value = "/departments/listType")
    public ResponseEntity<List<Type>> getListType() {
    	return ResponseEntity.ok(departmentService.getListType().getBody());
    }

    @GetMapping(value = "/departments/{id}")
    public ResponseEntity<DepartmentDTO> getDepartmentById(@PathVariable @DepartmentIDExists int id,
                                                           @RequestParam(name = "lang", required = false) String lang) {
        ResponseEntity<Department> responseEntity = departmentService.getDepartmentByID(id);
        Department department = responseEntity.getBody();

        DepartmentDTO dto = modelMapper.map(department, DepartmentDTO.class);

        // Add HATEOAS
        dto.add(linkTo(methodOn(ViewController.class).getDepartmentById(id, lang)).withSelfRel());

        return ResponseEntity.ok(dto);
    }

    @GetMapping(value = "/departments/name/{name}")
    public ResponseEntity<DepartmentDTO> getDepartmentByName(@PathVariable @DepartmentNameExists String name,
                                                           @RequestParam(name = "lang", required = false) String lang) {
        ResponseEntity<Department> responseEntity = departmentService.getDepartmentByName(name);
        Department department = responseEntity.getBody();

        DepartmentDTO dto = modelMapper.map(department, DepartmentDTO.class);

        // Add HATEOAS
        dto.add(linkTo(methodOn(ViewController.class).getDepartmentByName(name, lang)).withSelfRel());

        return ResponseEntity.ok(dto);
    }

    @GetMapping(value = "/departmentName/{name}")
    public ResponseEntity<Boolean> checkDepartmentExistByName(@PathVariable String name,
                                                              @RequestParam(name = "lang", required = false) String lang) {
        ResponseEntity<Boolean> responseEntity = departmentService.isDepartmentExistsByName(name);
        return responseEntity;
    }
}
