package com.Guru.BankingApp.service.Impl;

import com.Guru.BankingApp.dto.AccountDto;
import com.Guru.BankingApp.entity.Account;
import com.Guru.BankingApp.ExceptionCatch.AccountNotFoundException;
import com.Guru.BankingApp.mapper.AccountMapper;
import com.Guru.BankingApp.repository.AccountRepository;
import com.Guru.BankingApp.service.AccountService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public AccountDto createAccount(AccountDto accountDto) {
        Account account = AccountMapper.mapToAccount(accountDto);
        if (account.getBalance() == null) account.setBalance(0.0);
        return AccountMapper.mapToAccountDto(accountRepository.save(account));
    }

    @Override
    public AccountDto getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account with ID " + id + " not found"));
        return AccountMapper.mapToAccountDto(account);
    }

    @Override
    @Transactional
    public AccountDto deposit(Long id, double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit amount must be > 0");
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account with ID " + id + " not found"));
        account.setBalance((account.getBalance() == null ? 0.0 : account.getBalance()) + amount);
        return AccountMapper.mapToAccountDto(accountRepository.save(account));
    }

    @Override
    @Transactional
    public AccountDto withdraw(Long id, double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Withdraw amount must be > 0");
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account with ID " + id + " not found"));
        double balance = account.getBalance() == null ? 0.0 : account.getBalance();
        if (balance < amount) throw new IllegalArgumentException("Insufficient balance");
        account.setBalance(balance - amount);
        return AccountMapper.mapToAccountDto(accountRepository.save(account));
    }

    @Override
    public List<AccountDto> getAllAccounts() {
        return accountRepository.findAll().stream().map(AccountMapper::mapToAccountDto).collect(Collectors.toList());
    }

    @Override
    public void deleteAccount(Long id) {
        if (!accountRepository.existsById(id)) throw new AccountNotFoundException("Account with ID " + id + " not found");
        accountRepository.deleteById(id);
    }
}
