# 📚 Advanced Library Management System

A robust, enterprise-grade Database Management System (DBMS) mini-project built utilizing **MySQL**, **Python**, and **Streamlit**. The application provides a highly modular, interactive dashboard for librarians and members to manage books, author portfolios, dynamic categorizations, active book issuances, real-time fine tracking, and membership accounts.

This project showcases the practical deployment of relational database architectures, implementing multi-table joins, subqueries, correlated subqueries, database automation via triggers, and procedural transactional integrity through stored procedures—all wrapped in a clean, modern web application interface.

---

## 🚀 Features

### 👤 Member Management
* **Registration Engine:** Register new library members with automatic unique structural IDs.
* **Profile Insights:** Track member profiles, including valid contact details (phone, email).
* **Logs & Auditing:** View individual member transaction logs and borrow history dashboards.

### 📖 Catalog & Author Management
* **Inventory Control:** Dynamically add, edit, and catalog books within the system.
* **Relational Mapping:** Map books to explicit authors and custom genres/categories.
* **Properties Tracking:** Track core book properties including pricing, availability flags, and publishers.

### 🔄 Issue & Return Transaction System
* **Real-time Processing:** Process real-time book issuances while maintaining transactional records.
* **Timeline Enforcement:** Track strict parameters such as `issue_date` and `due_date`.
* **Dynamic Check-in:** Log `return_date` dynamically to handle delayed check-ins seamlessly.

### 💰 Automated Fine & Violation Tracker
* **Late Fee Automation:** Calculate late fee structures automatically based on overdue intervals.
* **Risk Enforcement:** Prevent members with high outstanding balances from borrowing further material.

### 📊 Administrative Reports & Analytics
* **Dormant Filtering:** Filter and identify dormant inventory (books never checked out).
* **Metric Groups:** Run metric groups on top-tier literary categories or prolific authors.
* **Flagging Dashboard:** Instantly flag overdue materials via the system administrator console.

---

## 🗄️ Database Relational Schema

Based on the system's Entity-Relationship architecture, the project maps perfectly to five core normalized tables:

### 1. `AUTHOR` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `author_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique ID for the author |
| `name` | VARCHAR(100) | NOT NULL | Name of the author |
| `country` | VARCHAR(50) | — | Nationality of the author |

### 2. `CATEGORY` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `category_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique ID for the book genre |
| `category_name` | VARCHAR(100) | NOT NULL, UNIQUE | Name of the category |

### 3. `BOOK` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `book_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identification number |
| `title` | VARCHAR(255) | NOT NULL | Title of the book |
| `price` | DECIMAL(10, 2) | NOT NULL | Purchase/Replacement cost |
| `category_id` | INT | FOREIGN KEY references `CATEGORY` | Category link |
| `author_id` | INT | FOREIGN KEY references `AUTHOR` | Author link |
| `status` | VARCHAR(20) | DEFAULT 'Available' | Availability tracker (`Available`/`Issued`) |

### 4. `MEMBER` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `member_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identification number |
| `name` | VARCHAR(100) | NOT NULL | Full name of the member |
| `phone` | VARCHAR(15) | NOT NULL, UNIQUE | Contact number |
| `email` | VARCHAR(100) | UNIQUE | Email address |

### 5. `ISSUE` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `issue_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Transaction ID |
| `book_id` | INT | FOREIGN KEY references `BOOK` | Book involved in operation |
| `member_id` | INT | FOREIGN KEY references `MEMBER` | Borrowing member |
| `issue_date` | DATE | NOT NULL | Date borrowed |
| `due_date` | DATE | NOT NULL | Maximum return deadline |
| `return_date` | DATE | NULL | Date returned to the library |
| `fine_amount` | DECIMAL(10,2)| DEFAULT 0.00 | Total late fee accumulated |

---

## 🛠️ DBMS Concepts Implemented

* **Entity Relationship (ER) Modeling:** Structured using explicit relationships establishing strong constraints across transaction logs.
* **Referential Integrity:** Enforced utilizing strict `FOREIGN KEY` constraints cascading where appropriate.
* **Aggregations & Grouping:** Used for dynamic reporting (`GROUP BY`, `HAVING`).
* **Nested Subqueries:** Implemented both standard independent subqueries and complex correlated inner queries.
* **Database Automation:** Powered by automated database layer `TRIGGERS` and computational `STORED PROCEDURES`.

---

## 🛠️ Technologies Used

* **Frontend UI:** Python Streamlit, Streamlit Option Menu, Pandas
* **Backend Engine:** Python 3.x
* **Database Management:** MySQL Server
* **Database Connectivity:** `mysql-connector-python`

---

## 📁 Project Structure

```text
LibraryManagementSystem/
├── app.py                      # Main Streamlit Application UI Code
├── database/
│   ├── schema.sql              # Table DDL generation scripts
│   ├── routines.sql            # Stored Procedures & Triggers 
│   └── sample_data.sql         # Base catalogs & dummy transactional history
├── assets/
│   └── architecture_er.png     # Entity relationship diagram visual
├── requirements.txt            # System dependencies
└── README.md                   # Setup documentation


🧠 Learning Outcomes
Referential Structural Control: Mastery over database synchronization strategies, ensuring structural entities can never become decoupled orphans.

Database-Side Automation: Offloaded high-overhead operations (availability flagging, fine generations) from Python execution threads down to core, lightning-fast database engine native triggers.

Modular Web Engineering: Designed a pristine split between data persistent layers and real-time analytical Streamlit UI components.

👤 Author
Sanvi Shettigar

DBMS Mini Project – Library Management System
