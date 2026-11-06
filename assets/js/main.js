"use strict";

const sampleEvents = [
    {
        title: "ورشة عمل برمجة الويب 1",
        category: "technology",
        attendance: "online",
        period: "soon",
        city: "online",
        description: "تعلّم تقنيات وتطبيقات الويب الحديثة بأسلوب عملي تفاعلي.",
        link: "event.html?id=1"
    },
    {
        title: "معرض مشاريع الفصل الدراسي",
        category: "culture",
        attendance: "inperson",
        period: "month",
        city: "دمشق",
        description: "عرض متميز لأبرز مشاريع الطلاب في الجامعة الافتراضية.",
        link: "event.html?id=2"
    },
    {
        title: "ندوة الذكاء الاصطناعي والأمن السيبراني",
        category: "education",
        attendance: "online",
        period: "soon",
        city: "online",
        description: "مناقشة أحدث التطورات والتحديات في مجال الذكاء الاصطناعي والأمن الرقمي.",
        link: "event.html?id=3"
    },
    {
        title: "دورة مهارات التعلم الذاتي والبحث الأكاديمي",
        category: "education",
        attendance: "both",
        period: "month",
        city: "السويداء",
        description: "نشاط إرشادي يساعد الطلاب على تطوير استراتيجيات الدراسة والبحث العلمي.",
        link: "events.html"
    },
    {
        title: "بطولة الشطرنج والأنشطة الطلابية",
        category: "sports",
        attendance: "inperson",
        period: "month",
        city: "حمص",
        description: "فعالية رياضية لتعزيز التواصل والتفكير الاستراتيجي بين الطلاب.",
        link: "events.html"
    },
    {
        title: "لقاء اجتماعي افتراضي لطلاب الجامعة",
        category: "social",
        attendance: "online",
        period: "anytime",
        city: "online",
        description: "فرصة للتعارف وتبادل الخبرات الأكاديمية بين طلاب مختلف المحافظات.",
        link: "events.html"
    }
];

