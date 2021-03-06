package com.eddie.common.controller;

import com.eddie.dao.EventDao;
import com.eddie.domain.Event;
import com.eddie.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.List;

@Controller
@Transactional
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventDao eventDao;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public
    @ResponseBody
    List<Event> getEvents() {

        try {
            List<Event> events = eventDao.activeEvents();
            return events;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }


    @ResponseBody
    @RequestMapping(value = "/new", method = {RequestMethod.POST})
    public Event create(@RequestBody final Event event) {
        final Date dateNow = new Date();
        event.setId(null);
        event.setCreatedAt(dateNow);
        event.setModifiedAt(dateNow);
        eventDao.save(event);
        return event;
    }

    @ResponseBody
    @RequestMapping(value = "/update", method = {RequestMethod.POST})
    public Event update(@RequestBody final Event event) {
        final Date dateNow = new Date();
        event.setModifiedAt(dateNow);
        eventDao.save(event);
        return event;
    }

    @ResponseBody
    @RequestMapping(value = "/delete", method = {RequestMethod.POST})
    public Event delete(@RequestBody final Event event) {
        final Date dateNow = new Date();
        event.setRemoved(true);
        event.setModifiedAt(dateNow);
        eventDao.save(event);
        return event;
    }

    @ResponseBody
    @RequestMapping(value = "/restore", method = {RequestMethod.POST})
    public Event restore(@RequestBody final Event event) {
        final Date dateNow = new Date();
        event.setRemoved(false);
        event.setModifiedAt(dateNow);
        eventDao.save(event);
        return event;
    }
}