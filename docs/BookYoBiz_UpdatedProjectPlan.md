# 📘 BookYoBiz – Updated Project Plan

## 1) Vision & Goals
- **Umbrella brand**: BookYoBiz – SaaS platform for booking, business growth, and talent hiring.  
- **Dynamic branding**: BookYoBarber, BookYoSalon, BookYoSpa, etc. – playful, quirky, relatable.  
- **Full growth toolkit**: Appointments, payments, staff hiring, ads, and discovery maps.  
- **Mobile-first design**: React + Bootstrap, fully responsive, icon-based UI.  
- **Business empowerment**: Help small businesses get **customers, staff, and visibility**.

---

## 2) Branding & Marketing
- **Main Brand**: BookYoBiz (`bookyobiz.com`)  
- **Vertical Brands**:  
  - BookYoBarber ✂️  
  - BookYoSalon 💇‍♀️  
  - BookYoNails 💅  
  - BookYoMassage 💆  
  - BookYoTattoo 🎨  
  - BookYoSpa 🌿  
  - BookYoFitness 🏋️  
  - BookYoClinic 🏥  
  - BookYoPlumber 🔧  
  - BookYoElectrician ⚡  
- **Domain Strategy**: one umbrella + dynamic branding OR subdomains.  
- **Tone**: quirky, fun, approachable, trustworthy.  

---

## 3) MVP Scope
- Multi-tenant SaaS with tenant keyword switcher (business type).  
- **Booking system**:  
  - Services, staff, availability, deposits/payments, reminders.  
- **Admin dashboard**: manage appointments, services, promos, deposits.  
- **Authentication**: Owner, Staff, Customer (JWT).  
- **Payments**: Stripe for deposits & full payments.  
- **Notifications**: Email + WhatsApp.  
- **UI/UX**: 2D parallax homepage, Bootstrap grid, icon libraries.  
- **Colors per vertical**:  
  - Barbershop → Black & Gold  
  - Salon → Lilac & White  
  - Spa → Green & White  
  - Tattoo → Black & Red  
  - Massage → Beige & Green  
  - Fitness → Navy & Neon Green  
  - Nails → Pink & White  
  - Electrician → Yellow & Black  
  - Plumber → Blue & White  

---

## 4) Phase 2 Features
### Job Board
- Businesses can **post job vacancies** (part-time, casual, full-time).  
- Professionals can **apply directly** via platform.  
- Admin dashboard → manage job listings & applicants.  
- Categories: barber, nail artist, spa therapist, tattooist, massage therapist, **plumber, electrician, handyman**.  
- Job postings appear **alongside the booking portal** → dual utility.  

### Map Services
- Businesses displayed on an **interactive map** (Google Maps or Mapbox).  
- Search by service + location (“barber near me,” “electrician near me”).  
- Pins show business info + booking CTA.  

### Ads & Promotions
- Businesses can pay to **feature their ads** on the homepage or search results.  
- Ads: banners, promoted listings, “featured service provider.”  
- SaaS revenue stream from **ads + subscriptions + Stripe fees**.  

---

## 5) Future Features (Phase 3)
- **AI Voice Bot**: callbacks, follow-ups for missed or unconfirmed bookings.  
- **Reply Bots**: automate Gmail/WhatsApp appointment responses.  
- **3D Branding**: Framer Motion + Three.js hero animations.  
- **Loyalty & Referrals**: rewards, points, gift cards.  
- **Waitlist System**: auto-fill cancellations.  
- **Mobile App**: React Native/Expo version for staff & customers.  
- **Analytics Dashboards**: funnels, retention, revenue, hiring metrics.  

---

## 6) Tech Stack
- **Frontend**: React (Vite), Bootstrap 5, Bootstrap Icons/Lucide/FontAwesome.  
- **Backend**: Express.js (Node), REST APIs, JWT auth, Stripe SDK, Twilio/Meta WhatsApp API, SendGrid/Resend.  
- **Database**: MongoDB Atlas (tenantId-based multi-tenancy).  
- **Deployment**: Vercel (frontend), Render (backend), GitHub Actions (CI/CD).  
- **Jobs & Reminders**: BullMQ + Redis.  
- **Maps**: Google Maps API / Mapbox.  

---

## 7) Data Model
- **Tenant**: brand info, colors, vertical, contact details.  
- **User**: { owner | staff | customer | applicant }.  
- **Service**: name, duration, price, deposit.  
- **Staff**: name, working hours, assigned services.  
- **Appointment**: service, staff, customer, time, payment, status.  
- **Notification**: channel, template, sent status.  
- **Promotion**: codes, discounts.  
- **Job**: title, description, type, businessId, applicants[].  
- **Ad**: businessId, type (banner/featured), duration, metrics.  

---

## 8) Admin Features
- **Calendar**: day/week/month views.  
- **Jobs**: post vacancy, review applicants.  
- **Ads**: create campaign, pay, track impressions/clicks.  
- **Promos**: discounts, referral codes.  
- **Analytics**: bookings, revenue, jobs posted, applications.  

---

## 9) Customer Features
- **Booking flow**: Service → Staff → Time → Details → Pay Deposit → Confirm.  
- **Job seeker portal**: Browse vacancies by keyword, apply via form/upload resume.  
- **Discovery map**: Nearby businesses with “Book Now” buttons.  
- **Ads view**: See featured promotions relevant to category.  

---

## 10) Revenue Model
- SaaS subscription ($50–$100 AUD / business per month).  
- Stripe transaction fee (1–2%).  
- Premium ad campaigns (CPC or flat monthly).  
- Paid job postings (beyond free tier).  
- Premium tier for AI + analytics.  

---

## 11) Roadmap
**Phase 1 (MVP)**  
- Multi-tenant base.  
- Parallax landing, booking flow, Stripe deposits.  
- Admin dashboard.  
- WhatsApp + email reminders.  
- Color themes per vertical.  

**Phase 2 (Growth)**  
- Job board.  
- Map discovery service.  
- Ads & promotions.  

**Phase 3 (Expansion)**  
- AI callbacks, bots, loyalty, waitlist.  
- 3D branding with Framer/Three.js.  
- Mobile app.  
- Full analytics suite.  

---

## 12) Risks & Mitigations
- **Scope creep**: Keep strict phase boundaries.  
- **Render cold starts**: add health pings or upgrade plan.  
- **Ad marketplace abuse**: moderation tools.  
- **Jobs overlap** with marketplaces: differentiate with **appointments-first** focus.  

---

## ✅ Summary
**BookYoBiz** has evolved into more than a booking SaaS. It’s a **local business growth platform**:  
- Bookings + payments.  
- Job vacancies for professionals.  
- Discovery via maps.  
- Monetization via ads.  

Start lean with bookings, then expand into jobs, maps, and ads. **From “BookYoBarber” to “BookYoPlumber,” BookYoBiz empowers every small business.**  
