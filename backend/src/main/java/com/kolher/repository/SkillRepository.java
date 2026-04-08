package com.kolher.repository;
import com.kolher.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SkillRepository extends JpaRepository<Skill, Long> { List<Skill> findBySkillNameContainingIgnoreCase(String q); }