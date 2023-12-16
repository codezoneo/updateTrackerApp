let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const editModal = document.getElementById('edit-modal');

addBtn.addEventListener('click', function () {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '' || isNaN(amount) || amount <= 0 || date === '') {
        alert('Please enter valid details.');
        return;
    }

    const expenseData = { category, amount, date };

    axios.post("https://crudcrud.com/api/274cf0cbe61244ed82d4a42295e6a5fa/addNewExpense", expenseData)
        .then(data => {
            console.log('Expense added successfully:', data);

            expenses.push(expenseData);
            updateExpensesTable();
        })
        .catch(error => {
            console.error('Error adding expense:', error);
            alert('Error adding expense. Please try again.');
        });
});

function updateExpensesTable() {
    while (expensesTableBody.firstChild) {
        expensesTableBody.removeChild(expensesTableBody.firstChild);
    }
    totalAmount = 0;

    for (const [index, expense] of expenses.entries()) {
        totalAmount += parseInt(expense.amount);

        const newRow = expensesTableBody.insertRow();
        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();
        const deleteBtn = document.createElement('button');
        const editCell = newRow.insertCell();
        const editBtn = document.createElement('button');

        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function () {
            deleteExpense(index);
        });

        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', function () {
            openEditModal(index);
        });

        categoryCell.textContent = expense.category;
        amountCell.textContent = expense.amount;
        dateCell.textContent = expense.date;
        deleteCell.appendChild(deleteBtn);
        editCell.appendChild(editBtn);
    }

    totalAmountCell.textContent = totalAmount;
}

function deleteExpense(index) {
    const expenseToDelete = expenses[index];

    axios.delete(`https://crudcrud.com/api/274cf0cbe61244ed82d4a42295e6a5fa/addNewExpense/${expenseToDelete._id}`)
        .then(response => {
            console.log('Expense deleted successfully:', response);

            expenses.splice(index, 1);
            updateExpensesTable();
        })
        .catch(error => {
            console.error('Error deleting expense:', error);
            alert('Error deleting expense. Please try again.');
        });
}

function openEditModal(index) {
    const expenseToEdit = expenses[index];
    
    document.getElementById('edit-category').value = expenseToEdit.category;
    document.getElementById('edit-amount').value = expenseToEdit.amount;
    document.getElementById('edit-date').value = expenseToEdit.date;

    editModal.style.display = 'block';

    // Save the index for reference when saving edits
    editModal.dataset.editIndex = index;
}

function closeEditModal() {
    editModal.style.display = 'none';
}

function saveEditedExpense() {
    const index = parseInt(editModal.dataset.editIndex);
    const updatedCategory = document.getElementById('edit-category').value;
    const updatedAmount = document.getElementById('edit-amount').value;
    const updatedDate = document.getElementById('edit-date').value;

    if (updatedCategory === '' || isNaN(updatedAmount) || updatedAmount <= 0 || updatedDate === '') {
        alert('Please enter valid details.');
        return;
    }

    const editedExpense = expenses[index];
    editedExpense.category = updatedCategory;
    editedExpense.amount = updatedAmount;
    editedExpense.date = updatedDate;

    closeEditModal();
    updateExpensesTable();
}

window.addEventListener('load', function () {
    fetchExpensesFromAPI();
});

function fetchExpensesFromAPI() {
    axios.get('https://crudcrud.com/api/274cf0cbe61244ed82d4a42295e6a5fa/addNewExpense')
        .then(response => {
            console.log('Expenses fetched successfully:', response);

            expenses = response.data;
            updateExpensesTable();
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
            alert('Error fetching expenses. Please try again.');
        });
}
