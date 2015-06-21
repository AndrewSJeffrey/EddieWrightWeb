package com.eddie.common.controller;

import com.eddie.common.model.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;



@Controller
@RequestMapping("/login")
public class UserController {




    @RequestMapping(value = "", method = RequestMethod.GET)
    public
    @ResponseBody
    User getUser(@RequestParam(value = "user") String username, @RequestParam(value = "password") String password) {


        if ("sysadmin".equalsIgnoreCase(username)) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(password + "asd");
            System.out.println(user);

            return user;
        }
        return null;

    }

}


