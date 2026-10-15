const translations = {
  en: {
    title: "Service booking",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    customerName: "Customer name",
    phone: "Phone number",
    carType: "Car type",
    serviceType: "Service",
    preferredDate: "Preferred date",
    preferredTime: "Preferred time",
    createBooking: "Create booking",
    bookings: "Bookings",
    refresh: "Refresh",
    chooseCar: "Choose car type",
    chooseService: "Choose a service",
    cars: { Sedan: "Sedan", SUV: "SUV", Hatchback: "Hatchback", Van: "Van" },
    services: {
      "Exterior wash": "Exterior wash",
      "Full wash": "Full wash",
      "Interior detailing": "Interior detailing"
    },
    statuses: { pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" },
    statusLabel: "Booking status",
    nameLabel: "Name",
    phoneLabel: "Phone",
    carLabel: "Car",
    serviceLabel: "Service",
    dateLabel: "Date",
    timeLabel: "Time",
    emptyBookings: "No bookings yet.",
    created: "Booking created successfully.",
    saved: "Booking status updated.",
    genericError: "Something went wrong. Please try again.",
    demoNote: "Demo project. The booking list and status controls are not protected by authentication."
  },
  ar: {
    title: "حجز خدمة",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
    customerName: "اسم العميل",
    phone: "رقم الهاتف",
    carType: "نوع السيارة",
    serviceType: "الخدمة",
    preferredDate: "التاريخ المفضل",
    preferredTime: "الوقت المفضل",
    createBooking: "إنشاء الحجز",
    bookings: "الحجوزات",
    refresh: "تحديث",
    chooseCar: "اختر نوع السيارة",
    chooseService: "اختر الخدمة",
    cars: { Sedan: "سيدان", SUV: "دفع رباعي", Hatchback: "هاتشباك", Van: "فان" },
    services: {
      "Exterior wash": "غسيل خارجي",
      "Full wash": "غسيل كامل",
      "Interior detailing": "تنظيف داخلي شامل"
    },
    statuses: { pending: "قيد الانتظار", confirmed: "مؤكد", completed: "مكتمل", cancelled: "ملغي" },
    statusLabel: "حالة الحجز",
    nameLabel: "الاسم",
    phoneLabel: "الهاتف",
    carLabel: "السيارة",
    serviceLabel: "الخدمة",
    dateLabel: "التاريخ",
    timeLabel: "الوقت",
    emptyBookings: "لا توجد حجوزات حتى الآن.",
    created: "تم إنشاء الحجز بنجاح.",
    saved: "تم تحديث حالة الحجز.",
    genericError: "حدث خطأ. حاول مرة أخرى.",
    demoNote: "مشروع تجريبي. قائمة الحجوزات والتحكم في الحالات غير محميين بتسجيل الدخول."
  }
};

const bookingForm = document.querySelector("#booking-form");
const bookingList = document.querySelector("#booking-list");
const formMessage = document.querySelector("#form-message");
const listMessage = document.querySelector("#list-message");
const themeToggle = document.querySelector("#theme-toggle");
const carSelect = bookingForm.elements.carType;
const serviceSelect = bookingForm.elements.serviceType;
let language = localStorage.getItem("booking-language") || "en";

function currentText() {
  return translations[language];
}

function setMessage(element, message, type = "") {
  element.textContent = message;
  element.className = `form-message${type ? ` is-${type}` : ""}`;
}

function fillSelect(select, placeholder, values) {
  const previousValue = select.value;
  select.replaceChildren(new Option(placeholder, ""));
  Object.entries(values).forEach(([value, label]) => select.add(new Option(label, value)));
  if ([...select.options].some((option) => option.value === previousValue)) {
    select.value = previousValue;
  }
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  localStorage.setItem("booking-language", language);
  const text = currentText();
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = text[key];
  });
  document.querySelector("#language-en").classList.toggle("is-active", language === "en");
  document.querySelector("#language-ar").classList.toggle("is-active", language === "ar");
  document.querySelector("#language-en").setAttribute("aria-pressed", String(language === "en"));
  document.querySelector("#language-ar").setAttribute("aria-pressed", String(language === "ar"));
  themeToggle.textContent = document.documentElement.dataset.theme === "dark" ? text.lightMode : text.darkMode;
  fillSelect(carSelect, text.chooseCar, text.cars);
  fillSelect(serviceSelect, text.chooseService, text.services);
  loadBookings();
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("booking-theme", theme);
  themeToggle.textContent = theme === "dark" ? currentText().lightMode : currentText().darkMode;
}

