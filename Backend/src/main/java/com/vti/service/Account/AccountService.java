package com.vti.service.Account;

import java.util.List;
import java.util.Set;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vti.entity.Account;
import com.vti.entity.Account.Role;
import com.vti.entity.Department;
import com.vti.form.Account.CreateAccountAsAdminForm;
import com.vti.form.Account.FilterAccountForm;
import com.vti.form.Account.UpdateAccountByAdminForm;
import com.vti.form.Account.UpdateAccountByEmployeeForm;
import com.vti.form.Account.UpdatePasswordForm;
import com.vti.repository.IAccountRepository;
import com.vti.repository.IDepartmentRepository;
import com.vti.specification.AccountSpecification;

@SuppressWarnings("ALL")
@Service
public class AccountService implements IAccountService {

    @Autowired
    private IAccountRepository accountRepository;

    @Autowired
    private IDepartmentRepository departmentRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    JavaMailSender javaMailSender;


    @Override
    public ResponseEntity<Page<Account>> getAllAccounts(Pageable pageable, String search, FilterAccountForm filterAccountForm) {
        Specification<Account> where = AccountSpecification.buildWhere(search, filterAccountForm);
        Page<Account> accounts = accountRepository.findAll(where, pageable);
        return ResponseEntity.ok(accounts);
    }

    @Override
    public ResponseEntity<Page<Account>> getListAccountsUnDef(Pageable pageable) {
        Page<Account> accounts = accountRepository.findListAccountUnDef(pageable);
        return ResponseEntity.ok(accounts);
    }

    @Override
    public ResponseEntity<Account> getAccountByID(int id) {
        return accountRepository.findById(id)
                .map(account -> ResponseEntity.ok(account))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @Override
    @Transactional
    public ResponseEntity<String> createAccountAsAdmin(CreateAccountAsAdminForm form) {
        TypeMap<CreateAccountAsAdminForm, Account> typeMap = modelMapper.getTypeMap(CreateAccountAsAdminForm.class, Account.class);
        if (typeMap == null) {
            modelMapper.addMappings(new PropertyMap<CreateAccountAsAdminForm, Account>() {
                @Override
                protected void configure() {
                    skip(destination.getId());
                }
            });
        }

        Account account = modelMapper.map(form, Account.class);
        account.setPassword(passwordEncoder.encode(form.getPassword()));
        accountRepository.save(account);

        Department department = departmentRepository.findById(form.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        department.setTotalMember(department.getAccounts().size());
        departmentRepository.save(department);
        
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("cengying521@gmail.com");  
        msg.setTo(form.getEmail());
        msg.setSubject("Login Account Info");
        msg.setText("Hello, \n\nHere is your new account information:" 
        		+ "\n\nUsername: " + form.getUsername() 
        		+ "\n\nPassword: " + form.getPassword()
        		+ "\n\nPlease click on the link below to proceed with signing in your account. \n\n"
                    + "http://localhost:1001/pages/login-page.html" 
                    + "\n\nREMEMBER FOR CHANGING USERNAME AND PASSWORD AFTER LOGIN ! \n\nThank you.");

        javaMailSender.send(msg);

        return ResponseEntity.status(HttpStatus.CREATED).body("Account created successfully");
    }

    @Override
    @Transactional
    public ResponseEntity<String> updateAccountByAdmin(UpdateAccountByAdminForm form) {
        Account account = accountRepository.findById(form.getId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Department oldDepartment = account.getDepartment();
        Department newDepartment = departmentRepository.findById(form.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // Update Account with new department and role
        account.setDepartment(newDepartment);
        account.setRole(convertRole(form.getRole()));
        accountRepository.save(account);

        // Update department member counts
        oldDepartment.setTotalMember(oldDepartment.getTotalMember() - 1);
        newDepartment.setTotalMember(newDepartment.getTotalMember() + 1);

        departmentRepository.save(oldDepartment);
        departmentRepository.save(newDepartment);

        return ResponseEntity.ok("Account updated successfully");
    }

    @Override
    public ResponseEntity<String> updateAccountByEmployee(UpdateAccountByEmployeeForm form) {
        Account account = accountRepository.findById(form.getId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setFirstName(form.getFirstName());
        account.setLastName(form.getLastName());
        account.setEmail(form.getEmail());

        accountRepository.save(account);
        return ResponseEntity.ok("Account updated successfully");
    }

    private Role convertRole(String role) {
        return role.equalsIgnoreCase("ADMIN") ? Role.ADMIN :
                role.equalsIgnoreCase("MANAGER") ? Role.MANAGER :
                        Role.EMPLOYEE;
    }

    @Override
    public ResponseEntity<String> updatePassword(UpdatePasswordForm form) {
        // Get the account by ID
        Account account = accountRepository.findById(form.getId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Compare the old password (submitted by the user) with the stored (encoded) password in the database
        if (passwordEncoder.matches(form.getOldPassword(), account.getPassword())) {
            // If passwords match, set the new password and save it
            account.setPassword(passwordEncoder.encode(form.getNewPassword()));
            accountRepository.save(account);
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Old password is incorrect");
        }
    }

    @Override
    public ResponseEntity<Boolean> isAccountExistsByUserame(String username) {
        boolean exists = accountRepository.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }

    @Override
    public ResponseEntity<Boolean> isAccountExistsByID(Integer id) {
        boolean exists = accountRepository.existsById(id);
        return ResponseEntity.ok(exists);
    }

    @Override
    public ResponseEntity<String> deleteAccounts(Set<Integer> idList) {
        accountRepository.deleteAllById(idList);
        return ResponseEntity.ok("Accounts deleted successfully");
    }

    @Override
    public ResponseEntity<String> deleteAccount(Integer id) {
        if (accountRepository.existsById(id)) {
            accountRepository.deleteById(id);
            return ResponseEntity.ok("Account deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found");
        }
    }

    @Override
    public ResponseEntity<Account> getAccountByUsername(String username) {
        Account account = accountRepository.findByUsername(username);
        return ResponseEntity.ok(account);
    }

    @Override
    public ResponseEntity<Account> getAccountByEmail(String email) {
        Account account = accountRepository.findByEmail(email);
        return ResponseEntity.ok(account);
    }
}
