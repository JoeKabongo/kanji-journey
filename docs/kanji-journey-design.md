# Kanji Journey — Design Document

## 1. Overview

Kanji Journey is a web application built to help users master the kanji needed for the JLPT (N5 to N1 levels).  
It offers interactive quizzes, personalized tracking, and study tools to support efficient kanji learning.

---

## 2. Goals

- Help users systematically master JLPT kanji.
- Allow users to track learning progress over time.
- Provide a clean and motivating study experience.

---

## 3. Features

### 3.1 Home Page

- View lists of kanji by JLPT level.
- Click on a level to browse kanji.
- Click on a kanji to view detailed information.

### 3.2 Individual Kanji Page

- Details page with a Kanji information
- Mark kanji as "Learned" or "Not Learned"(Logged-in user only).
- Add and save personal notes per kanji (Logged-in users only).

### 3.3 Practice Zone (Logged-in Users)

- **Quizzes:**
  - Select JLPT level or "All levels."
  - Choose to review Learned or Not Learned kanji.
  - Front card: Kanji character.
  - Back card: Readings, meanings, examples.
- **Progress Tracking:**
  - Number of kanji learned over the past 7 days.
  - % of kanji learned by JLPT level and overall.

### 3.4 Search

- Search for a kanji.
- Redirect to kanji detail page on selection.

---

## 4. Design

### 4.1 Frontend

TBD

### 4.2 Backend

TBD

### 4.3 External APIs

- [KanjiAPI.dev](https://kanjiapi.dev/#!/documentation) — for kanji information (readings, meanings, stroke counts, etc.)

---

## 5. Future Improvements (Stretch Goals)

- Practice stroke order animations.
- Add spaced repetition algorithm (SRS) to optimize reviews.
- Include audio pronunciations.
- Dark mode support.

---

# ✅ Summary

This document outlines the initial phase of Kanji Journey.  
More technical details (API endpoints, database models, etc.) will be added as the project progresses.
