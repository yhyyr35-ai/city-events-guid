"use strict";

const eventsDatabase = {
    "1": {
        id: "1",
        title: "ورشة عمل برمجة الويب 1",
        category: "ورشة عمل",
        categoryClass: "badge-event-workshop",
        categorySlug: "ورشة",
        date: "2021-9-15",
        icsDate: "2026-11-15",
        location: "أونلاين (عبر منصة الجامعة الافتراضية)",
        image: "assets/images/image1.jpg",
        description: "تعلّم تقنيات وتطبيقات الويب الحديثة بأسلوب عملي تفاعلي. تغطي هذه الورشة أساسيات بناء صفحات الويب المتوافقة باستخدام HTML5 و CSS3 و JavaScript، بالإضافة إلى أفضل الممارسات في التصميم المتجاوب وتجربة المستخدم.",
        breadcrumbText: "ورشة عمل برمجة الويب 1"
    },
    "2": {
        id: "2",
        title: "معرض مشاريع الفصل الدراسي",
        category: "معرض",
        categoryClass: "badge-event-exhibition",
        categorySlug: "معرض",
        date: "2020-1-01",
        icsDate: "2026-12-01",
        location: "المقر الرئيسي - قاعة المؤتمرات والمعارض",
        image: "assets/images/image2.jpg",
        description: "عرض متميز لأبرز مشاريع الطلاب المنجزة خلال الفصل الدراسي الحالي بمختلف الاختصاصات الهندسية والتقنية في الجامعة الافتراضية، مع فرصة للتفاعل المباشر ومناقشة الحلول الابتكارية وتبادل الخبرات.",
        breadcrumbText: "معرض مشاريع الفصل الدراسي"
    },
    "3": {
        id: "3",
        title: "ندوة الذكاء الاصطناعي والأمن السيبراني",
        category: "ندوة أكاديمية",
        categoryClass: "badge-event-seminar",
        categorySlug: "ندوة",
        date: "2022-3-10",
        icsDate: "2026-12-10",
        location: "أونلاين (عبر القاعة الافتراضية الكبرى)",
        image: "assets/images/image3.jpg",
        description: "مناقشة أحدث التطورات والتحديات في مجال الذكاء الاصطناعي والأمن السيبراني. يشارك في هذه الندوة نخبة من الأساتذة والخبراء لاستعراض دور النماذج التوليدية وحماية البيانات في العصر الرقمي.",
        breadcrumbText: "ندوة الذكاء الاصطناعي والأمن السيبراني"
    }
};

function getPageEventData() {
    const container = document.getElementById("eventPageContainer");
    const titleEl = document.getElementById("eventTitle");
    const categoryEl = document.getElementById("eventCategoryBadge");
    const dateEl = document.getElementById("eventDate");
    const locationEl = document.getElementById("eventLocation");
    const descEl = document.getElementById("eventDescription");

    return {
        id: container ? container.getAttribute("data-event-id") || "1" : "1",
        icsDate: container ? container.getAttribute("data-ics-date") || "" : "",
        cardDate: dateEl ? dateEl.textContent.trim() : "",
        title: titleEl ? titleEl.textContent.trim() : document.title,
        category: categoryEl ? categoryEl.textContent.trim() : "",
        location: locationEl ? locationEl.textContent.trim() : "",
        description: descEl ? descEl.textContent.trim() : ""
    };
}

function normalizeDateToYyyyMmDd(dateStr) {
    const parts = String(dateStr || "").trim().split("-");
    if (parts.length !== 3) return "20261115";
    const year = parts[0].padStart(4, "0");
    const month = parts[1].padStart(2, "0");
    const day = parts[2].padStart(2, "0");
    return `${year}${month}${day}`;
}

function getNextDayYyyyMmDd(dateStr) {
    const parts = String(dateStr || "").trim().split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return "20261116";
    const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + 1));
    const y = String(dt.getUTCFullYear()).padStart(4, "0");
    const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const d = String(dt.getUTCDate()).padStart(2, "0");
    return `${y}${m}${d}`;
}

function escapeIcsText(text) {
    if (!text) return "";
    return String(text)
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\r?\n/g, "\\n");
}

