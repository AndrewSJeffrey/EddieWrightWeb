package com.eddie.common.service;

import com.eddie.dao.ContactDao;
import com.eddie.dao.EmailMessageDao;
import com.eddie.domain.Contact;
import com.eddie.domain.EmailMessage;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.*;
import javax.mail.internet.MimeMessage;
import javax.xml.bind.SchemaOutputResolver;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Properties;


@Transactional
public class MailMonitor {


    private EmailMessageDao emailMessageDao;
    private ContactDao contactDao;

    public MailMonitor(EmailMessageDao emailMessageDao, ContactDao contactDao) {
        this.emailMessageDao = emailMessageDao;
        this.contactDao = contactDao;
    }


    public void runMe() {
        check("ajeffrey@fleetsmart.co.uk", "swip3r/vag09");
    }

    public void check(String user,
                      String password) {
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

            store.connect("smtp.gmail.com", user, password);

            Folder emailFolder = store.getFolder("mailparsing");
            emailFolder.open(Folder.READ_ONLY);

            Message[] messages = emailFolder.getMessages();
            final FetchProfile fp = new FetchProfile();
            fp.add("Message-Id");
            emailFolder.fetch(messages, fp);

            for (Message message : messages) {
                EmailMessage emailMessage = new EmailMessage();
                emailMessage.setSubject(message.getSubject());
                emailMessage.setFromField(message.getFrom()[0].toString().replace("\"", ""));
                String messageBody = extractMessageBody(message, "");
                processBody(emailMessage, messageBody);
                emailMessage.setUid(((MimeMessage) message).getMessageID());
                emailMessage.setReceivedDate(message.getReceivedDate());
                emailMessage.setParsedDate(new Date());

                List<Contact> search = contactDao.search(emailMessage.getEmail());
                if (search != null && search.size() == 1) {

                    emailMessage.setAssignedContact(search.get(0));
                }
                emailMessageDao.save(emailMessage);
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


        if (body.toUpperCase().contains("has made an enquiry on the".toUpperCase())) {
            String name = body.split(",")[1].split("has made an enquiry on the")[0].trim();
            String vehicle = body.split("has made an enquiry on the")[1].split("Message:")[0].trim();
            String detail = body.split("Message:")[1].split("Please contact")[0].trim();
            String email = body.split("Email:")[1].split("Thank you")[0].trim();

            message.setName(name);
            message.setEmail(email);
            message.setDetails(vehicle + "\n" + detail);

        }

        else if (body.toUpperCase().contains("Your Sales Lead".toUpperCase())) {

            Document doc = Jsoup.parse(body);
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

            } else if (body.toUpperCase().contains("CLIENT DETAILS")) {
            final String[] lines = body.split("\n");
            String details = "";
            for (final String line : lines) {

                if (line.contains("Dear Regards")) {
                    continue;
                }

                if (line.contains("Client Name:")) {
                    final String name = line.replace("Client Name:", "").trim();
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
                        || line.contains("Reg:")
                        || line.contains("Comments:")
                        ) {
                    details += line + "\n";
                }
            }
            message.setDetails(details);
        } else if (body.toUpperCase().contains("you have a new lead".toUpperCase())) {

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

        } else if (body.toUpperCase().contains("A client has requested details of a car via your website".toUpperCase())) {
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

        } else if (body.toUpperCase().contains("Do not reply to this message. Email sent to this email address are not monitored.".toUpperCase())) {

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
            details += "Transcript: " + transcript + "\n";
            message.setDetails(details);

        }

    }

}
