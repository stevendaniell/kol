package com.kolher.repository;
import com.kolher.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {}