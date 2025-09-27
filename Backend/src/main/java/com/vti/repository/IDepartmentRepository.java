package com.vti.repository;

import com.vti.entity.Department;
import com.vti.entity.Department.Type;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

@SuppressWarnings("ALL")
public interface IDepartmentRepository extends JpaRepository<Department, Integer>, JpaSpecificationExecutor<Department> {

    boolean existsByName(String name);

    boolean existsById(int id);
    
    Department findByName(String name);
    
    @Query("SELECT DISTINCT d.type FROM Department d")
    List<Type> findDistinctTypes();
}
