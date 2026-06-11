OverviewThe Library Management System is a robust Database Management System (DBMS) mini-project built utilizing MySQL, Python, and Streamlit. The application provides a highly modular, interactive dashboard for librarians and members to manage books, author portfolios, dynamic categorizations, active book issuances, real-time fine tracking, and membership accounts.This project showcases the practical deployment of relational database architectures, implementing multi-table joins, subqueries, correlated subqueries, database automation via triggers, and procedural transactional integrity through stored procedures—all wrapped in a clean web application interface.Features👤 Member ManagementRegister new library members with automatic unique IDs.Track member profiles, including valid contact details (phone, email).View individual member transaction logs and borrow history dashboards.📖 Catalog & Author ManagementDynamically add, edit, and catalog books within the system.Map books to explicit authors and custom genres/categories.Track core book properties including pricing, availability flags, and publishers.🔄 Issue & Return Transaction SystemProcess real-time book issuances while maintaining transactional records.Track strict parameters such as issue_date and due_date.Log return_date dynamically to handle delayed check-ins seamlessly.💰 Automated Fine & Violation TrackerCalculate late fee structures automatically based on overdue intervals.Prevent members with high outstanding balances from borrowing further material.📊 Administrative Reports & AnalyticsFilter and identify dormant inventory (books never checked out).Run metric groups on top-tier literary categories or prolific authors.Instantly flag overdue materials via the system administrator console.Database Relational SchemaBased on the provided Entity-Relationship diagram, the system maps perfectly to five core normalized tables:1. AUTHOR TableColumn NameData TypeConstraintsDescriptionauthor_idINTPRIMARY KEY, AUTO_INCREMENTUnique ID for the authornameVARCHAR(100)NOT NULLName of the authorcountryVARCHAR(50)—Nationality of the author2. CATEGORY TableColumn NameData TypeConstraintsDescriptioncategory_idINTPRIMARY KEY, AUTO_INCREMENTUnique ID for the book genrecategory_nameVARCHAR(100)NOT NULL, UNIQUEName of the category3. BOOK TableColumn NameData TypeConstraintsDescriptionbook_idINTPRIMARY KEY, AUTO_INCREMENTUnique identification numbertitleVARCHAR(255)NOT NULLTitle of the bookpriceDECIMAL(10, 2)NOT NULLPurchase/Replacement costcategory_idINTFOREIGN KEY references CATEGORYCategory linkauthor_idINTFOREIGN KEY references AUTHORAuthor linkstatusVARCHAR(20)DEFAULT 'Available'Availability tracker (Available/Issued)4. MEMBER TableColumn NameData TypeConstraintsDescriptionmember_idINTPRIMARY KEY, AUTO_INCREMENTUnique identification numbernameVARCHAR(100)NOT NULLFull name of the memberphoneVARCHAR(15)NOT NULL, UNIQUEContact numberemailVARCHAR(100)UNIQUEEmail address5. ISSUE TableColumn NameData TypeConstraintsDescriptionissue_idINTPRIMARY KEY, AUTO_INCREMENTTransaction IDbook_idINTFOREIGN KEY references BOOKBook involved in operationmember_idINTFOREIGN KEY references MEMBERBorrowing memberissue_dateDATENOT NULLDate borroweddue_dateDATENOT NULLMaximum return deadlinereturn_dateDATENULLDate returned to the libraryfine_amountDECIMAL(10,2)DEFAULT 0.00Total late fee accumulatedDBMS Concepts Implemented[AUTHOR] 1 ---- N [BOOK] N ---- 1 [CATEGORY]
                    1
                    |
                    N
                 [ISSUE] N ---- 1 [MEMBER]
