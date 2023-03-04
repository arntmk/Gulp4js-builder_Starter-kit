'use strict';
/* ____________________________________________ */
// Footer getFullYear
const year = document.getElementById('year');
const thisYear = new Date().getFullYear();
year.setAttribute('datetime', thisYear);
year.textContent = thisYear;
