package com.vti.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@SuppressWarnings("ALL")
@Data
@NoArgsConstructor
@Entity
@Table(name = "`Account`")
public class Account implements Serializable {

    private final static long serialVersionUID = 1L;

    @Column(name = "id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "username", length = 50, unique = true)
    @NonNull
    private String username;

    @Column(name = "`password`", length = 800)
    @NonNull
    private String password;

    @Column(name = "first_name", length = 50)
    @NonNull
    private String firstName;

    @Column(name = "last_name", length = 50)
    @NonNull
    private String lastName;
    
    @Column(name = "email", length = 100, unique = true)
    @NonNull
    private String email;

    @Transient
    private String fullName;

    @Column(name = "`role`", columnDefinition = "ENUM('ADMIN','EMPLOYEE','MANAGER') NOT NULL DEFAULT 'EMPLOYEE'")
    @NonNull
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "created_date")
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createdDate;
    
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public enum Role {
        ADMIN, MANAGER, EMPLOYEE
    }
}
