// Data persistence initializers from localStorage
let libraryDB = JSON.parse(localStorage.getItem('library_db')) || [];
let memberDB = JSON.parse(localStorage.getItem('member_db')) || [];
let issueDB = JSON.parse(localStorage.getItem('issue_db')) || [];
let fineDB = JSON.parse(localStorage.getItem('fine_db')) || [];
let triggerLog = JSON.parse(localStorage.getItem('trigger_log')) || [];

function saveToStorage() {
    localStorage.setItem('library_db', JSON.stringify(libraryDB));
    localStorage.setItem('member_db', JSON.stringify(memberDB));
    localStorage.setItem('issue_db', JSON.stringify(issueDB));
    localStorage.setItem('fine_db', JSON.stringify(fineDB));
    localStorage.setItem('trigger_log', JSON.stringify(triggerLog));
}

// Fetch basic inputs safely
function getInputs() {
    return {
        id: document.getElementById('bookid').value.trim(),
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        category: document.getElementById('category').value.trim() || "General",
        price: parseFloat(document.getElementById('price').value)
    };
}

function clearInputs() {
    document.getElementById('bookid').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('category').value = 'General';
    document.getElementById('price').value = '';
}

function printOutput(htmlContent) {
    document.getElementById('output').innerHTML = htmlContent;
}

/* --- ADDIIONAL MANUAL DATA ENTRIES --- */
function addMember() {
    let mId = parseInt(document.getElementById('memberid').value);
    let mName = document.getElementById('membername').value.trim();

    if (isNaN(mId) || !mName) {
        printOutput("<div class='console-alert alert-danger'>⚠️ Please provide a Member ID and Member Name.</div>");
        return;
    }
    if (memberDB.some(m => m.member_id === mId)) {
        printOutput("<div class='console-alert alert-warning'>⚠️ Member ID already exists.</div>");
        return;
    }

    memberDB.push({ member_id: mId, name: mName });
    saveToStorage();
    printOutput(`<div class='console-alert alert-success'>✅ Member "${mName}" recorded in database schema memory.</div>`);
}

function createIssueRecord() {
    let mId = parseInt(document.getElementById('memberid').value);
    let bId = document.getElementById('issuebookid').value.trim();

    if (isNaN(mId) || !bId) {
        printOutput("<div class='console-alert alert-danger'>⚠️ Please fill Member ID and Target Book ID to log loan records.</div>");
        return;
    }

    let bookExists = libraryDB.find(b => b.id === bId);
    if (!bookExists) {
        printOutput("<div class='console-alert alert-danger'>❌ Error: Specified Book ID does not exist.</div>");
        return;
    }

    // Append standard tracking row data
    let issue_id = issueDB.length + 2001;
    issueDB.push({
        issue_id: issue_id,
        member_id: mId,
        book_id: bId,
        issue_date: new Date().toISOString().split('T')[0],
        status: "Issued"
    });

    // Trigger Side-Effect Simulation
    bookExists.availability = false;
    triggerLog.unshift(`[AFTER INSERT TRIGGER]: Logged Issue #${issue_id}. Toggled Book ID ${bId} availability to FALSE.`);
    
    saveToStorage();
    printOutput(`<div class='console-alert alert-success'>✅ Issue Record #${issue_id} Created successfully.</div>`);
}


/* --- 1. CRUD: INSERT --- */
function insertBook() {
    const { id, title, author, category, price } = getInputs();

    if (!id || !title || !author || isNaN(price)) {
        printOutput("<div class='console-alert alert-danger'>⚠️ Runtime Alert: Fill all configurations with valid data.</div>");
        return;
    }

    if (libraryDB.some(book => book.id === id)) {
        printOutput(`<div class='console-alert alert-danger'>❌ Primary Identity Collision. ID "${id}" locked inside database index.</div>`);
        return;
    }

    libraryDB.push({ id, title, author, category, price, availability: true });
    saveToStorage();
    clearInputs();

    printOutput(`<div class='console-alert alert-success'>✅ TRANSACTION COMMIT: "${title}" compiled inside system schema.</div>`);
}

