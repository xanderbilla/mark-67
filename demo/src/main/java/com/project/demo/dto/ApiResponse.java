package com.project.demo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private String message;
    private String error;
    private T data;
    private LocalDateTime timestamp;
    private Integer statusCode;

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .data(data)
                .message(message)
                .timestamp(LocalDateTime.now())
                .statusCode(200)
                .build();
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Success");
    }

    public static <T> ApiResponse<T> error(String error, Integer statusCode) {
        return ApiResponse.<T>builder()
                .error(error)
                .timestamp(LocalDateTime.now())
                .statusCode(statusCode)
                .build();
    }

    public static <T> ApiResponse<T> error(String error) {
        return error(error, 500);
    }
}