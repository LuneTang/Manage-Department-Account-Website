package com.vti.specification;

import com.vti.entity.Department;
import com.vti.form.Department.FilterDepartmentForm;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.Date;

@SuppressWarnings("ALL")
public class DepartmentSpecification {

    public static Specification<Department> buildWhere(String search, FilterDepartmentForm filterForm) {

        Specification<Department> where;

        // where default (1 = 1)
        DepartmentCustomSpecification init = new DepartmentCustomSpecification("init", "init");
        where = Specification.where(init);

        // Search by name
        if(!StringUtils.isEmpty(search)){
            where = where.and(new DepartmentCustomSpecification("departmentName", search.trim()));
        }

        // Filter
        if(filterForm == null) {
            return where;

        } else {

            // Filter by min created date
            if (filterForm.getMinCreatedDate() != null) {
                where = where.and(new DepartmentCustomSpecification("minCreatedDate", filterForm.getMinCreatedDate()));
            }

            // Filter by max created date
            if (filterForm.getMaxCreatedDate() != null) {
                where = where.and(new DepartmentCustomSpecification("maxCreatedDate", filterForm.getMaxCreatedDate()));
            }

            // Filter by department type
            if (filterForm.getType() != null) {
                where = where.and(new DepartmentCustomSpecification("type", filterForm.getType()));
            }
        }

        return where;
    }
}

@SuppressWarnings("ALL")
@RequiredArgsConstructor
class DepartmentCustomSpecification implements Specification<Department> {

    @NonNull
    private String field;

    @NonNull
    private Object value;

    @Override
    public Predicate toPredicate(Root<Department> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        if (field.equalsIgnoreCase("init")) {
            return criteriaBuilder.equal(criteriaBuilder.literal(1), 1);
        }

        // Search by name
        if (field.equalsIgnoreCase("departmentName")) {
            return criteriaBuilder.like(root.get("name"), "%" + value + "%");
        }

        // Filter by min created date
        if (field.equalsIgnoreCase("minCreatedDate")) {
            return criteriaBuilder.greaterThanOrEqualTo(root.get("createdDate").as(java.sql.Date.class), (Date) value);
        }

        // Filter by max created date
        if (field.equalsIgnoreCase("maxCreatedDate")) {
            return criteriaBuilder.lessThanOrEqualTo(root.get("createdDate").as(java.sql.Date.class), (Date) value);
        }

        // Filter by department type
        if (field.equalsIgnoreCase("type")) {
            return criteriaBuilder.equal(root.get("type"), value);
        }

        return null;
    }
}