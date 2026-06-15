// Initialize pseudo-database array from localStorage
let libraryDB = JSON.parse(localStorage.getItem('library_db')) || [];
let triggerLog = JSON.parse(localStorage.getItem('trigger_log')) || [];

// Save to browser memory
function saveToStorage() {
    localStorage.setItem('library_db', JSON.stringify(libraryDB));
    localStorage.setItem('trigger_log', JSON.stringify(triggerLog));
}

// Fetch form data cleanly
function getInputs() {
    return {
        id: document.getElementById('bookid').value.trim(),
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        price: parseFloat(document.getElementById('price').value)
    };
}

// Clear text fields
function clearInputs() {
    document.getElementById('bookid').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('price').value = '';
}

// Output engine
function printOutput(htmlContent) {
    document.getElementById('output').innerHTML = htmlContent;
}

/* --- 1. INSERT OPERATION --- */
function insertBook() {
    const { id, title, author, price } = getInputs();

    if (!id || !title || !author || isNaN(price)) {
        printOutput("<div class='console-alert alert-danger'>⚠️ Runtime Alert: Please fill in all configuration parameters with valid data strings.</div>");
        return;
    }

    if (libraryDB.some(book => book.id === id)) {
        printOutput(`<div class='console-alert alert-danger'>❌ System Exception: Record primary identity collision. ID "${id}" already locked inside index.</div>`);
        return;
    }

    const newBook = { id, title, author, price };
    libraryDB.push(newBook);
    saveToStorage();
    clearInputs();

    printOutput(`<div class='console-alert alert-success'>✅ TRANSACTION COMMIT: Entity unit instance "${title}" compiled successfully inside schema.</div>`);
}

/* --- 2. UPDATE OPERATION --- */
function updateBook() {
    const { id, title, author, price } = getInputs();

    if (!id) {
        printOutput("<div class='console-alert alert-warning'>⚠️ Query Exception: Provide a targeted indexing 'Book ID' field to perform runtime updates.</div>");
        return;
    }

    let bookIndex = libraryDB.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
        if (title) libraryDB[bookIndex].title = title;
        if (author) libraryDB[bookIndex].author = author;
        if (!isNaN(price)) libraryDB[bookIndex].price = price;
        
        saveToStorage();
        clearInputs();
        printOutput(`<div class='console-alert alert-warning'>🔄 ROW MUTATION SUCCESS: Index object dataset tracking target [ID: ${id}] successfully customized.</div>`);
    } else {
        printOutput(`<div class='console-alert alert-danger'>❌ Execution Exception: Target referencing constraint ID "${id}" is completely unmapped.</div>`);
    }
}

/* --- 3. DELETE OPERATION --- */
function deleteBook() {
    const { id } = getInputs();

    if (!id) {
        printOutput("<div class='console-alert alert-danger'>⚠️ Query Warning: Input tracking reference 'Book ID' criteria to initiate entity mutation drop query.</div>");
        return;
    }

    let bookIndex = libraryDB.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
        let deletedBook = libraryDB.splice(bookIndex, 1)[0];
        triggerLog.unshift(`[AFTER DELETE TRIGGER]: Book instance row for "${deletedBook.title}" (ID: ${deletedBook.id}) purged at ${new Date().toLocaleTimeString()}`);
        
        saveToStorage();
        clearInputs();
        printOutput(`<div class='console-alert alert-danger'>🗑️ CASCADE PURGE: Database engine successfully dropped row targeted at index [ID: ${id}].</div>`);
    } else {
        printOutput(`<div class='console-alert alert-danger'>❌ Error context: Specified key value sequence execution failed. Target entity instance [ID: ${id}] not found.</div>`);
    }
}

/* --- 4. DISPLAY RECORDS --- */
function displayBooks() {
    if (libraryDB.length === 0) {
        printOutput("<p class='placeholder-text'>Empty Database Schema. Execute entry injections to map record sets.</p>");
        return;
    }

    let tableHTML = `
        <table class="records-table">
            <thead>
                <tr>
                    <th>Book ID</th>
                    <th>Title Name</th>
                    <th>Author Specification</th>
                    <th>Asset Price</th>
                </tr>
            </thead>
            <tbody>
    `;

    libraryDB.forEach(book => {
        tableHTML += `
            <tr>
                <td style="color: #38bdf8; font-weight: 600;">${book.id}</td>
                <td style="color: #fff; font-weight: 500;">${book.title}</td>
                <td>${book.author}</td>
                <td style="color: #34d399; font-weight: 600;">$${book.price.toFixed(2)}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    printOutput(tableHTML);
}

/* --- 5. STORED PROCEDURE SIMULATION --- */
function executeProcedure() {
    if (libraryDB.length === 0) {
        printOutput("<div class='console-alert alert-danger'>⚙️ <em>Procedure Trace:</em> Schema calculations terminated. Target structure returns null count.</div>");
        return;
    }

    let totalValue = libraryDB.reduce((sum, book) => sum + book.price, 0);
    let expensiveBook = libraryDB.reduce((max, book) => book.price > max.price ? book : max, libraryDB[0]);

    let procedureHTML = `
        <div style="line-height: 1.8; text-align: left;">
            <p style="color: #38bdf8; font-weight: bold; margin-bottom: 8px; font-family: 'Plus Jakarta Sans';">⚙️ EXECUTE COMPILATION: CALL GetLibraryStatistics();</p>
            <p><strong style="color: #94a3b8;">Total Inventory Instances:</strong> ${libraryDB.length} records processed</p>
            <p><strong style="color: #94a3b8;">Aggregate Relational Capital Value:</strong> <span style="color: #34d399; font-weight:600;">$${totalValue.toFixed(2)}</span></p>
            <p><strong style="color: #94a3b8;">Max Premium Evaluation Title:</strong> <span style="color: #fbbf24;">"${expensiveBook.title}"</span> by ${expensiveBook.author} ($${expensiveBook.price.toFixed(2)})</p>
        </div>
    `;
    printOutput(procedureHTML);
}

/* --- 6. TRIGGER DEMONSTRATION --- */
function triggerDemo() {
    if (triggerLog.length === 0) {
        printOutput("<p class='placeholder-text'>⚡ Operational Engine Alert: Trigger instances pipeline returns clear value. Execute array drop deletions to log details.</p>");
        return;
    }

    let triggerHTML = `<p style="color: #f87171; font-weight: bold; margin-bottom: 12px; text-align: left; font-family: 'Plus Jakarta Sans';">⚡ Operational Trigger State Logs Matrix (Active Interceptors):</p>`;
    triggerLog.forEach(log => {
        triggerHTML += `<p style="font-family: monospace; font-size: 0.85rem; margin-bottom: 6px; background: #1e293b; padding: 8px 12px; border-radius:6px; text-align: left; border-left: 2px solid #ef4444; color: #cbd5e1;">${log}</p>`;
    });

    printOutput(triggerHTML);
}
