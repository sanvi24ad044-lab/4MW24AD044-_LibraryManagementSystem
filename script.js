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
        printOutput("<p class='alert-msg' style='border-color: #e74c3c; background: #fde8e8;'>⚠️ Please fill in all fields with valid data.</p>");
        return;
    }

    if (libraryDB.some(book => book.id === id)) {
        printOutput(`<p class='alert-msg' style='border-color: #e74c3c; background: #fde8e8;'>❌ Error: Book with ID "${id}" already exists.</p>`);
        return;
    }

    const newBook = { id, title, author, price };
    libraryDB.push(newBook);
    saveToStorage();
    clearInputs();

    printOutput(`<p class='alert-msg' style='border-color: #2ecc71; background: #e8f8f0;'>✅ SUCCESS: Book "${title}" inserted into database successfully.</p>`);
}

/* --- 2. UPDATE OPERATION --- */
function updateBook() {
    const { id, title, author, price } = getInputs();

    if (!id) {
        printOutput("<p class='alert-msg' style='border-color: #f1c40f; background: #fef9e7;'>⚠️ Enter a 'Book ID' to identify which record to update.</p>");
        return;
    }

    let bookIndex = libraryDB.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
        if (title) libraryDB[bookIndex].title = title;
        if (author) libraryDB[bookIndex].author = author;
        if (!isNaN(price)) libraryDB[bookIndex].price = price;
        
        saveToStorage();
        clearInputs();
        printOutput(`<p class='alert-msg' style='border-color: #f1c40f; background: #fef9e7;'>🔄 UPDATE SUCCESS: Book ID ${id} modified successfully.</p>`);
    } else {
        printOutput(`<p class='alert-msg' style='border-color: #e74c3c; background: #fde8e8;'>❌ Error: Book ID "${id}" not found.</p>`);
    }
}

/* --- 3. DELETE OPERATION --- */
function deleteBook() {
    const { id } = getInputs();

    if (!id) {
        printOutput("<p class='alert-msg' style='border-color: #e74c3c; background: #fde8e8;'>⚠️ Enter a 'Book ID' to delete a record.</p>");
        return;
    }

    let bookIndex = libraryDB.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
        let deletedBook = libraryDB.splice(bookIndex, 1)[0];
        triggerLog.unshift(`[AFTER DELETE TRIGGER]: Book "${deletedBook.title}" (ID: ${deletedBook.id}) removed at ${new Date().toLocaleTimeString()}`);
        
        saveToStorage();
        clearInputs();
        printOutput(`<p class='alert-msg' style='border-color: #e74c3c; background: #fde8e8;'>🗑️ DELETED: Book with ID ${id} has been permanently deleted.</p>`);
    } else {
        printOutput(`<p class='alert-msg' style='border-color: #e74c3c; background: #fde8e8;'>❌ Error: Book ID "${id}" does not exist.</p>`);
    }
}

/* --- 4. DISPLAY RECORDS --- */
function displayBooks() {
    if (libraryDB.length === 0) {
        printOutput("<p class='placeholder-text'>Empty Database. No book records to display right now.</p>");
        return;
    }

    let tableHTML = `
        <table class="records-table">
            <thead>
                <tr>
                    <th>Book ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
    `;

    libraryDB.forEach(book => {
        tableHTML += `
            <tr>
                <td><strong>${book.id}</strong></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>$${book.price.toFixed(2)}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    printOutput(tableHTML);
}

/* --- 5. STORED PROCEDURE SIMULATION --- */
function executeProcedure() {
    if (libraryDB.length === 0) {
        printOutput("<p class='alert-msg'>⚙️ <em>Procedure Output:</em> Database is empty. Stats cannot be computed.</p>");
        return;
    }

    let totalValue = libraryDB.reduce((sum, book) => sum + book.price, 0);
    let expensiveBook = libraryDB.reduce((max, book) => book.price > max.price ? book : max, libraryDB[0]);

    let procedureHTML = `
        <div style="line-height: 1.6; text-align: left;">
            <p style="color: #4a90e2; font-weight: bold; margin-bottom: 5px;">⚙️ CALL GetLibraryStatistics();</p>
            <p><strong>Total Inventory Count:</strong> ${libraryDB.length} books</p>
            <p><strong>Total Value:</strong> $${totalValue.toFixed(2)}</p>
            <p><strong>Most Premium Book:</strong> "${expensiveBook.title}" by ${expensiveBook.author} ($${expensiveBook.price.toFixed(2)})</p>
        </div>
    `;
    printOutput(procedureHTML);
}

/* --- 6. TRIGGER DEMONSTRATION --- */
function triggerDemo() {
    if (triggerLog.length === 0) {
        printOutput("<p class='placeholder-text'>⚡ No trigger events caught yet. (Try inserting then deleting a book to ignite an audit trigger!).</p>");
        return;
    }

    let triggerHTML = `<p style="color: #e74c3c; font-weight: bold; margin-bottom: 8px; text-align: left;">⚡ Database Audit Log (Active Triggers):</p>`;
    triggerLog.forEach(log => {
        triggerHTML += `<p style="font-family: monospace; font-size: 0.85rem; margin-bottom: 4px; background: #fff5f5; padding: 4px; border-radius:3px; text-align: left;">${log}</p>`;
    });

    printOutput(triggerHTML);
}
