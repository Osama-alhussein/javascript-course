
// HTML Elements
const studentsList = document.getElementById('students-list')
const studentsCount = document.getElementById('students-count')
const searchInput = document.getElementById('search-input')
const sortBtn = document.getElementById('sort-btn')
const passedBtn = document.getElementById('passed-btn')
const allBtn = document.getElementById('all-btn')
const noResults = document.getElementById('no-results')
const studentForm = document.getElementById('student-form')
const studentName = document.getElementById('student-name')
const studentAge = document.getElementById('student-age')
const studentGrade = document.getElementById('student-grade')
const formTitle = document.getElementById('form-title')
const submitBtn = document.getElementById('submit-btn')
const cancelEditBtn = document.getElementById('cancel-edit-btn')
const errorMessage = document.getElementById('error-message')

// API URL
const API_URL = 'http://localhost:3000/students'

// Current Editing Student ID
let editingStudentId = null

// Students Data
let allStudents = []
let showPassedOnly = false
let sortByGrade = false

// Show Error Message
function showError(message) {
    errorMessage.textContent = message
    errorMessage.hidden = false
}

// Hide Error Message
function hideError() {
    errorMessage.textContent = ''
    errorMessage.hidden = true
}

// Escape HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
        const characters = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        }

        return characters[character]
    })
}

// Fetch Students
async function fetchStudents() {
    try {
        const response = await fetch(API_URL)

        if (!response.ok) {
            throw new Error('تعذر تحميل بيانات الطلاب')
        }

        allStudents = await response.json()

        studentsCount.textContent = allStudents.length

        updateStudents()

    } catch (error) {
        console.error('Error fetching students:', error)
        showError('حدث خطأ أثناء تحميل بيانات الطلاب. تأكد من تشغيل JSON Server.')
    }
}

// Display Students
function displayStudents(students) {
    studentsList.innerHTML = ''

    if (students.length === 0) {
        noResults.hidden = false
        return
    }

    noResults.hidden = true

    students.forEach((student) => {
        const result = Number(student.grade) >= 50
            ? '<span class="result result-passed">ناجح</span>'
            : '<span class="result result-failed">راسب</span>'

        studentsList.innerHTML += `
            <tr>
                <td>${escapeHTML(student.name)}</td>
                <td>${escapeHTML(student.age)}</td>
                <td>${escapeHTML(student.grade)}</td>
                <td>${result}</td>
                <td>
                    <button class="edit-btn" data-id="${escapeHTML(student.id)}">
                        تعديل
                    </button>

                    <button class="delete-btn" data-id="${escapeHTML(student.id)}">
                        حذف
                    </button>
                </td>
            </tr>
        `
    })
}

// Update Students
function updateStudents() {
    let filteredStudents = [...allStudents]

    // Search
    const searchValue = searchInput.value.trim().toLowerCase()

    filteredStudents = filteredStudents.filter((student) =>
        String(student.name).toLowerCase().includes(searchValue)
    )

    // Show Passed Students
    if (showPassedOnly) {
        filteredStudents = filteredStudents.filter(
            (student) => Number(student.grade) >= 50
        )
    }

    // Sort by Grade
    if (sortByGrade) {
        filteredStudents.sort(
            (a, b) => Number(b.grade) - Number(a.grade)
        )
    }

    displayStudents(filteredStudents)
}

// Search Event
searchInput.addEventListener('input', updateStudents)

// Sort Event
sortBtn.addEventListener('click', () => {
    sortByGrade = !sortByGrade

    sortBtn.textContent = sortByGrade
        ? 'إلغاء الترتيب ↑'
        : 'ترتيب حسب الدرجة ↓'

    updateStudents()
})

// Passed Students Event
passedBtn.addEventListener('click', () => {
    showPassedOnly = true
    passedBtn.classList.add('active')
    allBtn.classList.remove('active')

    updateStudents()
})

