package com.vti.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@SuppressWarnings("ALL")
@Data
@NoArgsConstructor
@Entity
@Table(name = "`Department`")
public class Department implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "`name`", length = 50, unique = true)
    @NonNull
    private String name;

    @Column(name = "total_member")
    private int totalMember;

    @Column(name = "`type`")
    @Convert(converter = DepartmentTypeConvert.class)
    @NonNull
    private Type type;

    @Column(name = "created_date")
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createdDate;

    @OneToMany(mappedBy = "department")
    private List<Account> accounts;

    public enum Type {
        DEV("Dev"), TEST("Test"), SCRUMMASTER("ScrumMaster"), PM("PM");

        private final String type;

        Type(String type) {
            this.type = type;
        }

        public String getType() {
            return type;
        }

        public static Type toEnum(String sqlType) {
            for (Type t : Type.values()) {
                if (t.getType().equals(sqlType)) {
                    return t;
                }
            }
            return null;
        }
    }

}
