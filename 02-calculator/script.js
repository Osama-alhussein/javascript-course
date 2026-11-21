// دالة تحسب مجموع الأعداد من 1 حتى الرقم المدخل.
function calculateSum(number) {
  let sum = 0

  // تكرار الجمع وتخزين الناتج في sum.
  for (let currentNumber = 1; currentNumber <= number; currentNumber++) {
    sum += currentNumber
  }

  return sum
}

// الوصول إلى مكان عرض النتيجة وزر الحساب في الصفحة.
const result = document.getElementById('result')
const calculateButton = document.getElementById('calculate-button')

// عند الضغط على الزر، نطلب من المستخدم إدخال رقم.
calculateButton.addEventListener('click', function () {
  const input = prompt('أدخل رقمًا صحيحًا موجبًا:')

  // إذا ألغى المستخدم الإدخال، نعرض رسالة ونوقف العملية.
  if (input === null) {
    result.textContent = 'تم إلغاء العملية.'
    return
  }

  // تحويل الإدخال إلى رقم والتحقق من أنه عدد صحيح موجب.
  const number = Number(input)

  if (!Number.isInteger(number) || number < 1) {
    result.textContent = 'الرجاء إدخال رقم صحيح موجب.'
    return
  }

  // حساب المجموع وعرضه في الصفحة.
  const sum = calculateSum(number)
  result.textContent = `مجموع الأعداد من 1 إلى ${number} هو ${sum}.`
})