function addDetail(container, label, value) {
  const paragraph = document.createElement("p");
  const strong = document.createElement("span");
  strong.className = "detail-label";
  strong.textContent = `${label}: `;
  paragraph.append(strong, document.createTextNode(value));
  container.append(paragraph);
}

function renderBooking(booking) {
  const text = currentText();
  const article = document.createElement("article");
  article.className = "booking-item";

  const main = document.createElement("div");
  const name = document.createElement("p");
  name.className = "booking-name";
  name.textContent = booking.customerName;
  const details = document.createElement("div");
  details.className = "booking-details";
  const displayDate = new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en", {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC"
  }).format(new Date(booking.preferredDate));
  addDetail(details, text.phoneLabel, booking.phone);
  addDetail(details, text.carLabel, text.cars[booking.carType] || booking.carType);
  addDetail(details, text.serviceLabel, text.services[booking.serviceType] || booking.serviceType);
  addDetail(details, text.dateLabel, displayDate);
  addDetail(details, text.timeLabel, booking.preferredTime);
  main.append(name, details);

  const statusArea = document.createElement("div");
  statusArea.className = "booking-status";
  const status = document.createElement("span");
  status.className = `status-badge status-${booking.status}`;
  status.textContent = text.statuses[booking.status] || booking.status;
  const select = document.createElement("select");
  select.className = "status-select";
  select.setAttribute("aria-label", `${text.statusLabel}: ${booking.customerName}`);
  Object.entries(text.statuses).forEach(([value, label]) => select.add(new Option(label, value)));
  select.value = booking.status;
  select.addEventListener("change", () => updateStatus(booking._id, select.value));
  statusArea.append(status, select);
  article.append(main, statusArea);
  return article;
}

async function loadBookings() {
  try {
    const response = await fetch("/bookings");
    if (!response.ok) throw new Error("Could not load bookings");
    const bookings = await response.json();
    bookingList.replaceChildren();
    if (bookings.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = currentText().emptyBookings;
      bookingList.append(empty);
      return;
    }
    bookings.forEach((booking) => bookingList.append(renderBooking(booking)));
    setMessage(listMessage, "");
  } catch (_error) {
    setMessage(listMessage, currentText().genericError, "error");
  }
}

async function updateStatus(id, status) {
  try {
    const response = await fetch(`/bookings/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error("Could not update status");
    setMessage(listMessage, currentText().saved, "success");
    await loadBookings();
  } catch (_error) {
    setMessage(listMessage, currentText().genericError, "error");
    await loadBookings();
  }
}

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(formMessage, "");
  const payload = Object.fromEntries(new FormData(bookingForm).entries());
  try {
    const response = await fetch("/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || currentText().genericError);
    bookingForm.reset();
    setMessage(formMessage, currentText().created, "success");
    await loadBookings();
  } catch (error) {
    setMessage(formMessage, error.message || currentText().genericError, "error");
  }
});

document.querySelector("#language-en").addEventListener("click", () => setLanguage("en"));
document.querySelector("#language-ar").addEventListener("click", () => setLanguage("ar"));
document.querySelector("#refresh-bookings").addEventListener("click", loadBookings);
themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

setTheme(localStorage.getItem("booking-theme") || "light");
setLanguage(language);