Entity Relationship (ER) Modeling: Structured using crows-foot relationships establishing strong constraints across transaction logs.Referential Integrity: Enforced utilizing strict FOREIGN KEY constraints cascading where appropriate.Aggregations & Grouping: Used for dynamic reporting (GROUP BY, HAVING).Nested Subqueries: Implemented both standard independent subqueries and complex correlated inner queries.Database Automation: Powered by automated database layer TRIGGERS and computational STORED PROCEDURES.Production-Ready SQL ImplementationsPart 1: Advanced Queries1. Retrieve all booksSQLSELECT book_id, title, price, status FROM BOOK;
2. Display books written by a specific author (e.g., Author ID = 5)SQLSELECT b.book_id, b.title, b.price, a.name AS author_name 
FROM BOOK b
JOIN AUTHOR a ON b.author_id = a.author_id
WHERE a.author_id = 5;
3. Display issue and member details (2-table INNER JOIN)SQLSELECT i.issue_id, m.member_id, m.name AS member_name, i.book_id, i.issue_date, i.due_date 
FROM ISSUE i
INNER JOIN MEMBER m ON i.member_id = m.member_id;
4. Display issue, member, and book details (3-table JOIN)SQLSELECT i.issue_id, m.name AS member_name, b.title AS book_title, i.issue_date, i.return_date
FROM ISSUE i
INNER JOIN MEMBER m ON i.member_id = m.member_id
INNER JOIN BOOK b ON i.book_id = b.book_id;
5. Count number of books in each category (GROUP BY)SQLSELECT c.category_name, COUNT(b.book_id) AS total_books
FROM CATEGORY c
LEFT JOIN BOOK b ON c.category_id = b.category_id
GROUP BY c.category_id, c.category_name;
6. Display categories having more than 50 books (HAVING)SQLSELECT c.category_name, COUNT(b.book_id) AS total_books
FROM CATEGORY c
INNER JOIN BOOK b ON c.category_id = b.category_id
GROUP BY c.category_id, c.category_name
HAVING COUNT(b.book_id) > 50;
7. Retrieve books whose price is greater than the average book price (Subquery)SQLSELECT book_id, title, price 
FROM BOOK 
WHERE price > (SELECT AVG(price) FROM BOOK);
8. Retrieve members who borrowed more books than a specific member (Correlated Subquery)(Assuming target comparisons are against Member ID = 3)SQLSELECT m.member_id, m.name, COUNT(i.issue_id) AS books_borrowed
FROM MEMBER m
JOIN ISSUE i ON m.member_id = i.member_id
GROUP BY m.member_id, m.name
HAVING COUNT(i.issue_id) > (
    SELECT COUNT(*) 
    FROM ISSUE 
    WHERE member_id = 3
);
9. Display all books including those not issued (LEFT JOIN)SQLSELECT b.book_id, b.title, i.issue_id, i.issue_date 
FROM BOOK b
LEFT JOIN ISSUE i ON b.book_id = i.book_id;
10. Retrieve books that were never issued (NOT EXISTS)SQLSELECT b.book_id, b.title, b.price 
FROM BOOK b
WHERE NOT EXISTS (
    SELECT 1 
    FROM ISSUE i 
    WHERE i.book_id = b.book_id
);
Part 2: Stored Procedures1. Procedure to issue a book to a memberThis procedure checks if a book is available, creates an issue transaction item, and updates the book status.SQLDELIMITER //

CREATE PROCEDURE IssueBook(
    IN p_book_id INT,
    IN p_member_id INT,
    IN p_days_to_keep INT
)
BEGIN
    DECLARE v_status VARCHAR(20);
    
    -- Check availability status of the book
    SELECT status INTO v_status FROM BOOK WHERE book_id = p_book_id;
    
    IF v_status = 'Available' THEN
        -- Transaction safe allocation
        INSERT INTO ISSUE (book_id, member_id, issue_date, due_date, fine_amount)
        VALUES (p_book_id, p_member_id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL p_days_to_keep DAY), 0.00);
        
        -- Update statement (Will trigger automatic status adjustments)
        UPDATE BOOK SET status = 'Issued' WHERE book_id = p_book_id;
        
        SELECT 'Success: Book issued successfully.' AS execution_status;
    ELSE
        SELECT 'Error: Book is currently unavailable/issued to another member.' AS execution_status;
    END IF;
