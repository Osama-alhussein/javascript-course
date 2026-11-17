const profileForm = document.getElementById('profile-form')

profileForm.addEventListener('submit', function (event) {
  event.preventDefault()

  // الحصول على القيم من النموذج
  const fullName = document.getElementById('full-name').value.trim()
  const age = Number(document.getElementById('age').value)
  const country = document.getElementById('country').value.trim()
  const major = document.getElementById('major').value.trim()
  const university = document.getElementById('university').value.trim()
  const phone = document.getElementById('phone').value.trim()

  const isStudent = document.querySelector(
    'input[name="student"]:checked',
  ).value
  const isWorking = document.querySelector(
    'input[name="working"]:checked',
  ).value

  // حساب السنة الميلادية بناءً على العمر
  const birthYear = new Date().getFullYear() - age
  const ageAfter5Years = age + 5
  const yearsUntil30 = Math.max(30 - age, 0)

  // إنشاء كائن الطالب
  const student = {
    fullName,
    age,
    country,
    major,
    university: university || 'Not provided',
    phone: phone || 'Not provided',
    isStudent,
    isWorking,
    birthYear,
    ageAfter5Years,
    yearsUntil30,
  }

  // عرض معلومات الطالب في وحدة التحكم
  console.log('STUDENT PROFILE')
  console.log(student)
})
