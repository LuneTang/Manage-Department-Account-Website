package com.vti.entity;

import javax.persistence.AttributeConverter;

public class DepartmentTypeConvert implements AttributeConverter<Department.Type, String> {

    @Override
    public String convertToDatabaseColumn(Department.Type type) {
        return type == null ? null : type.getType();
    }

    @Override
    public Department.Type convertToEntityAttribute(String sqlType) {
        return sqlType == null ? null : Department.Type.toEnum(sqlType);
    }
}
