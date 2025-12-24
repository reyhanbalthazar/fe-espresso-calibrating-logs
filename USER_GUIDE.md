# Espresso Calibrating Application - User Guide

Welcome to the Espresso Calibrating Application! This guide will walk you through setting up and using all the features of this application to help you achieve perfect espresso extractions.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Setup and Installation](#setup-and-installation)
4. [Getting Started](#getting-started)
5. [Feature Walkthrough](#feature-walkthrough)
6. [Advanced Features](#advanced-features)
7. [Troubleshooting](#troubleshooting)

## Project Overview

The Espresso Calibrating Application is a comprehensive tool designed to help coffee enthusiasts and professionals track, analyze, and optimize their espresso extraction parameters. The application allows you to:

- Manage your coffee beans inventory
- Track your grinder specifications
- Log and analyze calibration sessions
- Visualize extraction trends and patterns
- Identify optimal extraction parameters

## Prerequisites

Before setting up the application, ensure you have:

- Node.js (v18 or higher)
- npm or yarn package manager
- Access to the backend API (typically running on http://localhost:8000/api)
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Setup and Installation

### Frontend Setup

1. **Clone or download the frontend repository**
   ```bash
   git clone <repository-url>
   cd espresso-calibrating-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with the following content:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```
   (Replace with your actual backend API URL)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

### Backend Setup

1. **Ensure the backend API is running**
   The frontend requires a backend API server to function properly. If you don't have it set up:
   - Clone the backend repository
   - Follow the backend setup instructions
   - Make sure it's running on the configured API URL

## Getting Started

### 1. Create an Account

1. Navigate to the registration page at `/register`
2. Fill in your details:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
3. Click "Register"
4. You'll be redirected to the login page after successful registration

### 2. Login to Your Account

1. Go to the login page at `/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the dashboard

## Feature Walkthrough

### Dashboard

The dashboard is your central hub for viewing analytics and insights about your espresso calibration sessions.

**Features:**
- **Summary Statistics**: Total shots, optimal shots, optimal percentage, average extraction yield, and average extraction ratio
- **Recommendations**: AI-powered suggestions for optimal extraction parameters
- **Visualization Charts**:
  - Extraction Yield Trends: Scatter plot showing extraction yield over time
  - Extraction Ratio vs Grind Setting: Scatter plot comparing extraction ratio with grind settings
  - Bean Performance Comparison: Bar chart comparing different beans' performance
  - Session Comparative Analysis: Bar chart comparing different sessions
- **Recent Extraction Trends Table**: Shows the 10 most recent extraction data points

### Bean Management

Navigate to `/beans` to manage your coffee beans inventory.

**Features:**
- **Add New Bean**: Click "Add Bean" to create a new bean entry
- **Search/Filter**: Search beans by name, roastery, origin, or notes
- **View Bean Details**: Each bean card shows name, roastery, origin, roast level, roast date, and notes
- **Edit Bean**: Click the edit button to modify bean information
- **Delete Bean**: Click the delete button to remove a bean (with confirmation)

**Bean Form Fields:**
- Name: The name of the coffee bean
- Roastery: The roastery that roasted the beans
- Origin: The origin country/region of the beans
- Roast Level: Light, Medium, or Dark
- Roast Date: The date the beans were roasted
- Notes: Any additional notes about the beans

### Grinder Management

Navigate to `/grinders` to manage your grinder specifications.

**Features:**
- **Add New Grinder**: Click "Add Grinder" to create a new grinder entry
- **Search/Filter**: Search grinders by name, model, or notes
- **View Grinder Details**: Each grinder card shows name, brand, model, type, and notes
- **Edit Grinder**: Click the edit button to modify grinder information
- **Delete Grinder**: Click the delete button to remove a grinder (with confirmation)

**Grinder Form Fields:**
- Name: The name you give to your grinder
- Brand: The manufacturer of the grinder
- Model: The specific model of the grinder
- Type: Burr, Blade, or Hand grinder
- Notes: Any additional notes about the grinder

### Calibration Sessions

Navigate to `/sessions` to manage your espresso calibration sessions.

**Features:**
- **Add New Session**: Click "Add Session" to create a new calibration session
- **Search/Filter**: Search sessions by related bean, grinder, date, or notes
- **View Session Details**: Each session card shows the associated bean, grinder, date, and notes
- **Edit Session**: Click the edit button to modify session information
- **Delete Session**: Click the delete button to remove a session (with confirmation)

**Session Form Fields:**
- Bean: Select from your existing beans
- Grinder: Select from your existing grinders
- Session Date: The date of the calibration session
- Notes: Any additional notes about the session

## Advanced Features

### Shot Tracking (Within Sessions)

When viewing a specific session (feature not directly visible in current code but implied by the API structure), you would typically be able to:

- Add multiple shots to a session with different parameters
- Track grind setting, dose, yield, and extraction time
- Record taste notes and actions taken
- Analyze the relationship between parameters and results

### Data Analysis

The dashboard provides several analytical tools:

1. **Trend Analysis**: Understand how your extraction parameters change over time
2. **Comparative Analysis**: Compare performance between different beans or grinders
3. **Optimization Recommendations**: Get suggestions for improving extraction quality
4. **Performance Metrics**: Track your success rate with optimal extractions

## Detailed Usage Flow

### Complete Calibration Process

1. **Setup Your Inventory**
   - Go to `/beans` and add your current coffee beans
   - Go to `/grinders` and add your current grinders

2. **Create a Calibration Session**
   - Navigate to `/sessions`
   - Click "Add Session"
   - Select the bean and grinder you're using
   - Set the session date
   - Add any relevant notes
   - Save the session

3. **Log Extraction Attempts**
   - (Conceptual feature based on API structure)
   - Within the session, add multiple shots with different parameters
   - Track grind setting, dose, yield, and time
   - Record taste notes and adjustments made

4. **Analyze Results**
   - Visit the dashboard at `/` to see visualizations
   - Review extraction trends and patterns
   - Use recommendations to optimize future extractions

5. **Iterate and Improve**
   - Use insights from the dashboard to refine your technique
   - Create new sessions with improved parameters
   - Track your progress over time

## Troubleshooting

### Common Issues

**Issue: Cannot login after registration**
- Solution: Make sure you're using the correct email and password combination

**Issue: API calls failing**
- Solution: Verify that your backend API is running and the `VITE_API_BASE_URL` in your `.env` file is correct

**Issue: Data not saving**
- Solution: Check browser console for errors and ensure you have a stable internet connection to the backend

**Issue: Dashboard not loading**
- Solution: Ensure you're logged in and the dashboard API endpoints are accessible

### Getting Help

If you encounter issues not covered in this guide:
1. Check the browser's developer console for error messages
2. Verify that your backend API is running properly
3. Ensure your `.env` file has the correct API URL
4. Contact the application administrator for backend access issues

## Tips for Success

1. **Consistency is Key**: Use the same equipment and conditions when possible to get reliable data
2. **Take Detailed Notes**: Record taste notes and any changes you make to parameters
3. **Start Simple**: Begin with basic parameters and gradually add complexity
4. **Track Everything**: Record all relevant data points to identify patterns
5. **Use the Dashboard**: Regularly check the dashboard to identify trends and optimization opportunities

## Support

For additional support, please contact the application administrator or refer to the backend API documentation for technical details about the integration.

---

This guide should help you and your friends get started with the Espresso Calibrating Application. Happy brewing!