function showActionFeedback(type, message) {
    const feedbackContainer = document.getElementById("actionFeedback");
    if (!feedbackContainer) return;

    feedbackContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show mt-3 mb-0 shadow-sm" role="alert">
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button>
        </div>
    `;

    const closeBtn = feedbackContainer.querySelector(".btn-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            feedbackContainer.innerHTML = "";
        });
    }
}

function downloadEventIcs() {
    const eventData = getPageEventData();
    const rawDate = eventData.icsDate || eventData.cardDate;
    const dtStart = normalizeDateToYyyyMmDd(rawDate);
    const dtEnd = getNextDayYyyyMmDd(rawDate);
    const nowUtc = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//SVU Events Guide//Unified Event Page//AR",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:svu-event-${eventData.id}@svuonline.org`,
        `DTSTAMP:${nowUtc}`,
        `DTSTART;VALUE=DATE:${dtStart}`,
        `DTEND;VALUE=DATE:${dtEnd}`,
        `SUMMARY:${escapeIcsText(eventData.title)}`,
        `CATEGORIES:${escapeIcsText(eventData.category)}`,
        `LOCATION:${escapeIcsText(eventData.location)}`,
        `DESCRIPTION:${escapeIcsText(eventData.description)}`,
        `URL:${escapeIcsText(window.location.href)}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
    ];

    const icsContent = icsLines.join("\r\n");
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `svu-event-${eventData.id}.ics`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showActionFeedback(
        "success",
        `<strong>✦ تم بنجاح!</strong> تم تنزيل ملف التقويم (svu-event-${eventData.id}.ics) لفعالية: "${eventData.title}".`
    );
}

async function copyEventUrlToClipboard() {
    const shareUrl = window.location.href;
    try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            await navigator.clipboard.writeText(shareUrl);
            showActionFeedback(
                "info",
                `<strong>✦ تم نسخ الرابط بنجاح!</strong> رابط الفعالية في الحافظة الآن:<br><code class="user-select-all mt-1">${shareUrl}</code>`
            );
            return true;
        }
    } catch (err) {
        // Fallback below
    }

    const tempInput = document.createElement("input");
    tempInput.value = shareUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    let copied = false;
    try {
        copied = document.execCommand("copy");
    } catch (e) {
        copied = false;
    }
    document.body.removeChild(tempInput);

    if (copied) {
        showActionFeedback(
            "info",
            `<strong>✦ تم نسخ الرابط بنجاح!</strong> رابط الفعالية في الحافظة الآن:<br><code class="user-select-all mt-1">${shareUrl}</code>`
        );
    } else {
        showActionFeedback(
            "warning",
            `تعذّر النسخ التلقائي. يمكنك نسخ الرابط يدوياً:<br><code class="user-select-all mt-1">${shareUrl}</code>`
        );
    }
    return copied;
}

async function handleShareEvent() {
    const eventData = getPageEventData();
    const shareData = {
        title: `${eventData.title} - دليل فعاليات الجامعة الافتراضية`,
        text: `${eventData.title} (${eventData.category}) - التاريخ: ${eventData.cardDate}`,
        url: window.location.href
    };

    if (navigator.share && typeof navigator.share === "function") {
        try {
            await navigator.share(shareData);
            showActionFeedback("success", "✦ تمت مشاركة الفعالية بنجاح عبر نافذة المشاركة.");
            return;
        } catch (error) {
            if (error && error.name === "AbortError") {
                return;
            }
        }
    }

    await copyEventUrlToClipboard();
}

/**
 * تحديث محتوى الصفحة ديناميكياً إذا وُجد معرّف في الرابط ?id=X
 */
function applyEventFromQueryParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("id");

    if (!eventId || !eventsDatabase[eventId]) {
        return; // الاحتفاظ بالمحتوى الافتراضي المكتوب في الصفحة
    }

    const ev = eventsDatabase[eventId];
    const container = document.getElementById("eventPageContainer");
    if (container) {
        container.setAttribute("data-event-id", ev.id);
        container.setAttribute("data-ics-date", ev.icsDate);
    }

    document.title = `${ev.title} - دليل فعاليات الجامعة الافتراضية السورية`;

    const titleEl = document.getElementById("eventTitle");
    if (titleEl) titleEl.textContent = ev.title;

    const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = ev.breadcrumbText;

    const mainImg = document.getElementById("eventMainImage");
    if (mainImg) {
        mainImg.src = ev.image;
        mainImg.alt = ev.title;
    }

    const badge = document.getElementById("eventCategoryBadge");
    if (badge) {
        badge.textContent = ev.category;
        badge.className = `badge-event-category ${ev.categoryClass} mb-2 fs-6`;
    }

    const dateEl = document.getElementById("eventDate");
    if (dateEl) dateEl.textContent = ev.date;

    const locEl = document.getElementById("eventLocation");
    if (locEl) locEl.textContent = ev.location;

    const catNameEl = document.getElementById("eventCategoryName");
    if (catNameEl) catNameEl.textContent = `${ev.category} (${ev.categorySlug})`;

    const descEl = document.getElementById("eventDescription");
    if (descEl) descEl.textContent = ev.description;

    // تحديث قسم الفعاليات المقترحة الأخرى
    updateRelatedEvents(ev.id);
}

function updateRelatedEvents(currentId) {
    const relatedContainer = document.getElementById("relatedEventsGrid");
    if (!relatedContainer) return;

    const otherIds = Object.keys(eventsDatabase).filter(id => id !== currentId);
    relatedContainer.innerHTML = "";

    otherIds.forEach(id => {
        const other = eventsDatabase[id];
        const col = document.createElement("div");
        col.className = "col-md-6";
        col.innerHTML = `
            <div class="event-item-card h-100">
                <img src="${other.image}" class="event-card-img" alt="${other.title}">
                <div class="event-card-body">
                    <span class="badge-event-category ${other.categoryClass}">${other.category}</span>
                    <h4 class="event-card-title">${other.title}</h4>
                    <p class="event-card-desc">${other.description.substring(0, 80)}...</p>
                    <ul class="event-card-meta">
                        <li>📅 <strong>التاريخ:</strong> ${other.date}</li>
                        <li>📍 <strong>المكان:</strong> ${other.location.split("-")[0]}</li>
                    </ul>
                    <a href="event.html?id=${other.id}" class="btn btn-outline-custom mt-auto">عرض التفاصيل ←</a>
                </div>
            </div>
        `;
        relatedContainer.appendChild(col);
    });
}

function bindEventPageActions() {
    applyEventFromQueryParam();

    const addToCalendarBtn = document.getElementById("addToCalendarBtn");
    if (addToCalendarBtn) {
        addToCalendarBtn.onclick = downloadEventIcs;
    }

    const shareEventBtn = document.getElementById("shareEventBtn");
    if (shareEventBtn) {
        shareEventBtn.onclick = handleShareEvent;
    }

    const copyUrlBtn = document.getElementById("copyUrlBtn");
    if (copyUrlBtn) {
        copyUrlBtn.onclick = copyEventUrlToClipboard;
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindEventPageActions);
} else {
    bindEventPageActions();
}

