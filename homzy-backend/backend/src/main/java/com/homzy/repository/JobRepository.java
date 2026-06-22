package com.homzy.repository;
import com.homzy.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByClientId(Long clientId);
    List<Job> findByStatusAndCategory(String status, String category);

    @Query("SELECT j FROM Job j WHERE j.worker.id = :workerId")
    List<Job> findByWorkerId(@Param("workerId") Long workerId);

    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' ORDER BY j.createdAt DESC")
    List<Job> findOpenJobs();
    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' AND j.category = :category ORDER BY j.createdAt DESC")
    List<Job> findOpenJobsByCategory(@Param("category") Job.Category category);
}