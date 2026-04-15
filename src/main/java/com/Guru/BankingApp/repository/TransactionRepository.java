package com.Guru.BankingApp.repository;

import com.Guru.BankingApp.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * Finds all transactions for a specific account.
     * OrderByTimestampDesc ensures the newest transactions appear at the top.
     */
    List<Transaction> findByAccountIdOrderByTimestampDesc(Long accountId);
}