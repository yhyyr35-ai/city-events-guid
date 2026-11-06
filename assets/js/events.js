"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const locationFilter = document.getElementById("locationFilter");
    const dateFilter = document.getElementById("dateFilter");
    const resetFiltersBtn = document.getElementById("resetFiltersBtn");
    const eventItems = document.querySelectorAll(".event-item");
    const noEventsAlert = document.getElementById("noEventsAlert");
    const eventsCountBadge = document.getElementById("eventsCountBadge");

    function filterEvents() {
        const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const selectedCategory = categoryFilter ? categoryFilter.value : "all";
        const selectedLocation = locationFilter ? locationFilter.value : "all";
        const selectedDate = dateFilter ? dateFilter.value : "";

        let visibleCount = 0;

        eventItems.forEach(item => {
            const titleEl = item.querySelector(".event-card-title") || item.querySelector(".card-title");
            const title = titleEl ? titleEl.textContent.toLowerCase() : "";
            const category = item.getAttribute("data-category") || "";
            const location = item.getAttribute("data-location") || "";
            const date = item.getAttribute("data-date") || "";

            const matchesSearch = !searchValue || title.includes(searchValue);
            const matchesCategory = (selectedCategory === "all" || category === selectedCategory);
            const matchesLocation = (selectedLocation === "all" || location === selectedLocation);
            const matchesDate = (!selectedDate || date === selectedDate);

            if (matchesSearch && matchesCategory && matchesLocation && matchesDate) {
                item.style.display = "";
                visibleCount++;
            } else {
                item.style.display = "none";
            }
        });

        if (noEventsAlert) {
            noEventsAlert.style.display = (visibleCount === 0) ? "block" : "none";
        }

        if (eventsCountBadge) {
            eventsCountBadge.textContent = `${visibleCount} من ${eventItems.length} فعالية`;
        }
    }

    if (searchInput) searchInput.addEventListener("input", filterEvents);
    if (categoryFilter) categoryFilter.addEventListener("change", filterEvents);
    if (locationFilter) locationFilter.addEventListener("change", filterEvents);
    if (dateFilter) dateFilter.addEventListener("change", filterEvents);

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener("click", function () {
            if (searchInput) searchInput.value = "";
            if (categoryFilter) categoryFilter.value = "all";
            if (locationFilter) locationFilter.value = "all";
            if (dateFilter) dateFilter.value = "";
            filterEvents();
        });
    }

    // تشغيل الفلترة الابتدائية لتحديث العداد
    filterEvents();
});

