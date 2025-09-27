package com.vti.specification;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.vti.entity.Account;
import com.vti.form.Account.FilterAccountForm;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@SuppressWarnings("ALL")
public class AccountSpecification {

    public static Specification<Account> buildWhere(String search, FilterAccountForm filterForm) {

        Specification<Account> where;

        // where default (1 = 1)
        AccountCustomSpecification init = new AccountCustomSpecification("init", "init");
        where = Specification.where(init);

        // Search by username or first name or last name
        if (!StringUtils.isEmpty(search)) {

            AccountCustomSpecification username = new AccountCustomSpecification("username", search.trim());
            AccountCustomSpecification firstName = new AccountCustomSpecification("firstName", search.trim());
            AccountCustomSpecification lastName = new AccountCustomSpecification("lastName", search.trim());

            where = where.and(username).or(firstName).or(lastName);
        }

        // Filter
        if (filterForm != null) {

            // Filter by role
            if (filterForm.getRole() != null) {
                where = where.and(new AccountCustomSpecification("role", filterForm.getRole()));
            }

            // Filter by department
            if (filterForm.getDepartmentName() != null) {
                where = where.and(new AccountCustomSpecification("department", filterForm.getDepartmentName()));
            }
        }

        return where;
    }
}

@SuppressWarnings("ALL")
@RequiredArgsConstructor
class AccountCustomSpecification implements Specification<Account> {

    @NonNull
    private String field;

    @NonNull
    private Object value;

    @Override
    public Predicate toPredicate(Root<Account> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        if (field.equalsIgnoreCase("init")) {
            return criteriaBuilder.equal(criteriaBuilder.literal(1), 1);
        }

        // Search by username
        if (field.equalsIgnoreCase("username")) {
            return criteriaBuilder.like(root.get("username"), "%" + value + "%");
        }

        // Search by first name
        if (field.equalsIgnoreCase("firstName")) {
            return criteriaBuilder.like(root.get("firstName"), "%" + value + "%");
        }

        // Search by last name
        if (field.equalsIgnoreCase("lastName")) {
            return criteriaBuilder.like(root.get("lastName"), "%" + value + "%");
        }

        // Filter by role
        if (field.equalsIgnoreCase("role")) {
            return criteriaBuilder.equal(root.get("role"), value);
        }

        // Filter by department
        if (field.equalsIgnoreCase("department")) {
            return criteriaBuilder.equal(root.get("department").get("name"), value);
        }

        return null;
    }


}
