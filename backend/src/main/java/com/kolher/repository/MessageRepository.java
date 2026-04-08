package com.kolher.repository;

import com.kolher.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findTop50ByOrderByCreatedAtAsc();
}
