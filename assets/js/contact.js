"use strict";

function isValidEmailFormat(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(String(email).trim());
}

function escapeHtmlText(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderFormAlert(type, title, messagesList) {
    const alertContainer = document.getElementById("contactAlertContainer");
    if (!alertContainer) return;

    const itemsHtml = Array.isArray(messagesList) && messagesList.length > 0
        ? `<ul class="mb-0 mt-2 ps-3">${messagesList.map(msg => `<li>${msg}</li>`).join("")}</ul>`
        : "";

    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
            <div class="fw-bold">${title}</div>
            ${itemsHtml}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button>
        </div>
    `;

    const closeBtn = alertContainer.querySelector(".btn-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            alertContainer.innerHTML = "";
        });
    }

    alertContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function setFieldValidityState(inputEl, errorEl, isValid, errorMessage) {
    if (!inputEl) return;

    if (isValid) {
        inputEl.classList.remove("is-invalid");
        inputEl.classList.add("is-valid");
        if (errorEl) errorEl.textContent = "";
    } else {
        inputEl.classList.remove("is-valid");
        inputEl.classList.add("is-invalid");
        if (errorEl && errorMessage) errorEl.textContent = errorMessage;
    }
}

function clearValidationClasses(inputs) {
    inputs.forEach(inputEl => {
        if (inputEl) {
            inputEl.classList.remove("is-valid", "is-invalid");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("emailAddress");
    const messageInput = document.getElementById("messageText");

    const fullNameError = document.getElementById("fullNameError");
    const emailError = document.getElementById("emailAddressError");
    const messageError = document.getElementById("messageTextError");

    if (!contactForm) return;

    if (fullNameInput) {
        fullNameInput.addEventListener("input", () => {
            if (fullNameInput.classList.contains("is-invalid") && fullNameInput.value.trim().length > 0) {
                setFieldValidityState(fullNameInput, fullNameError, true, "");
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener("input", () => {
            if (emailInput.classList.contains("is-invalid") && isValidEmailFormat(emailInput.value)) {
                setFieldValidityState(emailInput, emailError, true, "");
            }
        });
    }

    if (messageInput) {
        messageInput.addEventListener("input", () => {
            if (messageInput.classList.contains("is-invalid") && messageInput.value.trim().length > 0) {
                setFieldValidityState(messageInput, messageError, true, "");
            }
        });
    }

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const fullNameVal = fullNameInput ? fullNameInput.value.trim() : "";
        const emailVal = emailInput ? emailInput.value.trim() : "";
        const messageVal = messageInput ? messageInput.value.trim() : "";

        const validationErrors = [];

        if (!fullNameVal) {
            const msg = "حقل الاسم الكامل مطلوب. يرجى إدخال اسمك.";
            setFieldValidityState(fullNameInput, fullNameError, false, msg);
            validationErrors.push(msg);
        } else {
            setFieldValidityState(fullNameInput, fullNameError, true, "");
        }

        if (!emailVal) {
            const msg = "حقل البريد الإلكتروني مطلوب. يرجى إدخال عنوان بريدك الإلكتروني.";
            setFieldValidityState(emailInput, emailError, false, msg);
            validationErrors.push(msg);
        } else if (!isValidEmailFormat(emailVal)) {
            const msg = "صيغة البريد الإلكتروني غير صحيحة. يرجى إدخال بريد إلكتروني صالح (مثال: student@svuonline.org).";
            setFieldValidityState(emailInput, emailError, false, msg);
            validationErrors.push(msg);
        } else {
            setFieldValidityState(emailInput, emailError, true, "");
        }

        if (!messageVal) {
            const msg = "حقل الرسالة مطلوب. يرجى كتابة نص استفسارك أو ملاحظتك.";
            setFieldValidityState(messageInput, messageError, false, msg);
            validationErrors.push(msg);
        } else {
            setFieldValidityState(messageInput, messageError, true, "");
        }

        if (validationErrors.length > 0) {
            renderFormAlert(
                "danger",
                "تعذّر إرسال النموذج بسبب وجود ملاحظات في البيانات المدخلة:",
                validationErrors
            );
            return;
        }

        const submittedName = escapeHtmlText(fullNameVal);
        const submittedEmail = escapeHtmlText(emailVal);

        contactForm.reset();
        clearValidationClasses([fullNameInput, emailInput, messageInput]);

        renderFormAlert(
            "success",
            `✦ شكراً لك يا ${submittedName}! تم استلام رسالتك بنجاح.`,
            [
                `البريد المسجل: <strong>${submittedEmail}</strong>`,
                "<strong>ملاحظة (عرض تجريبي - Frontend Demonstration):</strong> يعمل هذا الموقع كنموذج لواجهات الويب الأمامية بدون خادم بريد فعلي. تم التحقق من سلامة كافة الحقول والمدخلات بنجاح!"
            ]
        );
    });
});

