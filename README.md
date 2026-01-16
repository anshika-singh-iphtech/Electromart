# Electromart – React Native E‑Commerce App

Electromart is a fully functional e‑commerce mobile application built using React Native, designed to provide seamless user onboarding, authentication, navigation, and UI experience. The project integrates Redux Toolkit for state management, Async Storage for persistent data, and various UI libraries.

## Overview

Electromart is a mobile shopping application prototype where users can:
- Register
- Login via Email/Password
- Stay logged‑in using Async Storage
- Navigate between multiple screens
- View UI components like sliders, icons, toasts, etc.

  This project is ideal for understanding complete app flow — from splash screen → onboarding → authentication → home page.

  ## Key Features

  - **Secure Email/Password Authentication**
  - **Automatic Login Using Async Storage**
  - **React Navigation: Stack + Bottom Tabs**
  - **Redux Toolkit** for State Management
  - **Modern UI** using Linear Gradient, Icons
  - **Toast Notifications** for errors & success messages

  ## Tech Stack

**Frontend:** React Native (0.71.8)
**Backend/Authentication:** Firebase Auth
**State Management:** Redux Toolkit + React Redux
**Local Storage:** Async Storage
**Navigation:** React Navigation (Native Stack + Bottom Tabs)
**UI Libraries:** Icons, Linear Gradients, Toasts

## Project Structure

Electromart
 |
 |-- android / ios   -> Native project files
 |-- src
      |-- navigation -> All navigators (stack, tabs)
      |-- screens    -> All screens (Login, Register, Home, etc.)
      |-- components -> Reusable UI components
      |-- redux      -> Store, slices
      |-- assets     -> Images, icons
  |-- App.js         -> Entry point
  |-- package.json   -> Project dependencies

## App Flow

Below describes the navigation & logic flow.

### Splash Screen
- Shows for 1 second.
- Checks Async Storage for user token.
- If logged‑in → Navigate to Home.
- If not logged‑in → Navigate to Register.

### Register Screen
- User enters name, email, password,phone number, address, select gender and chooses profile pic.
- On success → Store user to AsyncStorage.

### Login Screen
- Email/Password or Google Login.
- After login → Save token to AsyncStorage.

### Home Screen
- User can browse items.
- Bottom Tabs for navigation.

### Logout
- Email/Password or Google Login.
- Redirects to Login.