END //

DELIMITER ;
2. Procedure to calculate fine for overdue booksSQLDELIMITER //

CREATE PROCEDURE CalculateOverdueFine(
    IN p_issue_id INT,
    IN p_daily_rate DECIMAL(5,2)
)
BEGIN
    DECLARE v_due_date DATE;
    DECLARE v_return_date DATE;
    DECLARE v_days_overdue INT;
    DECLARE v_fine DECIMAL(10,2) DEFAULT 0.00;
    
    SELECT due_date, return_date INTO v_due_date, v_return_date 
    FROM ISSUE 
    WHERE issue_id = p_issue_id;
    
    -- Treat today as return date if book hasn't been brought back yet
    IF v_return_date IS NULL THEN
        SET v_return_date = CURDATE();
    END IF;
    
    -- Calculate difference
    SET v_days_overdue = DATEDIFF(v_return_date, v_due_date);
    
    IF v_days_overdue > 0 THEN
        SET v_fine = v_days_overdue * p_daily_rate;
        UPDATE ISSUE SET fine_amount = v_fine WHERE issue_id = p_issue_id;
    END IF;
    
    SELECT issue_id, v_days_overdue AS days_late, v_fine AS total_calculated_fine;
END //

DELIMITER ;
Part 3: Database Triggers1. Trigger to update book availability after issue or return actionsSQLDELIMITER //

-- Part A: Handle tracking when an item is turned back in
CREATE TRIGGER AfterIssueUpdateReturn
BEFORE UPDATE ON ISSUE
FOR EACH ROW
BEGIN
    -- If return_date transitions from null to a date value
    IF OLD.return_date IS NULL AND NEW.return_date IS NOT NULL THEN
        UPDATE BOOK SET status = 'Available' WHERE book_id = NEW.book_id;
    END IF;
END //

DELIMITER ;
2. Trigger to automatically calculate fine upon updating return logsSQLDELIMITER //

CREATE TRIGGER BeforeReturnCalculateFine
BEFORE UPDATE ON ISSUE
FOR EACH ROW
BEGIN
    DECLARE v_days_late INT;
    DECLARE v_daily_charge DECIMAL(4,2) DEFAULT 2.00; -- Flat rate standard fine
    
    -- Detect returning event hook
    IF OLD.return_date IS NULL AND NEW.return_date IS NOT NULL THEN
        SET v_days_late = DATEDIFF(NEW.return_date, OLD.due_date);
        
        IF v_days_late > 0 THEN
            SET NEW.fine_amount = v_days_late * v_daily_charge;
        ELSE
            SET NEW.fine_amount = 0.00;
        END IF;
    END IF;
END //

DELIMITER ;
System Blueprint & Project DirectoryLibraryManagementSystem/
├── app.py                      # Main Streamlit Application UI Code
├── database/
│   ├── schema.sql              # Table DDL generation scripts
│   ├── routines.sql            # Stored Procedures & Triggers 
│   └── sample_data.sql         # Base catalogs & dummy transactional history
├── assets/
│   └── architecture_er.png     # Entity relationship diagram visual
├── requirements.txt            # System dependencies
└── README.md                   # Setup documentation
Setup & Startup Execution CommandsClone project layout environment:Bashgit clone https://github.com/your-username/LibraryManagementSystem.git
cd LibraryManagementSystem
Initialize operational library runtime packages:Bashpip install -r requirements.txt
Boot-up presentation web interface:Bashstreamlit run app.py
Learning Outcomes & EnhancementsReferential Structural Control: Mastery over database synchronization strategies, ensuring structural entities can never become decoupled orphans.Database-Side Automation: offloaded high-overhead operations (availability flagging, payment/fine generations) from Python execution threads down to core, lightning-fast database engine native triggers.Modular Web Engineering: Designed a pristine split between data persistent layers and real-time analytical Streamlit UI components.
