updateTime();
updateDate();
updateLocation();

setInterval(updateTime, 1000);
setInterval(updateDate, 1000);

function updateDate() {
    const now = new Date();
    const dateSpan = document.getElementById("date");
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const currentDate = `${year}-${month}-${day}`;
    dateSpan.textContent = currentDate;
}

function updateTime() {
    const now = new Date();
    const timeSpan = document.getElementById("time");
    const hour = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const sec = String(now.getSeconds()).padStart(2, "0");
    const currentTime = `${hour}:${min}:${sec}`;
    timeSpan.textContent = currentTime;
}

function updateLocation() {
    const locSpan = document.getElementById("location");
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude.toFixed(4);
                const lon = position.coords.longitude.toFixed(4);
                getPlaceName(lat, lon, locSpan);
            },
            function () {
                locSpan.textContent = "Location unavailable";
            }
        );
    } else {
        locSpan.textContent = "Geolocation not supported";
    }
}

function getPlaceName(lat, lon, element) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || "";
            const country = data.address.country || "";
            element.textContent = city ? `${city}, ${country}` : country || "Unknown location";
        })
        .catch(() => {
            element.textContent = "Place name unavailable";
        });
}