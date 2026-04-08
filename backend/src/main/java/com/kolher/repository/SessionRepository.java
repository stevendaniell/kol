package com.kolher.repository;
import com.kolher.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SessionRepository extends JpaRepository<Session, Long> { List<Session> findByStudentIdOrTutorId(Long s, Long t); }