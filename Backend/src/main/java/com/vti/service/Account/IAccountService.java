package com.vti.service.Account;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.vti.entity.Account;
import com.vti.form.Account.CreateAccountAsAdminForm;
import com.vti.form.Account.FilterAccountForm;
import com.vti.form.Account.UpdateAccountByAdminForm;
import com.vti.form.Account.UpdateAccountByEmployeeForm;
import com.vti.form.Account.UpdatePasswordForm;

public interface IAccountService {
    
    ResponseEntity<Page<Account>> getAllAccounts(Pageable pageable, String search, FilterAccountForm filterAccountForm);

    ResponseEntity<Page<Account>> getListAccountsUnDef(Pageable pageable);

    ResponseEntity<Account> getAccountByID(int id);
    
    ResponseEntity<Account> getAccountByUsername(String username);
    
    ResponseEntity<Account> getAccountByEmail(String email);

    ResponseEntity<String> createAccountAsAdmin(CreateAccountAsAdminForm form);

    ResponseEntity<String> updateAccountByAdmin(UpdateAccountByAdminForm form);
    
    ResponseEntity<String> updateAccountByEmployee(UpdateAccountByEmployeeForm form);
    
    ResponseEntity<String> updatePassword(UpdatePasswordForm form);

    ResponseEntity<Boolean> isAccountExistsByUserame(String username);

    ResponseEntity<Boolean> isAccountExistsByID(Integer id);

    ResponseEntity<String> deleteAccounts(Set<Integer> idList);

    ResponseEntity<String> deleteAccount(Integer id);
}
