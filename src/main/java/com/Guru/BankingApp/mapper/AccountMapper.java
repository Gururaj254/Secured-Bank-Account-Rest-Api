package com.Guru.BankingApp.mapper;

import com.Guru.BankingApp.dto.AccountDto;
import com.Guru.BankingApp.entity.Account;

public class AccountMapper {

    //accountDto -> account
    public static Account mapToAccount(AccountDto dto) {
        return new Account(dto.getId(), dto.getAccountHolderName(), dto.getBalance());
    }

    //account -> accountDto
    public static AccountDto mapToAccountDto(Account account) {
        return new AccountDto(account.getId(), account.getAccountHolderName(), account.getBalance());
    }
}
