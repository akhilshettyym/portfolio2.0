### Method: POST - contact-inquiry

```
URL: http://localhost:5000/api/user/contact-inquiry
```

```json payload
{
 "name": "Jane Doe",
 "email": "jane.doe@example.com",
 "organization": "Tech Innovations Inc.",
 "role": "Tech Recruiter",
 "purpose": "say_hi",
 "message": "Hey there! I really love your portfolio work and wanted to reach out to connect."
}

{
 "name": "Bruce Wayne",
 "email": "bruce@waynecorp.com",
 "organization": "Wayne Enterprises",
 "role": "CEO",
 "purpose": "work",
 "projectType": "fullstack",
 "budget": "10k_plus",
 "deadline": "2026-12-31",
 "message": "We need a secure, scalable dashboard built out for tracking asset analytics before the end of the year."
}

{
 "organization": "Ghost Company",
 "message": "This should fail because I didn't provide a name, email, or a purpose."
}

{
 "name": "Peter Parker",
 "email": "peter@dailybugle.com",
 "purpose": "work",
 "message": "I want to work with you on a website project but am leaving out my budget and project type details."
}

{
 "name": "Tony Stark",
 "email": "tony-stark-invalid-email",
 "purpose": "work",
 "projectType": "invalid_tech_type_here",
 "budget": "under_1k",
 "message": "Short"
}
```

---

### Method: POST - admin login

```
URL: http://localhost:5000/api/auth/login
```

```json payload
{
 "email": "admin@portfolio.com",
 "password": "WrongPasswordAttempt"
}

{
 "email": "admin@portfolio.com",
 "password": "SuperSecurePassword123!"
}
```

---

### Method: POST - admin logout

```
URL: http://localhost:5000/api/auth/logout
```

### Method: GET - admin fetch

```
URL: http://localhost:5000/api/admin/get-all-inquiries
```

### Method: DELETE - admin delete

```
URL: http://localhost:5000/api/admin/delete-details/:id
URL: http://localhost:5000/api/admin/delete-details/6a43926b4133f6a097dc534c
```