package com.project.demo.controller;

import com.project.demo.dto.ApiResponse;
import com.project.demo.dto.TodoRequest;
import com.project.demo.dto.TodoResponse;
import com.project.demo.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {
    // Todo API Controller - handles CRUD operations

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TodoResponse>>> getAllTodos(
            @RequestParam(required = false) Boolean completed) {
        List<TodoResponse> todos = completed != null
                ? todoService.getTodosByStatus(completed)
                : todoService.getAllTodos();

        return ResponseEntity.ok(ApiResponse.success(todos, "Todos retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> getTodoById(@PathVariable String id) {
        return todoService.getTodoById(id)
                .map(todo -> ResponseEntity.ok(ApiResponse.success(todo, "Todo retrieved successfully")))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Todo not found", 404)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TodoResponse>> createTodo(@Valid @RequestBody TodoRequest request) {
        TodoResponse todo = todoService.createTodo(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(todo, "Todo created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> updateTodo(
            @PathVariable String id,
            @Valid @RequestBody TodoRequest request) {
        return todoService.updateTodo(id, request)
                .map(todo -> ResponseEntity.ok(ApiResponse.success(todo, "Todo updated successfully")))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Todo not found", 404)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTodo(@PathVariable String id) {
        if (todoService.deleteTodo(id)) {
            return ResponseEntity.ok(ApiResponse.success(null, "Todo deleted successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Todo not found", 404));
        }
    }
}