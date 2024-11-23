function updateDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dateDisplay').textContent = currentDate.toLocaleDateString('en-US', options);
}

// Initial call to set the date
updateDate();

setInterval(updateDate, 60 * 1000);