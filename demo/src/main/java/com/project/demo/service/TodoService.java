package com.project.demo.service;

import com.project.demo.dto.TodoRequest;
import com.project.demo.dto.TodoResponse;
import com.project.demo.entity.Todo;
import com.project.demo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;

    public List<TodoResponse> getAllTodos() {
        return todoRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<TodoResponse> getTodosByStatus(Boolean completed) {
        return todoRepository.findByCompletedOrderByCreatedAtDesc(completed)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Optional<TodoResponse> getTodoById(String id) {
        return todoRepository.findById(id)
                .map(this::mapToResponse);
    }

    public TodoResponse createTodo(TodoRequest request) {
        Todo todo = Todo.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .completed(request.getCompleted() != null ? request.getCompleted() : false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Todo savedTodo = todoRepository.save(todo);
        return mapToResponse(savedTodo);
    }

    public Optional<TodoResponse> updateTodo(String id, TodoRequest request) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setTitle(request.getTitle());
                    todo.setDescription(request.getDescription());
                    if (request.getCompleted() != null) {
                        todo.setCompleted(request.getCompleted());
                    }
                    todo.setUpdatedAt(LocalDateTime.now());
                    return todoRepository.save(todo);
                })
                .map(this::mapToResponse);
    }

    public boolean deleteTodo(String id) {
        if (todoRepository.existsById(id)) {
            todoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private TodoResponse mapToResponse(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .description(todo.getDescription())
                .completed(todo.getCompleted())
                .createdAt(todo.getCreatedAt())
                .updatedAt(todo.getUpdatedAt())
                .build();
    }
}