// Show All Students Event
allBtn.addEventListener('click', () => {
    showPassedOnly = false
    sortByGrade = false
    searchInput.value = ''

    sortBtn.textContent = 'ترتيب حسب الدرجة ↓'

    allBtn.classList.add('active')
    passedBtn.classList.remove('active')

    updateStudents()
})

// Edit and Delete Events
studentsList.addEventListener('click', async (event) => {

    // Edit Student
    const editButton = event.target.closest('.edit-btn')

    if (editButton) {
        const studentId = editButton.dataset.id

        const student = allStudents.find(
            (student) => String(student.id) === studentId
        )

        if (!student) return

        studentName.value = student.name
        studentAge.value = student.age
        studentGrade.value = student.grade

        editingStudentId = student.id

        formTitle.textContent = 'تعديل بيانات الطالب'
        submitBtn.textContent = 'تحديث الطالب'
        cancelEditBtn.hidden = false

        hideError()

        studentForm.scrollIntoView({
            behavior: 'smooth',
        })

        return
    }

    // Delete Student
    const deleteButton = event.target.closest('.delete-btn')

    if (deleteButton) {
        const studentId = deleteButton.dataset.id

        const confirmDelete = confirm(
            'هل أنت متأكد من حذف هذا الطالب؟'
        )

        if (!confirmDelete) return

        try {
            const response = await fetch(
                `${API_URL}/${encodeURIComponent(studentId)}`,
                {
                    method: 'DELETE',
                }
            )

            if (!response.ok) {
                throw new Error('تعذر حذف الطالب')
            }

            allStudents = allStudents.filter(
                (student) => String(student.id) !== studentId
            )

            studentsCount.textContent = allStudents.length

            if (String(editingStudentId) === studentId) {
                resetForm()
            }

            hideError()
            updateStudents()

        } catch (error) {
            console.error('Error deleting student:', error)
            showError('حدث خطأ أثناء حذف الطالب.')
        }
    }
})

// Add New / Edit Student
studentForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    hideError()

    const studentData = {
        name: studentName.value.trim(),
        age: Number(studentAge.value),
        grade: Number(studentGrade.value),
    }

    if (!studentData.name) {
        showError('يرجى إدخال اسم الطالب.')
        return
    }

    if (
        !Number.isInteger(studentData.age) ||
        studentData.age < 1 ||
        studentData.age > 120
    ) {
        showError('يرجى إدخال عمر صحيح.')
        return
    }

    if (
        !Number.isFinite(studentData.grade) ||
        studentData.grade < 0 ||
        studentData.grade > 100
    ) {
        showError('يجب أن تكون الدرجة بين 0 و100.')
        return
    }

    submitBtn.disabled = true

    try {

        // Edit Student
        if (editingStudentId !== null) {

            const response = await fetch(
                `${API_URL}/${encodeURIComponent(editingStudentId)}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentData),
                }
            )

            if (!response.ok) {
                throw new Error('تعذر تحديث بيانات الطالب')
            }

            const updatedStudent = await response.json()

            allStudents = allStudents.map((student) =>
                String(student.id) === String(updatedStudent.id)
                    ? updatedStudent
                    : student
            )

        }

        // Add New Student
        else {

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            })

            if (!response.ok) {
                throw new Error('تعذر إضافة الطالب')
            }

            const newStudent = await response.json()

            allStudents.push(newStudent)
        }

        studentsCount.textContent = allStudents.length

        resetForm()
        updateStudents()

    } catch (error) {
        console.error('Error saving student:', error)
        showError('حدث خطأ أثناء حفظ بيانات الطالب.')
    } finally {
        submitBtn.disabled = false
    }
})

// Reset Form
function resetForm() {
    studentForm.reset()

    editingStudentId = null

    formTitle.textContent = 'إضافة طالب جديد'
    submitBtn.textContent = 'إضافة الطالب'

    cancelEditBtn.hidden = true
}

// Cancel Edit Event
cancelEditBtn.addEventListener('click', () => {
    resetForm()
    hideError()
})

// Start Application
fetchStudents()
