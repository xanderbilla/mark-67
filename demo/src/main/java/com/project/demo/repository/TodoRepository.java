package com.project.demo.repository;

import com.project.demo.entity.Todo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends MongoRepository<Todo, String> {
    List<Todo> findByCompletedOrderByCreatedAtDesc(Boolean completed);

    List<Todo> findAllByOrderByCreatedAtDesc();
}