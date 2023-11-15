# Group 09 - Handcrafted Haven Project

[![Board Status](https://dev.azure.com/bpainterWDD430/e2fc051b-e969-49b7-a370-8a7fe1e030b9/3d08f403-b958-4701-9994-08e6eaf30eb5/_apis/work/boardbadge/b83f3c2c-5ee9-4a0b-b8b6-d595eea89183)](https://dev.azure.com/bpainterWDD430/e2fc051b-e969-49b7-a370-8a7fe1e030b9/_boards/board/t/3d08f403-b958-4701-9994-08e6eaf30eb5/Epics/)

## Team Members

- Bermon Painter
- Eli Cutchen
- Moises Sanchez Molina

## Overview

Handcrafted Haven is a web application designed to serve as a virtual marketplace for artisans and crafters. It provides a platform for showcasing and selling unique handcrafted items, fostering a community of creators and customers who value handmade products. The application emphasizes sustainability, community engagement, and supports local artisans.

## Project Goals

- **Develop Software Development Skills**: Implement a full technology stack in a collaborative, cloud-based environment.
- **Foster Effective Teamwork**: Enhance professionalism and teamwork skills, which are highly valued in the software development industry.
- **Encourage Peer Learning**: Embrace the BYU-Idaho learning model principle of teaching and learning from one another.

### Features

- **Seller Profiles**: Artisans can create profiles to showcase their work and story.
- **Product Listings**: Artisans can list items for sale with detailed descriptions and images.
- **Reviews and Ratings**: Users can leave feedback on products and sellers.
- **Admin Management**: Admins can manage sellers, products, and reviews.
- **Secure E-commerce**: Integrated payment gateways for secure transactions.

### Design

- **Web Development Standards**: Focus on performance, validation, accessibility, SEO, and usability.
- **Responsive Design**: Ensure compatibility with various devices and screen sizes.
- **Branding**: Maintain a consistent visual identity throughout the application.
- **Navigation**: Provide clear and intuitive navigation.
- **Accessibility**: Adhere to WCAG 2.1, Level AA standards.

### Required Technology

- **Front-End**: HTML, CSS (Tailwind CSS), JavaScript, React/Next.js
- **Back-End**: TypeScript, Node.js, Database (choice of Postgres, Mongo, or SQLite)
- **Project Management**: Azure DevOps Boards
- **Code Management**: Azure DevOps Repo
- **Deployment**: Vercel

## Setup and Running the Application

### Prerequisites

- **Next.js**: The application must be a React-based web application using Next.js.
- **Tailwind CSS**: All styling should be done using Tailwind CSS utility classes.
- **MongoDB**: Data persistence is handled with a MongoDB database.
- **Vercel**: Deployment and hosting of the web application.
- **Authentication**: Implement user authentication and authorization.
- **APIs**: Develop APIs for client-server communication.

### Installation

1. Clone the project repository:
   ```bash
   git clone https://dev.azure.com/bpainterWDD430/wdd430-bpainter/_git/wdd430-group09-project
   cd wdd430-group09-project

2. Install Dependencies:
   ```bash 
   npm install

3. Set up environment variables in a `.env.local` file for database connections and API endpoints.:
   ```bash 
   MONGODB_URI=mongodb+srv://group09:<provided in the group chat>@cluster0.peig0sx.mongodb.net/?retryWrites=true&w=majority

4. Run the development server:
   ```bash 
   npm run dev

5. Access the application at `http://localhost:3000`.

6. Deployment
Set up continuous deployment through Vercel through Azure Dev Ops coming soon...
