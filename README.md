# Flexmoney Assignment - Yoga Class Form

This project implements a simple admission form for monthly Yoga classes, allowing users to enroll and pay fees.

## Table of Contents
- [Hosting](#hosting)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Assumptions](#assumptions)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [ER Diagram](#er-diagram)
- [Database Design](#database-design)
- [API Endpoints](#api-endpoints)
- [Assignment Overview](#assignment-overview)
- [Thankyou](#thank-you)

## Hosting

[Live Link](https://yoga-class-umn3.onrender.com/login) 🔗

## Tech Stack

- **Frontend**: `React`, `Redux`
- **Backend**: `Node.js`, `Express.js`
- **Database**: `MongoDB`
- **Schema Format:** `JSON`
- **Architecture:** `MVC - Model, View, Controller`


## Requirements

- Only individuals aged 18-65 can enroll.
- Monthly fees: 500/- Rs INR.
- Participants can move to any other batch next month only.
- In the same month, participants need to be in the same batch.
- Basic user data validation.

## Assumptions
-  Payment functionality was assumed to be provided by the 
mockup function `CompletePayment()` as instructed.

- The user information is assumed to be authentic.

- No limit on the maximum strength of a batch was assumed.

- It is assumed that the user **will** complete the monthly payment by the end of the due month. Failure of doing so is not handled therefore.


## Project Structure

<pre>
/
├── README.md
├── package.json
├── package-lock.json
├── server.js
├── .gitignore
├── .env
├── backend/
└── frontend/

</pre>

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- Use a MongoDB Cluster to store the data.
- A database to begin with. Create it with `MongoDBCompass` and set the environment variables in a `.env` file.

## Setup Instructions

1. Clone the repository:

    ```bash
    git clone https://github.com/mahtodeepanshu/flexmoney-assignment.git
    ```

3. Install dependencies in `/root` and `/frontend` directories:

    ```sh
    npm install
    ```
4. Run the application:

    ```sh
    npm run dev
    ```

## ER Diagram

![ER Diagram](/assets/database-er.png)

## Database Design
![DB Design](/assets/db-design.jpeg)


## API Endpoints

- `/`: `POST` endpoint to Sign Up a user.
- `/auth`: `POST` endpoint to Login a user.
- `/logout`: `POST` endpoint to logout.
- `/profile`: Protected `GET` endpoint to fetch details of a user.
- `/profile`: Protected `POST` endpoint to update details of a user.

## Assignment Overview

- **Login -**

![login](/assets/login.gif)

- **Age contraint handling while login -** login will fail if age constraints are not met.
    
![login-age-failed](/assets/login-age-failed.gif)
 

- **Payment action -** 

![pay-success](/assets/pay-success.gif)


- **Slot Updation -** Slot will be updated on the 1st day of the month only with the ast update value in the next month slot field. Slot may be updated anytime within the month for the next month. `node-schedule` npm package is used to achieve this.

```javascript
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

const newMonth = async () => {
    await schedule.scheduleJob('1 * *', async () => {
        try {
            // Fetch all users from the database
            const users = await User.find({});

            // Iterate through all users and update their profile for a new month
            for (const user of users) {
                const previousNextSlot = user.nextSlot;

                // Reset payment status, set current slot to next slot (or 6-7AM if not set), and clear the next slot
                user.paymentStatus = false;
                user.currSlot = (previousNextSlot === null || previousNextSlot === '') ? '6-7AM' : previousNextSlot;
                user.nextSlot = null;

                // Save the updated user profile
                await user.save();
            }

            console.log('Monthly Update Done!');
        } catch (error) {
            console.log('Monthly Update Failed');
        }
    });
}
```

## Thanks
Made with ❤️ by Deepanshu