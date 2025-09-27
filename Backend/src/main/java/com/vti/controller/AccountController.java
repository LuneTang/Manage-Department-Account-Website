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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vti.form.Account.CreateAccountAsAdminForm;
import com.vti.form.Account.DeleteAccountsForm;
import com.vti.form.Account.UpdateAccountByAdminForm;
import com.vti.form.Account.UpdateAccountByEmployeeForm;
import com.vti.form.Account.UpdatePasswordForm;
import com.vti.service.Account.IAccountService;
import com.vti.validation.Account.AccountIDExists;

@SuppressWarnings("ALL")
@RestController
@RequestMapping(value = "api/v1/accounts")
@Validated
public class AccountController {
    
    @Autowired
    private IAccountService accountService;

    @PostMapping("/admin")
    public ResponseEntity<String> createAccountAsAdmin(@RequestBody @Valid CreateAccountAsAdminForm createForm,
                                                       @RequestParam(name = "lang", required = false) String lang) {
        try {
            accountService.createAccountAsAdmin(createForm);
            return ResponseEntity.status(HttpStatus.CREATED).body("Account created successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PutMapping(value = "/update-by-admin")
    public ResponseEntity<String> updateAccountByAdmin(@RequestBody @Valid UpdateAccountByAdminForm updateForm,
                                                       @RequestParam(name = "lang", required = false) String lang) {
        try {
            accountService.updateAccountByAdmin(updateForm);
            return ResponseEntity.ok("Account updated successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
    
    @PutMapping(value = "/update-by-employee")
    public ResponseEntity<String> updateAccountByEmployee(@RequestBody @Valid UpdateAccountByEmployeeForm updateForm,
                                                          @RequestParam(name = "lang", required = false) String lang) {
        try {
            accountService.updateAccountByEmployee(updateForm);
            return ResponseEntity.ok("Account updated successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
    
    @PutMapping(value = "/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody @Valid UpdatePasswordForm updatePassForm,
                                                 @RequestParam(name = "lang", required = false) String lang) {
        try {
            accountService.updatePassword(updatePassForm);
            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable @AccountIDExists int id,
                                                @RequestParam(name = "lang", required = false) String lang) {
        return accountService.deleteAccount(id);
    }

    @DeleteMapping(value = "/delete")
    public ResponseEntity<String> deleteAccounts(@RequestBody DeleteAccountsForm deleteForm,
                                                 @RequestParam(name = "lang", required = false) String lang) {
        return accountService.deleteAccounts(deleteForm.getIds());
    }
}
