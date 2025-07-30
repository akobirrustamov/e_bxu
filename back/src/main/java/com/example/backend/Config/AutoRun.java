package com.example.backend.Config;

import com.example.backend.Entity.*;
import com.example.backend.Enums.AppealTypes;
import com.example.backend.Enums.UserRoles;
import com.example.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Configuration
@RequiredArgsConstructor
public class AutoRun implements CommandLineRunner {
    private final RoleRepo roleRepo;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    @Override
    public void run(String... args) throws Exception {
        if (roleRepo.findAll().isEmpty()) {
            saveRoles();
        }
        checkAndCreateUser("admin", "00000000", "Default Admin", UserRoles.ROLE_ADMIN);
        checkAndCreateUser("superadmin", "00000000", "Super Admin", UserRoles.ROLE_SUPERADMIN);
        checkAndCreateUser("Akobir", "Akobir", "Super Admin", UserRoles.ROLE_SUPERADMIN);
        checkAndCreateUser("rektor", "00000000", "Siddiqova Sadoqat G‘afforovna", UserRoles.ROLE_REKTOR);

    }





    private void checkAndCreateUser(String phone, String password, String name, UserRoles role) {
        Optional<User> userByPhone = userRepo.findByPhone(phone);
        if (userByPhone.isEmpty()) {
            User user = User.builder()
                    .phone(phone)
                    .name(name)  // Storing the user's name
                    .password(passwordEncoder.encode(password))
                    .roles(List.of(roleRepo.findByName(role)))
                    .build();
            userRepo.save(user);
        }
    }

    private List<Role> saveRoles() {
        return roleRepo.saveAll(List.of(
                new Role(1, UserRoles.ROLE_ADMIN),
                new Role(2, UserRoles.ROLE_STUDENT),
                new Role(3, UserRoles.ROLE_REKTOR),
                new Role(4, UserRoles.ROLE_TEACHER),
                new Role(5, UserRoles.ROLE_SUPERADMIN),
                new Role(6, UserRoles.ROLE_USER),
                new Role(7, UserRoles.ROLE_DEKAN)
        ));
    }


}
