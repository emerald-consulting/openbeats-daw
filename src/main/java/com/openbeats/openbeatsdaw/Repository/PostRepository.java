package com.openbeats.openbeatsdaw.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openbeats.openbeatsdaw.model.Entity.Post;


public interface PostRepository extends JpaRepository<Post, Long>{

}
