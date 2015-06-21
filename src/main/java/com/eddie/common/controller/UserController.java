package com.eddie.common.controller;

import com.eddie.LiveChat;
import com.eddie.common.model.User;
import com.eddie.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Controller
@RequestMapping("/login")
public class UserController {


    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public
    @ResponseBody
    User getUser(@RequestParam(value = "user") String username, @RequestParam(value = "password") String password) {

        List<com.eddie.domain.User> list = userDao.list();
        for (com.eddie.domain.User user : list) {
            System.out.println(user);
        }
        LiveChat chat = new LiveChat();

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