document.addEventListener("DOMContentLoaded", function () {

    // تحديث سنة حقوق الملكية تلقائياً
    const currentYearEl = document.getElementById("currentYear");
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    /* ==================================
       استبيان اختيار الفعاليات (Event Finder)
    ================================== */
    const form = document.getElementById("eventFinderForm");

    if (form) {
        const steps = Array.from(form.querySelectorAll(".question-step"));
        const nextButton = document.getElementById("nextQuestion");
        const previousButton = document.getElementById("previousQuestion");
        const findButton = document.getElementById("findEventsButton");

        const results = document.getElementById("recommendationResults");
        const resultsList = document.getElementById("recommendationList");
        const summary = document.getElementById("recommendationSummary");

        const counter = document.getElementById("questionCounter");
        const percentage = document.getElementById("progressPercentage");
        const progressBar = document.getElementById("progressBar");
        const errorBox = document.getElementById("finderError");

        const cityInput = document.getElementById("preferredCity");
        const anyCityCheckbox = document.getElementById("anyCity");

        let currentStep = 0;

        const answers = {
            category: "",
            attendance: "",
            period: "",
            city: ""
        };

        function showStep(index) {
            steps.forEach(function (step, i) {
                step.classList.toggle("active", i === index);
            });

            currentStep = index;

            if (previousButton) {
                previousButton.hidden = index === 0;
            }

            if (nextButton) {
                nextButton.hidden = index === steps.length - 1;
            }

            if (findButton) {
                findButton.hidden = index !== steps.length - 1;
            }

            if (counter) {
                counter.textContent = "السؤال " + (index + 1) + " من " + steps.length;
            }

            const value = Math.round(((index + 1) / steps.length) * 100);

            if (percentage) {
                percentage.textContent = value + "%";
            }

            if (progressBar) {
                progressBar.style.width = value + "%";
                progressBar.setAttribute("aria-valuenow", value);
            }

            if (errorBox) {
                errorBox.hidden = true;
                errorBox.textContent = "";
            }
        }

        function showError(message) {
            if (errorBox) {
                errorBox.textContent = message;
                errorBox.hidden = false;
            } else {
                alert(message);
            }
        }

        function saveAnswer() {
            const step = steps[currentStep];
            if (!step) return;

            if (currentStep < 3) {
                const selected = step.querySelector('input[type="radio"]:checked');
                if (selected) {
                    if (currentStep === 0) answers.category = selected.value;
                    if (currentStep === 1) answers.attendance = selected.value;
                    if (currentStep === 2) answers.period = selected.value;
                }
            } else {
                answers.city = cityInput ? cityInput.value.trim() : "";
            }
        }

        function validateCurrentStep() {
            if (currentStep === 3) {
                return true;
            }

            const selected = steps[currentStep].querySelector('input[type="radio"]:checked');
            if (!selected) {
                showError("يرجى اختيار إجابة أولاً قبل الانتقال للسؤال التالي.");
                return false;
            }

            return true;
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                if (!validateCurrentStep()) return;
                saveAnswer();
                if (currentStep < steps.length - 1) {
                    showStep(currentStep + 1);
                }
            });
        }

        if (previousButton) {
            previousButton.addEventListener("click", function () {
                if (currentStep > 0) {
                    showStep(currentStep - 1);
                }
            });
        }

        if (anyCityCheckbox && cityInput) {
            function updateCityField() {
                cityInput.disabled = anyCityCheckbox.checked;
            }
            anyCityCheckbox.addEventListener("change", updateCityField);
            updateCityField();
        }

        function displayRecommendations() {
            saveAnswer();

            if (!results || !resultsList) return;

            const anyCity = anyCityCheckbox ? anyCityCheckbox.checked : true;

            const matches = sampleEvents.filter(function (event) {
                const categoryMatch = event.category === answers.category;
                const attendanceMatch =
                    answers.attendance === "both" ||
                    event.attendance === answers.attendance ||
                    event.attendance === "both";
                const periodMatch =
                    answers.period === "anytime" ||
                    event.period === answers.period ||
                    event.period === "anytime";
                const cityMatch =
                    anyCity ||
                    !answers.city ||
                    event.city.toLowerCase().includes(answers.city.toLowerCase()) ||
                    event.city === "online";

                return categoryMatch && attendanceMatch && periodMatch && cityMatch;
            });

            resultsList.innerHTML = "";

            if (summary) {
                summary.textContent = "هذه الفعاليات المقترحة مبنية على اختياراتك واهتماماتك:";
            }

            if (matches.length === 0) {
                const message = document.createElement("div");
                message.className = "col-12";

                const box = document.createElement("div");
                box.className = "no-results text-center p-4";
                box.innerHTML = `
                    <div class="mb-2" style="font-size: 2rem;">🔍</div>
                    <h5 class="fw-bold mb-2">لم نجد فعالية مطابقة لجميع معاييرك المحددة</h5>
                    <p class="mb-3 text-muted">يمكنك إعادة المحاولة وتجربة معايير أخرى، أو تصفح الدليل الكامل للفعاليات.</p>
                    <a href="events.html" class="btn btn-primary-custom btn-sm">تصفح جميع الفعاليات</a>
                `;

                message.appendChild(box);
                resultsList.appendChild(message);
            } else {
                matches.forEach(function (event) {
                    const column = document.createElement("div");
                    column.className = "col-md-6";

                    const card = document.createElement("article");
                    card.className = "recommendation-card";

                    const badge = document.createElement("span");
                    badge.className = "section-label mb-2";
                    badge.textContent = "مقترح لك";

                    const title = document.createElement("h4");
                    title.textContent = event.title;

                    const description = document.createElement("p");
                    description.textContent = event.description;

                    const location = document.createElement("p");
                    location.innerHTML = "<strong>📍 المكان:</strong> " + (event.city === "online" ? "أونلاين (عن بُعد)" : event.city);

                    const link = document.createElement("a");
                    link.href = event.link || "events.html";
                    link.className = "btn btn-outline-custom btn-sm mt-3";
                    link.textContent = "عرض التفاصيل ←";

                    card.appendChild(badge);
                    card.appendChild(title);
                    card.appendChild(description);
                    card.appendChild(location);
                    card.appendChild(link);

                    column.appendChild(card);
                    resultsList.appendChild(column);
                });
            }

            results.hidden = false;

            steps.forEach(function (step) {
                step.classList.remove("active");
            });

            if (nextButton) nextButton.hidden = true;
            if (findButton) findButton.hidden = true;
            if (previousButton) previousButton.hidden = true;

            results.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        if (findButton) {
            findButton.addEventListener("click", function (e) {
                e.preventDefault();
                if (!validateCurrentStep()) return;
                saveAnswer();
                displayRecommendations();
            });
        }

        const restartButton = document.getElementById("restartFinder");
        if (restartButton) {
            restartButton.addEventListener("click", function () {
                form.reset();
                answers.category = "";
                answers.attendance = "";
                answers.period = "";
                answers.city = "";

                if (results) results.hidden = true;

                if (anyCityCheckbox && cityInput) {
                    cityInput.disabled = anyCityCheckbox.checked;
                }

                showStep(0);
            });
        }

        if (steps.length > 0) {
            showStep(0);
        }
    }

    /* ==================================
       نموذج اقتراح فعالية جديدة (Suggestions Form)
    ================================== */
    const suggestionForm = document.getElementById("suggestionForm");
    const suggestionMessage = document.getElementById("suggestionMessage");

    if (suggestionForm) {
        suggestionForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!suggestionForm.checkValidity()) {
                suggestionForm.reportValidity();
                return;
            }

            if (suggestionMessage) {
                suggestionMessage.innerHTML = `
                    <strong>✦ شكراً جزيلاً لاقتراحك!</strong>
                    <div>تم استلام فكرتك وسيقوم فريق العمل بمراجعتها ودراسة إمكانية إضافتها للدليل. (عرض تجريبي للواجهة الأمامية)</div>
                `;
                suggestionMessage.hidden = false;
                suggestionMessage.className = "alert alert-success mt-3 shadow-sm";
            }

            suggestionForm.reset();
        });
    }

});