/* --- 2. CRUD: UPDATE --- */
function updateBook() {
    const { id, title, author, category, price } = getInputs();

    if (!id) {
        printOutput("<div class='console-alert alert-warning'>⚠️ Provide a targeted indexing 'Book ID' to update.</div>");
        return;
    }

    let idx = libraryDB.findIndex(b => b.id === id);
    if (idx !== -1) {
        if (title) libraryDB[idx].title = title;
        if (author) libraryDB[idx].author = author;
        if (category) libraryDB[idx].category = category;
        if (!isNaN(price)) libraryDB[idx].price = price;
        
        saveToStorage();
        clearInputs();
        printOutput(`<div class='console-alert alert-warning'>🔄 ROW MUTATION SUCCESS: Dataset item [ID: ${id}] customized.</div>`);
    } else {
        printOutput(`<div class='console-alert alert-danger'>❌ Error: Target reference ID "${id}" is unmapped.</div>`);
    }
}

/* --- 3. CRUD: DELETE --- */
function deleteBook() {
    const { id } = getInputs();
    if (!id) {
        printOutput("<div class='console-alert alert-danger'>⚠️ Input tracking 'Book ID' field to initiate delete drop.</div>");
        return;
    }

    let idx = libraryDB.findIndex(b => b.id === id);
    if (idx !== -1) {
        let deletedBook = libraryDB.splice(idx, 1)[0];
        triggerLog.unshift(`[AFTER DELETE TRIGGER]: Book instance row for "${deletedBook.title}" purged at ${new Date().toLocaleTimeString()}`);
        
        saveToStorage();
        clearInputs();
        printOutput(`<div class='console-alert alert-danger'>🗑️ CASCADE PURGE: Database engine dropped row targeted at index [ID: ${id}].</div>`);
    } else {
        printOutput(`<div class='console-alert alert-danger'>❌ Target entity instance [ID: ${id}] not found.</div>`);
    }
}

