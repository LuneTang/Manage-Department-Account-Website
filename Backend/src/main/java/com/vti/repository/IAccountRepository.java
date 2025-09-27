package com.vti.repository;

import com.vti.entity.Account;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface IAccountRepository extends JpaRepository<Account, Integer>, JpaSpecificationExecutor<Account> {
	
	boolean existsByUsername(String username);

    boolean existsById(int id);
    
	Account findByUsername(String username);
	
	Account findByEmail(String email);
	
	@Query("FROM Account a WHERE a.department.id = 1")
	Page<Account> findListAccountUnDef(Pageable pageable);
}
