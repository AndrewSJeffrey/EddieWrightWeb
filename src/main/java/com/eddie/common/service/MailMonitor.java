package com.eddie.common.service;

import com.eddie.Main;
import com.eddie.dao.ContactDao;
import com.eddie.dao.EmailMessageDao;
import com.eddie.domain.Contact;
import com.eddie.domain.EmailDetails;
import com.eddie.domain.EmailMessage;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.html.simpleparser.HTMLWorker;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.commons.lang3.StringUtils;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.tidy.Tidy;
import org.xhtmlrenderer.pdf.ITextRenderer;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.search.FlagTerm;
import javax.mail.search.MessageIDTerm;
import javax.mail.search.SearchTerm;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.Properties;


@Transactional
public class MailMonitor {


    private String username =  "ajeffrey@fleetsmart.co.uk";
    private String password = "swip3r/vag09";
    private static URL EMAIL_DIR  = MailMonitor.class.getClassLoader().getResource("../emails/");

    private EmailMessageDao emailMessageDao;
    private ContactDao contactDao;

    public MailMonitor(EmailMessageDao emailMessageDao, ContactDao contactDao) {
        this.emailMessageDao = emailMessageDao;
        this.contactDao = contactDao;
    }


    public EmailDetails getMessage(int messageId) {
        EmailDetails emailDetails = new EmailDetails();

        try {
            Properties properties = new Properties();
            properties.put("mail.smtp.host", "smtp.gmail.com");
            properties.put("mail.smtp.socketFactory.port", 465);
            properties.put("mail.smtp.auth", true);
            properties.put("mail.smtp.auth", "true");
            properties.put("mail.smtp.port", 465);
            properties.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            Session emailSession = Session.getDefaultInstance(properties);
            Store store = emailSession.getStore("imaps");
            store.connect("smtp.gmail.com", username, password);

            Folder emailFolder = store.getFolder("mailparsing");
            emailFolder.open(Folder.READ_WRITE);

            //
            EmailMessage loadedMessage = emailMessageDao.load(messageId);
            if (loadedMessage == null) {
                return emailDetails;
            }

            SearchTerm searchTerm = new MessageIDTerm(loadedMessage.getUid());
            Message[] messages = emailFolder.search(searchTerm);
            for (Message message : messages) {
                emailDetails.setSubject(message.getSubject());
                emailDetails.setSentOn(message.getReceivedDate());
                Address[] froms = message.getFrom();
                String email = froms == null ? null : ((InternetAddress) froms[0]).getAddress();
                emailDetails.setFrom(email);
                String messageBody = extractMessageHtmlBody(message, "");
                File f = new File(EMAIL_DIR.getPath(), messageId + ".html");
                OutputStream html = new FileOutputStream(f);
                html.write(messageBody.getBytes());
                html.close();
                emailDetails.setUrl("emails/" + messageId + ".html");
            }

        } catch (NoSuchProviderException e) {
            e.printStackTrace();
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return emailDetails;
    }




    public void runMe() {
        check();
    }

    public void check() {
        try {
            Properties properties = new Properties();
            properties.put("mail.smtp.host", "smtp.gmail.com");
            properties.put("mail.smtp.socketFactory.port", 465);
            properties.put("mail.smtp.auth", true);
            properties.put("mail.smtp.auth", "true");
            properties.put("mail.smtp.port", 465);
            properties.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            Session emailSession = Session.getDefaultInstance(properties);
            Store store = emailSession.getStore("imaps");

            store.connect("smtp.gmail.com", username, password);

            Folder emailFolder = store.getFolder("mailparsing");
            emailFolder.open(Folder.READ_WRITE);

            Message[] messages = emailFolder.search(new FlagTerm(new Flags(Flags.Flag.SEEN), false));

            final FetchProfile fp = new FetchProfile();
            fp.add("Message-Id");
            emailFolder.fetch(messages, fp);


            int count = 0;
            for (Message message : messages) {
                EmailMessage email = new EmailMessage();
                email.setSubject(message.getSubject());
                email.setFromField(message.getFrom()[0].toString().replace("\"", ""));
                String messageBody = extractMessageBody(message, "");
                processBody(email, messageBody);
                email.setUid(((MimeMessage) message).getMessageID());
                email.setReceivedDate(message.getReceivedDate());
                email.setParsedDate(new Date());
/*
                System.out.println("****************");
                System.out.println(email.getSubject());
                System.out.println(email.getName());
                System.out.println(email.getEmail());
                System.out.println(email.getPhoneNumber());
                System.out.println("----- Details -----");
                System.out.println(email.getDetails());
                System.out.println("****************");*/


                List<Contact> search = contactDao.search(email.getEmail());
                if (search != null && search.size() == 1) {
                    email.setAssignedContact(search.get(0));
                }

                EmailMessage save = emailMessageDao.save(email);
                if (save.getId() != null) {
                    message.setFlag(Flags.Flag.SEEN, true);
                  //  System.out.println("saved:" + save.getId());
                } else {
                   // System.out.println("failed");
                }

                count++;
                System.out.println("Processed:" + count);
            }

            emailFolder.close(false);
            store.close();

        } catch (NoSuchProviderException e) {
            e.printStackTrace();
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public String extractMessageHtmlBody(Object obj, String out) throws IOException, MessagingException {

        if (obj instanceof MimeMessage) {
            out = extractMessageBody(((MimeMessage) obj).getContent(), out);
        }

        if (obj instanceof Multipart) {
            Multipart content = (Multipart) obj;
            int count = content.getCount();
            for (int i = 0; i < count; i++) {
                BodyPart part = content.getBodyPart(i);
                out = extractMessageBody(part, out);
            }
        }

        if (obj instanceof BodyPart) {
            BodyPart bodyPart = (BodyPart) obj;
            if (bodyPart.isMimeType("text/plain")) {
                out += (String) bodyPart.getContent();
            } else if (bodyPart.isMimeType("text/html")) {
                String html = (String) bodyPart.getContent();
                out = html;
            } else if (bodyPart.isMimeType("multipart/*")) {
                Multipart mp = (Multipart) bodyPart.getContent();
                for (int i = 0; i < mp.getCount(); i++) {
                    out = extractMessageBody(mp.getBodyPart(i), out);
                }
            }
        } else {
            out += obj.toString();
        }

        return out;
    }

    public String extractMessageBody(Object obj, String out) throws IOException, MessagingException {

        if (obj instanceof MimeMessage) {
            out = extractMessageBody(((MimeMessage) obj).getContent(), out);
        }

        if (obj instanceof Multipart) {
            Multipart content = (Multipart) obj;
            int count = content.getCount();
            for (int i = 0; i < count; i++) {
                BodyPart part = content.getBodyPart(i);
                out = extractMessageBody(part, out);
            }
        }

        if (obj instanceof BodyPart) {
            BodyPart bodyPart = (BodyPart) obj;
            if (bodyPart.isMimeType("text/plain")) {
                out += (String) bodyPart.getContent();
            } else if (bodyPart.isMimeType("text/html")) {
                String html = (String) bodyPart.getContent();
                out += Jsoup.parse(html).text();
            } else if (bodyPart.isMimeType("multipart/*")) {
                Multipart mp = (Multipart) bodyPart.getContent();
                for (int i = 0; i < mp.getCount(); i++) {
                    out = extractMessageBody(mp.getBodyPart(i), out);
                }
            }
        } else {
            out += obj.toString();
        }

        return out;
    }

    public void processBody(EmailMessage message, String body) {

        if (body.contains("Used Car Enquiry for Eddie Wright Car Supermarket")) {
            body = Jsoup.parse(body).text();
            body = body
                    .replace("Customer's", "")
                    .replace("Customer", "\nCustomer")
                    .replace("Phone Number", "\nPhone Number:")
                    .replace("Email Address", "\nEmail Address")
                    .replace("Enquiry", "\nEnquiry")
                    .replace("advert that this enquiry", "\nadvert that this enquiry");

            String[] lines = body.split("\n");
            for (int i = 0; i < lines.length; i++) {
                if (lines[i].contains("Customer")) {
                    String name = lines[i].replace("Customer", "").trim();
                    message.setName(name);
                }

                if (lines[i].contains("Email Address")) {
                    String email = lines[i].replace("Email Address", "").trim();
                    message.setEmail(email);
                }

                if (lines[i].contains("Phone Number:")) {
                    String phone = lines[i].replace("Phone Number:", "").trim();
                    message.setPhoneNumber(phone);
                }

                if (lines[i].contains("Enquiry I would like to know:")) {
                    String detail = lines[i].replace("Enquiry I would like to know:", "").trim();
                    message.setDetails(detail);
                }
            }

        } else if (body.toUpperCase().contains("A previous lead was recently active on" .toUpperCase())) {
            body = Jsoup.parse(body).text();
            body = body
                    .replace("Name", "\nName")
                    .replace("Phone", "\nPhone:")
                    .replace("Email", "\nEmail")
                    .replace("Comments", "\nComments")
                    .replace("No phone number", "\nNo phone number")
                    .replace("Search Criteria", "\nSearch Criteria");
            //  .replace("Your Vehicle", "\nYour Vehicle");

            String name = body.split("==")[1];
            String[] lines = body.replaceAll("[\r\n]+", "\n").split("\n");

            for (int i = 0; i < lines.length; i++) {

                if (lines[i].contains("Email")) {
                    String email = lines[i].replace("Email", "").trim();
                    message.setEmail(email);
                }

                if (lines[i].contains("Comments")) {
                    String comments = lines[i].replace("Comments", "").trim();
                    message.setDetails(comments);
                }

                if (lines[i].contains("Phone:")) {
                    String phone = lines[i].replace("Phone:", "").trim();
                    message.setPhoneNumber(phone);
                }

            }

            name = name.replace(message.getEmail(), "").trim();
            if (name.contains("Name not provided")) {
                name = "N/A";
            }
            message.setName(name);
        } else if (body.toUpperCase().contains("has made an enquiry on the" .toUpperCase())) {
            String name = body.split(",")[1].split("has made an enquiry on the")[0].trim();
            String vehicle = body.split("has made an enquiry on the")[1].split("Message:")[0].trim();
            String detail = body.split("Message:")[1].split("Please contact")[0].trim();
            String email = body.split("Email:")[1].split("Thank you")[0].trim();

            message.setName(name);
            message.setEmail(email);
            message.setDetails(vehicle + "\n" + detail);

        } else if (body.toUpperCase().contains("Your Sales Lead" .toUpperCase())) {

            org.jsoup.nodes.Document doc = Jsoup.parse(body);
            body = doc.text()
                    .replace("Name:", "\nName:")
                    .replace("Phone:", "\nPhone:")
                    .replace("Email:", "\nEmail:")
                    .replace("Detail:", "\nDetail:")
                    .replace("Your Vehicle", "\nYour Vehicle");

            final String[] lines = body.split("\n");

            for (final String line : lines) {


                if (line.contains("Name:")) {
                    final String name = line.replace("Name:", "").trim();
                    message.setName(name);
                }

                if (line.contains("Email:")) {
                    final String email = line.replace("Email:", "").split("<")[0].trim();
                    message.setEmail(email);
                }

                if (line.contains("Phone:")) {
                    final String number = line.replace("Phone:", "").trim();
                    message.setPhoneNumber(number);
                }

                if (line.contains("Detail:")) {
                    final String detail = line.replace("Detail:", "").trim();
                    message.setDetails(detail);
                }
            }

        } else if (body.toUpperCase().contains("CLIENT DETAILS") || body.toUpperCase().contains("PART EXCHANGE VALUATION ENQUIRY ")) {


            final String[] lines = body.split("\n");
            String details = "";
            for (String line : lines) {
                line = Jsoup.parse(line).text();

                if (line.contains("Dear Regards")) {
                    continue;
                }

                if (line.contains("Client Name:")) {
                    final String name = Jsoup.parse(line.replace("Client Name:", "").trim()).text();
                    message.setName(name);
                }

                if (line.contains("Email Address:")) {
                    final String email = line.replace("Email Address:", "").split("<")[0].trim();
                    message.setEmail(email);
                }

                if (line.contains("Phone Number:")) {
                    final String number = line.replace("Phone Number:", "").trim();
                    message.setPhoneNumber(number);
                }

                if (line.contains("Enquiry Type:")
                        || line.contains("Company:")
                        || line.contains("Preferred Contact Time:")
                        || line.contains("Make:")
                        || line.contains("Model:")
                        || line.contains("Mileage:")
                        || line.contains("Reg:")
                        || line.contains("Comments:")
                        ) {
                    details += line + "\n";
                }
            }
            message.setDetails(details);
        } else if (body.toUpperCase().contains("you have a new lead" .toUpperCase())) {

            String[] lines = body.replaceAll("[\r\n]+", "\n").split("\n");
            String details = "";

            for (int i = 0; i < lines.length - 1; i++) {
                if (lines[i].contains("Name")) {
                    message.setName(lines[i + 1].trim());
                }
                if (lines[i].contains("Message")) {
                    details += "Message: " + lines[i + 1].trim() + '\n';
                }
                if (lines[i].contains("Telephone number")) {
                    message.setPhoneNumber(lines[i + 1].trim());
                }
                if (lines[i].contains("Contact preference")) {
                    details += "Contact Preference: " + lines[i + 1].trim() + '\n';
                }
                if (lines[i].contains("Email address")) {
                    String email = lines[i + 1].split("<")[0].split(" ")[0].trim();
                    message.setEmail(email);
                }
                if (lines[i].contains("Registration")) {
                    details += "Registration: " + lines[i + 1].trim() + '\n';
                }
                if (lines[i].contains("Vehicle details") && !lines[i + 1].contains("Registration")) {
                    details += "Vehicle: " + lines[i + 1].trim() + '\n';
                }
            }
            message.setDetails(details);

        } else if (body.toUpperCase().contains("A client has requested details of a car via your website" .toUpperCase())) {
            String[] lines = body.replaceAll("[\r\n]+", "\n").split("\n");
            for (String line : lines) {

                if (line.contains("CogCast")) {
                    continue;
                }

                if (line.contains("Client phone number:")) {
                    String phone = line.replace("Client phone number:", "").trim();
                    message.setPhoneNumber(phone);
                }

                if (line.contains("Client email address:")) {
                    String email = line.replace("Client email address:", "").split("<")[0].trim();
                    message.setEmail(email);
                }

                if (line.contains("Reg:")) {
                    message.setDetails(line);
                }
            }

        } else if (body.toUpperCase().contains("Do not reply to this message. Email sent to this email address are not monitored." .toUpperCase())) {

            String[] lines = body.replaceAll("[\r\n]+", "\n").split("\n");
            String details = "";
            for (String line : lines) {
                if (line.contains("Name :")) {
                    String name = line.replace("Name :", "").trim();
                    message.setName(name);
                }
                if (line.contains("Phone :")) {
                    String phone = line.replace("Phone :", "").trim();
                    message.setPhoneNumber(phone);
                }
                if (line.contains("Email :")) {
                    String email = line.replace("Email :", "").trim();
                    message.setEmail(email);
                }
                if (line.contains("Context:") || line.contains("Origination:")) {
                    details += line + "\n";
                }
            }

            String transcript = "";
            int transId = 0;
            for (int i = 0; i < lines.length; i++) {
                if (lines[i].contains("Transcript:")) {
                    transId = i + 1;
                    break;
                }
            }
            for (int i = transId; i < lines.length - 1; i++) {
                transcript += lines[i] + '\n';
            }
            details += "Transcript:\n" + transcript + "\n";
            message.setDetails(details);

        }
        String abbreviate = StringUtils.abbreviate(message.getDetails(), 10000);
        String phone = StringUtils.abbreviate(message.getPhoneNumber(), 12);
        String email = StringUtils.abbreviate(message.getEmail(), 250);
        String name = StringUtils.abbreviate(message.getName(), 250);
        message.setDetails(abbreviate);
        message.setPhoneNumber(phone);
        message.setEmail(email);
        message.setName(name);
    }

    public static void cleanHtml(String filename) {
        File file = new File(filename + ".html");
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        OutputStream out = null;
        try {
            out = new FileOutputStream(filename + ".xhtml");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        final Tidy tidy = new Tidy();
        tidy.setQuiet(false);
        tidy.setShowWarnings(true);
        tidy.setShowErrors(0);
        tidy.setMakeClean(true);
        tidy.setForceOutput(true);


        org.w3c.dom.Document document = tidy.parseDOM(in, out);
    }
    public static void createPdf(String filename)
            throws IOException, DocumentException {

        OutputStream os = new FileOutputStream(filename + ".pdf");
        ITextRenderer renderer = new ITextRenderer();

        renderer.setDocument(new File(filename + ".xhtml"));
        renderer.layout();
        renderer.createPDF(os) ;
        os.close();
    }

}