/* --- 4. ALL 10 ASSIGNMENT MAPPED QUERIES --- */
function displayBooks() {
    let choice = prompt(
        "Select Assignment Operation to Display:\n\n" +
        "1. Retrieve all books (SELECT *)\n" +
        "2. Display books written by specific author\n" +
        "3. Display issue and member details (2-Table INNER JOIN)\n" +
        "4. Display issue, member, and book details (3-Table JOIN)\n" +
        "5. Count number of books in each category (GROUP BY)\n" +
        "6. Display category having more than 50 books (HAVING)\n" +
        "7. Retrieve books whose price > average price (Subquery)\n" +
        "8. Correlated Subquery condition evaluation\n" +
        "9. Left Outer Join demonstration query\n" +
        "10. NOT EXISTS condition verification query"
    );

    if (choice === null) return;
    let tableHTML = "";

    switch(choice) {
        case "1":
            if (libraryDB.length === 0) {
                printOutput("<p class='placeholder-text'>Empty Database Schema.</p>");
                return;
            }
            tableHTML = `<table class="records-table"><thead><tr><th>Book ID</th><th>Title</th><th>Author</th><th>Category</th><th>Price</th></tr></thead><tbody>`;
            libraryDB.forEach(b => {
                tableHTML += `<tr><td>${b.id}</td><td style="color: #fff;">${b.title}</td><td>${b.author}</td><td>${b.category}</td><td style="color:#34d399;">$${b.price.toFixed(2)}</td></tr>`;
            });
            tableHTML += "</tbody></table>";
            printOutput(tableHTML);
            break;

        case "2":
            let searchAuthor = prompt("Enter Author Name to filter:");
            if (!searchAuthor) return;
            tableHTML = `<h4>📋 Query: Books written by ${searchAuthor}</h4>
            <table class="records-table"><thead><tr><th>Book ID</th><th>Title</th><th>Price</th></tr></thead><tbody>`;
            libraryDB.forEach(b => {
                if(b.author.toLowerCase() === searchAuthor.toLowerCase()) {
                    tableHTML += `<tr><td>${b.id}</td><td style='color:#fff;'>${b.title}</td><td>$${b.price.toFixed(2)}</td></tr>`;
                }
            });
            tableHTML += "</tbody></table>";
            printOutput(tableHTML);
            break;

        case "3":
            tableHTML = `<h4>📋 Query 3: Issue ⋈ Member (2-Table Inner Join)</h4>
            <table class="records-table"><thead><tr><th>Issue ID</th><th>Member Name</th><th>Issue Date</th></tr></thead><tbody>`;
            issueDB.forEach(i => {
                let m = memberDB.find(mem => mem.member_id === i.member_id);
                if (m) {
                    tableHTML += `<tr><td>${i.issue_id}</td><td style='color:#fff;'>${m.name}</td><td>${i.issue_date}</td></tr>`;
                }
            });
            tableHTML += "</tbody></table>";
            printOutput(tableHTML);
            break;

        case "4":
            tableHTML = `<h4>📋 Query 4: Issue ⋈ Member ⋈ Book (3-Table Join)</h4>
            <table class="records-table"><thead><tr><th>Issue ID</th><th>Member Name</th><th>Book Title</th></tr></thead><tbody>`;
            issueDB.forEach(i => {
                let m = memberDB.find(mem => mem.member_id === i.member_id);
                let b = libraryDB.find(bk => bk.id === i.book_id);
                if (m && b) {
                    tableHTML += `<tr><td>${i.issue_id}</td><td style='color:#fff;'>${m.name}</td><td style='color:#fbbf24;'>${b.title}</td></tr>`;
                }
            });
            tableHTML += "</tbody></table>";
            printOutput(tableHTML);
            break;

        case "5":
            tableHTML = `<h4>📋 Query 5: Book count in each Category (GROUP BY)</h4>
            <table class="records-table"><thead><tr><th>Category</th><th>Total Count</th></tr></thead><tbody>`;
            let categories = {};
            libraryDB.forEach(b => categories[b.category] = (categories[b.category] || 0) + 1);
            Object.keys(categories).forEach(c => {
                tableHTML += `<tr><td style='color:#fff;'>${c}</td><td>${categories[c]} book(s)</td></tr>`;
            });
            tableHTML += "</tbody></table>";
            printOutput(tableHTML);
            break;

        case "6":
            tableHTML = `<h4>📋 Query 6: Display Category having more than 50 books (HAVING)</h4>
            <table class="records-table"><thead><tr><th>Category</th><th>Count Status</th></tr></thead><tbody>`;
            let categoriesHaving = {};
            libraryDB.forEach(b => categoriesHaving[b.category] = (categoriesHaving[b.category] || 0) + 1);
            let foundAny = false;
            Object.keys(categoriesHaving).forEach(c => {
                if(categoriesHaving[c] > 50) {
                    tableHTML += `<tr><td style='color:#fff;'>${c}</td><td>${categoriesHaving[c]} books</td></tr>`;
                    foundAny = true;
                }
            });
            tableHTML += "</tbody></table>";
            if (!foundAny) {
                tableHTML += "<div class='console-alert alert-warning' style='margin-top:10px;'>ℹ️ SQL HAVING Condition Notice: No test categories currently contain more than 50 books.</div>";
            }
            printOutput(tableHTML);
            break;

        case "7":
            if (libraryDB.length === 0) return;
            let avgPrice = libraryDB.reduce((sum, b) => sum + b.price, 0) / libraryDB.length;
            tableHTML = `<h4>📋 Query 7: Books where Price > AVG ($${avgPrice.toFixed(2)})</h4>
            <table class="records-table"><thead><tr><th>Title</th><th>Price</th></tr></thead><tbody>`;
            libraryDB.forEach(b => {
                if (b.price > avgPrice) {
                    tableHTML += `<tr><td style='color:#fff;'>${b.title}</td><td style='color:#34d399;'>$${b.price.toFixed(2)}</td></tr>`;
                }
            });
            tableHTML += "</tbody></table>";
            printOutput(tableHTML);
            break;

        case "8":
            let matchUser = prompt("Enter baseline Member Name to evaluate for Correlated Loans comparison:", "Kishan") || "Kishan";
            let baselineUser = memberDB.find(m => m.name.toLowerCase() === matchUser.toLowerCase());
            let targetCount = baselineUser ? issueDB.filter(i => i.member_id === baselineUser.member_id).length : 0;

            tableHTML = `<h4>📋 Query 8: Correlated Subquery (Members with more loans than ${matchUser} [${targetCount}])</h4>
            <table class="records-table"><thead><tr><th>Member Profile</th><th>Loans Log Count</th></tr></thead><tbody>`;
            memberDB.forEach(m => {
                let loans = issueDB.filter(i => i.member_id === m.member_id).length;
                if (loans > targetCount) {
                    tableHTML += `<tr><td style='color:#fff;'>${m.name}</td><td>${loans} item(s) issued</td></tr>`;
                }
            });
            tableHTML += "</tbody></table>";
            printOutput(tableHTML);
            break;

        case "9":
            tableHTML = `<h4>📋 Query 9: Book LEFT OUTER JOIN Issue</h4>
            <table class="records-table"><thead><tr><th>Book Title</th><th>Issue Log Relation</th></tr></thead><tbody>`;
            libraryDB.forEach(b => {
                let issuance = issueDB.find(i => i.book_id === b.id);
                let linkDisplay = issuance ? `Joined to Issue Row #${issuance.issue_id}` : `<span style='color:#64748b; font-style:italic;'>NULL</span>`;
                tableHTML += `<tr><td style='color:#fff;'>${b.title}</td><td>${linkDisplay}</td></tr>`;
            });
            tableHTML += "</tbody></table>";
            printOutput(tableHTML);
            break;

        case "10":
            tableHTML = `<h4>📋 Query 10: NOT EXISTS Condition Verification Audit</h4>
            <table class="records-table"><thead><tr><th>Title</th><th>Context Status Integrity Check</th></tr></thead><tbody>`;
            libraryDB.forEach(b => {
                let hasLog = issueDB.some(i => i.book_id === b.id);
                if (!hasLog) {
                    tableHTML += `<tr><td style='color:#fff;'>${b.title}</td><td style='color:#ef4444;'>Never Loaned Out</td></tr>`;
                }
            });
            tableHTML += "</tbody></table>";
            printOutput(tableHTML);
            break;
    }
}

/* --- 5. STORED PROCEDURES --- */
function executeProcedure() {
    let procChoice = prompt("Select Stored Procedure to Call:\n1. Procedure to issue a book to a member\n2. Procedure to calculate fine for overdue books");
    if (procChoice === null) return;

    if (procChoice === "1") {
        let memberInputId = parseInt(prompt("Enter Member ID:"));
        let bookInputId = prompt("Enter Book ID to issue:");

        let targetBook = libraryDB.find(b => b.id === bookInputId);
        if (!targetBook) {
            printOutput("<div class='console-alert alert-danger'>❌ Error: Target Book ID does not exist.</div>");
            return;
        }

        targetBook.availability = false;
        issueDB.push({
            issue_id: issueDB.length + 3001,
            member_id: memberInputId,
            book_id: bookInputId,
            issue_date: new Date().toISOString().split('T')[0],
            status: "Issued"
        });
        
        triggerLog.unshift(`[TRIGGER EXECUTED]: Book ID ${bookInputId} availability auto-shifted to FALSE.`);
        saveToStorage();
        printOutput(`<div class='console-alert alert-success'>⚙️ CALL IssueBookToMember(${memberInputId}, '${bookInputId}'); executed successfully.</div>`);

    } else if (procChoice === "2") {
        let fineCalculated = 0;
        let activeLoans = issueDB.filter(issue => issue.status === "Issued");
        
        activeLoans.forEach(issue => {
            fineCalculated += 5.00; 
            fineDB.push({ fine_id: fineDB.length + 1, member_id: issue.member_id, amount: 5.00 });
        });
        
        triggerLog.unshift(`[TRIGGER EXECUTED]: Evaluated dynamic fine accumulation loop rules.`);
        saveToStorage();
        printOutput(`<div class='console-alert alert-warning'>⚙️ CALL CalculateOverdueFines(); processed. Total fines added: $${fineCalculated.toFixed(2)}</div>`);
    }
}

/* --- 6. REACTIVE TRIGGERS --- */
function triggerDemo() {
    if (triggerLog.length === 0) {
        printOutput("<p class='placeholder-text'>⚡ Operational Engine Alert: Trigger pipeline empty.</p>");
        return;
    }

    let triggerHTML = `<p style="color: #f87171; font-weight: bold; margin-bottom: 12px; text-align: left;">⚡ Interceptor State Log Actions Matrix:</p>`;
    triggerLog.forEach(log => {
        triggerHTML += `<p style="font-family: monospace; font-size: 0.85rem; margin-bottom: 6px; background: #1e293b; padding: 8px 12px; border-radius:6px; text-align: left; border-left: 2px solid #ef4444; color: #cbd5e1;">${log}</p>`;
    });

    printOutput(triggerHTML);
}
