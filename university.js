< script >
    let currentSlide = 0;
const slides = document.querySelectorAll('.university-profile-slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

setInterval(nextSlide, 3000);
showSlide(currentSlide); <
/script> 

<
script >
    function openTab(evt, tabName) {
        var i, tabcontent, tablinks;

        // Hide all tab content
        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Remove active class from all tabs
        tablinks = document.getElementsByClassName("tab");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active-tab-button", "");
        }

        // Show the current tab content and add active class to the clicked tab
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active-tab-button";
    }

// Open the default tab
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementsByClassName("tab")[0].click();
}); <
/script> 

<
script >
    const form = document.getElementById('myForm');
const popup = document.getElementById('popup');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const fullName = document.getElementById('fullName').value;
    const whatsappNumber = document.getElementById('whatsappNumber').value;
    const city = document.getElementById('city').value;
    const destinationCountry = document.getElementById('destinationCountry').value;
    const courseMajor = document.getElementById('courseMajor').value;
    const desiredUniversity = document.getElementById('desiredUniversity').value;

    // Construct the URL for Google Form API
    const formUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSd5PneFjkcSn9jNdbOK4GKIht6Jykjpqcjw67pX-3MAAm3vWg/formResponse';
    const formData = {
        'entry.626892622': fullName,
        'entry.1556513': whatsappNumber,
        'entry.939980113': city,
        'entry.1608380105': destinationCountry,
        'entry.1461495500': courseMajor,
        'entry.2932876': desiredUniversity
    };

    // Send data to Google Form using fetch API
    fetch(formUrl, {
            method: 'POST',
            mode: 'no-cors', // CORS disabled for Google Form
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData).toString()
        })
        .then(response => {
            // Show popup on successful submission
            showPopup();
            // Optionally, reset the form after submission
            form.reset();
        })
        .catch(error => console.error('Error submitting form:', error));
});

function showPopup() {
    popup.style.display = 'block';
}

function closePopup() {
    popup.style.display = 'none';
} <
/script> 

<
script >
    var starshipAcc = document.getElementsByClassName("starship-accordion");
var i;

for (i = 0; i < starshipAcc.length; i++) {
    starshipAcc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
} <
/script>

<
script >
    let currentPage = 1;
const rowsPerPage = 10;
let coursesData = [];
let universityData = [];
let originalCoursesData = []; // Simpan data asli agar bisa dikembalikan setelah filter

async function fetchData() {
    const response = await fetch('https://raw.githubusercontent.com/oktaprasetya/Course/refs/heads/main/Australia/RMIT%20University.json');
    const data = await response.json();

    universityData = {
        universityLogo: data.universityLogo,
        university: data.university
    };

    coursesData = data.courses;
    originalCoursesData = [...data.courses]; // Simpan data asli untuk reset
    displayTable();
    setupPagination();
}

function displayTable() {
    const tbody = document.getElementById('custom_scholarship_tbody');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = coursesData.slice(start, end);

    paginatedData.forEach((item) => {
        const whatsappMessage = encodeURIComponent(`Hi, Saya tertarik dengan jurusan ${item.course} dari ${universityData.university}. Mohon info lebih lanjut.`);
        const whatsappUrl = `https://wa.me/6281514693736?text=${whatsappMessage}`;

        const courseLink = item.link ? `<a href="${item.link}" target="_blank">${item.course}</a>` : item.course;

        const row = document.createElement("tr");
        row.innerHTML = `
                  <td><img src="${universityData.universityLogo}" class="university-logo"></td>
                  <td>${universityData.university}</td>
                  <td>${courseLink}</td>
                  <td>${item.program}</td>
                  <td><button class="table-button konsultasi" onclick="window.location.href='${whatsappUrl}'">Konsultasi</button></td>
                  <td>
                  <button class="table-button daftar" 
                      data-university="${universityData.university}" 
                      data-program="${item.program}" 
                      data-course="${item.course}" 
                      data-duration="${item.duration || 'Not available'}" 
                      data-entryrequirements="${item.entryRequirements || 'Not available'}" 
                      data-fees="${item.fees || 'Not available'}" 
                      data-universitylogo="${universityData.universityLogo}"
                      data-coursedetail="${item.courseDetail || '#'}"
                      data-otherinstitution="${item.otherInstitution || '#'}"
                      data-scholarship="${item.scholarship || '#'}">
                      Apply
                  </button>
              </td>
              `;

        row.querySelector(".daftar").addEventListener("click", function() {
            openPopup(this);
        });

        tbody.appendChild(row);
    });
}

document.getElementById('custom_scholarship_search').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase().trim();
    if (searchQuery === "") {
        coursesData = [...originalCoursesData]; // Kembalikan ke data asli jika kosong
    } else {
        coursesData = originalCoursesData.filter(course =>
            course.course.toLowerCase().includes(searchQuery) ||
            (course.major && course.major.toLowerCase().includes(searchQuery))
        );
    }
    currentPage = 1;
    displayTable();
    setupPagination();
});

function setupPagination() {
    const paginationContainer = document.getElementById('pagination_buttons');
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(coursesData.length / rowsPerPage);

    if (totalPages <= 1) return; // Tidak menampilkan pagination jika hanya satu halaman

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Prev';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayTable();
            setupPagination();
        }
    });
    paginationContainer.appendChild(prevButton);

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);
    if (endPage - startPage < 2) {
        startPage = Math.max(1, endPage - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.toggle('active', currentPage === i);
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayTable();
            setupPagination();
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayTable();
            setupPagination();
        }
    });
    paginationContainer.appendChild(nextButton);
}

document.getElementById('custom_scholarship_search').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    const filteredData = coursesData.filter(course => {
        return course.course.toLowerCase().includes(searchQuery) || (course.major && course.major.toLowerCase().includes(searchQuery));
    });
    currentPage = 1;
    displayTable(filteredData);
});

fetchData();

function openPopup(button) {
    const university = button.getAttribute("data-university");
    const program = button.getAttribute("data-program");
    const course = button.getAttribute("data-course");
    const duration = button.getAttribute("data-duration");
    const entryRequirements = button.getAttribute("data-entryrequirements");
    const fees = button.getAttribute("data-fees");
    const universityLogo = button.getAttribute("data-universitylogo");

    console.log("Popup Data:", {
        university,
        program,
        course,
        duration,
        entryRequirements,
        fees,
        universityLogo
    });

    document.getElementById('courseTitle').innerText = course;
    document.getElementById('entryRequirements').innerText = entryRequirements;
    document.getElementById('courseDuration').innerText = duration;
    document.getElementById('courseFees').innerText = fees;

    document.getElementById('universityInput').value = university;
    document.getElementById('programInput').value = program;
    document.getElementById('courseInput').value = course;

    document.getElementById('universityLogoPopup').src = universityLogo;

    document.getElementById('courseDetailBtn').href = button.getAttribute("data-coursedetail") || "#";
    document.getElementById('otherInstitutionBtn').href = button.getAttribute("data-otherinstitution") || "#";
    document.getElementById('scholarshipBtn').href = button.getAttribute("data-scholarship") || "#";


    document.getElementById('popup').style.display = 'block';
    document.querySelector('.popup-content').scrollTop = 0;
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

fetchData();

<
/script>

<
script >

    document.getElementById('custom_scholarship_search').addEventListener('input', function() {
        const searchQuery = this.value.toLowerCase();
        const filteredData = coursesData.filter(course => {
            return course.course.toLowerCase().includes(searchQuery) || course.major.toLowerCase().includes(searchQuery);
        });
        currentPage = 1; // Reset halaman ke 1 saat filter diterapkan
        coursesData = filteredData; // Update data kursus dengan hasil filter
        displayTable();
        setupPagination();
    });

<
/script>

<
script >
    function toggleDropdown() {
        document.getElementById("dropdownForm").classList.toggle("active");
    } <
    /script>

    <
    script >
    document.getElementById("ieltsTest").addEventListener("change", function() {
        const ieltsFields = document.getElementById("ieltsFields");
        if (this.value === "Yes") {
            ieltsFields.style.display = "block";
        } else {
            ieltsFields.style.display = "none";
            // Reset IELTS scores if hidden
            document.getElementById("listeningScore").value = "";
            document.getElementById("readingScore").value = "";
            document.getElementById("writingScore").value = "";
            document.getElementById("speakingScore").value = "";
            document.getElementById("overallScore").value = "";
        }
    });

function submitForm() {
    const formData = new FormData();
    formData.append('university', document.getElementById('universityInput').value);
    formData.append('program', document.getElementById('programInput').value);
    formData.append('course', document.getElementById('courseInput').value);
    formData.append('fullName', document.getElementById('fullName').value);
    formData.append('whatsappNumber', document.getElementById('whatsappNumber').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('address', document.getElementById('address').value);
    formData.append('school', document.getElementById('school').value);
    formData.append('graduationYear', document.getElementById('graduationYear').value);
    formData.append('ieltsTest', document.getElementById('ieltsTest').value);
    formData.append('listeningScore', document.getElementById('listeningScore').value || '');
    formData.append('readingScore', document.getElementById('readingScore').value || '');
    formData.append('writingScore', document.getElementById('writingScore').value || '');
    formData.append('speakingScore', document.getElementById('speakingScore').value || '');
    formData.append('overallScore', document.getElementById('overallScore').value || '');

    fetch('https://script.google.com/macros/s/AKfycbxcdLutm2NlnX3sCUywqTLMM_A7nobJoAypUCeES87vCma-x8A6FElt8VoSH_X69Ih9rQ/exec', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                alert('Application submitted successfully!');
                document.getElementById("applicationForm").reset(); // Reset form setelah submit
                closePopup();
            } else {
                alert('Failed to submit application. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting application. Check console for details.');
        });
}

<
/script> 

<
script >
    // JavaScript Instance 2
    const instance2 = {
        API_KEY: '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',
        API_URL: 'https://openrouter.ai/api/v1/chat/completions',

        scholarships: [],
        currentPage: 1,
        ITEMS_PER_PAGE: 5,
        selectedScholarship: null,
        selectedUniversity: null,

        init: async function() {
            try {
                this.showLoading();
                const response = await fetch('https://raw.githubusercontent.com/oktaprasetya/Scholarship/refs/heads/main/Australia/The%20University%20of%20Sydney.json');

                if (!response.ok) throw new Error(`HTTP error ${response.status}`);

                const data = await response.json();
                if (!Array.isArray(data)) throw new Error('Format data tidak valid');

                this.scholarships = data;
                this.renderTable();
                this.setupPagination();
                this.setupSearch();

            } catch (error) {
                this.showError(`Gagal memuat data: ${error.message}`);
            } finally {
                this.hideLoading();
            }
        },

        renderTable: function() {
            const start = (this.currentPage - 1) * this.ITEMS_PER_PAGE;
            const end = start + this.ITEMS_PER_PAGE;
            const tbody = document.getElementById('tableBody2');

            tbody.innerHTML = this.scholarships.slice(start, end).map(item => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <img src="${item.universityLogo}" alt="Logo" style="width: 100px; height: auto;">
                        ${item.university}
                    </div>
                </td>
                <td>${item.course}</td>
                <td>
                    <button class="scholarship-table__detail-button-2" 
                        onclick="instance2.showDetail('${item.course.replace(/'/g, "\\'")}', '${item.university.replace(/'/g, "\\'")}')"
                        data-university="${item.university}">
                        Detail
                    </button>
                </td>
            </tr>
        `).join('');
        },

        showDetail: async function(name, university) {
            this.selectedScholarship = name;
            this.selectedUniversity = university;

            const overlay = document.getElementById('popupOverlay2');
            const content = document.getElementById('popupContent2');
            const errorDiv = document.getElementById('popupError2');

            overlay.style.display = 'block';
            content.style.display = 'none';
            errorDiv.style.display = 'none';
            document.getElementById('popupLoading2').style.display = 'block';

            try {
                const item = this.scholarships.find(s => s.course === name);
                const details = await this.fetchDetails(name);

                if (details.isExpired) {
                    errorDiv.innerHTML = `
                    <div style="color: var(--error-2); margin-bottom: 1rem;">
                        Beasiswa ini sudah tidak dibuka, silahkan mencari pilihan beasiswa lain 
                        atau hubungi Starship Education untuk bantuan
                    </div>
                    <button class="scholarship-table__detail-button-2" 
                        onclick="instance2.sendWhatsApp()"
                        style="width: 100%; margin-top: 1rem;">
                        📞 Hubungi via WhatsApp
                    </button>
                `;
                    errorDiv.style.display = 'block';
                    content.style.display = 'none';
                    return;
                }

                document.getElementById('popupTitle2').textContent = name;
                document.getElementById('popupDeadline2').textContent = details.deadline;
                document.getElementById('popupEligibility2').textContent = details.eligibility;
                document.getElementById('popupRequirements2').innerHTML =
                    details.requirements.map(r => `<li>${r}</li>`).join('');
                document.getElementById('popupBenefits2').innerHTML =
                    details.benefits.map(b => `<li>${b}</li>`).join('');

                if (details.isEligible === false) {
                    errorDiv.textContent = '⚠️ Tidak tersedia untuk mahasiswa Indonesia';
                    errorDiv.style.display = 'block';
                }

                content.style.display = 'block';

            } catch (error) {
                errorDiv.textContent = `Error: ${error.message}`;
                errorDiv.style.display = 'block';
            } finally {
                document.getElementById('popupLoading2').style.display = 'none';
            }
        },

        fetchDetails: async function(name) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch(this.API_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.API_KEY}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.href,
                        'X-Title': 'Scholarship Finder'
                    },
                    body: JSON.stringify({
                        model: 'mistralai/mistral-7b-instruct',
                        messages: [{
                            role: 'user',
                            content: `Berikan detail beasiswa "${name}" dengan informasi yang tersedia di tahun ${new Date().getFullYear()}, Sesuaikan informasinya untuk siswa/mahasiswa dari Indonesia. Tulis dalam format JSON: {
                            "deadline": "YYYY-MM-DD",
                            "eligibility": "string",
                            "requirements": ["string"],
                            "benefits": ["string"],
                            "isEligibleForIndonesians": boolean
                        }. Hanya kembalikan JSON!`
                        }],
                        temperature: 0.3,
                        max_tokens: 1000
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API Error: ${JSON.stringify(errorData)}`);
                }

                const data = await response.json();
                const rawJSON = data.choices[0].message.content
                    .replace(/```json/g, '')
                    .replace(/```/g, '')
                    .trim();

                const result = JSON.parse(rawJSON);

                // Check expiration
                const deadlineDate = new Date(result.deadline);
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

                let isExpired = false;
                if (!isNaN(deadlineDate)) {
                    deadlineDate.setHours(0, 0, 0, 0);
                    isExpired = deadlineDate < currentDate;
                } else {
                    isExpired = true;
                }

                return {
                    deadline: this.formatDate(result.deadline),
                    eligibility: result.eligibility || 'Tidak tersedia',
                    requirements: result.requirements || ['Belum ada informasi'],
                    benefits: result.benefits || ['Belum ada informasi'],
                    isEligible: result.isEligibleForIndonesians ?? null,
                    isExpired: isExpired
                };

            } catch (error) {
                console.error('Fetch Error:', error);
                throw new Error('Gagal memuat detail beasiswa');
            }
        },

        formatDate: function(dateString) {
            try {
                const date = new Date(dateString);
                return isNaN(date) ? 'Tanggal tidak valid' :
                    date.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
            } catch {
                return 'Format tanggal salah';
            }
        },

        setupPagination: function() {
            const pages = Math.ceil(this.scholarships.length / this.ITEMS_PER_PAGE);
            const pagination = document.getElementById('pagination2');

            let startPage = 1;
            let endPage = pages;

            if (pages > 3) {
                if (this.currentPage <= 2) {
                    endPage = 3;
                } else if (this.currentPage >= pages - 1) {
                    startPage = pages - 2;
                } else {
                    startPage = this.currentPage - 1;
                    endPage = this.currentPage + 1;
                }
            }

            let buttons = [];
            buttons.push(`
            <button class="pagination__button-2" 
                ${this.currentPage === 1 ? 'disabled' : ''} 
                onclick="instance2.changePage(${this.currentPage - 1})">
                &laquo;
            </button>
        `);

            for (let i = startPage; i <= endPage; i++) {
                buttons.push(`
                <button class="pagination__button-2 ${i === this.currentPage ? 'pagination__button--active-2' : ''}" 
                    onclick="instance2.changePage(${i})">
                    ${i}
                </button>
            `);
            }

            buttons.push(`
            <button class="pagination__button-2" 
                ${this.currentPage === pages ? 'disabled' : ''} 
                onclick="instance2.changePage(${this.currentPage + 1})">
                &raquo;
            </button>
        `);

            pagination.innerHTML = buttons.join('');
        },

        changePage: function(page) {
            this.currentPage = page;
            this.renderTable();
            this.setupPagination();
        },

        setupSearch: function() {
            const input = document.getElementById('searchInput2');
            input.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                this.scholarships = this.scholarships.filter(s =>
                    s.course.toLowerCase().includes(term) ||
                    s.university.toLowerCase().includes(term)
                );
                this.currentPage = 1;
                this.renderTable();
                this.setupPagination();
            });
        },

        closePopup: function() {
            document.getElementById('popupOverlay2').style.display = 'none';
        },

        showLoading: function() {
            document.getElementById('tableBody2').innerHTML = `
            <tr>
                <td colspan="4" class="loading-2">Memuat data...</td>
            </tr>
        `;
        },

        hideLoading: function() {
            const loadingElem = document.querySelector('.loading-2');
            if (loadingElem) loadingElem.style.display = 'none';
        },

        showError: function(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-2';
            errorDiv.innerHTML = `
            ${message}
            <button onclick="instance2.init()" style="margin-left: 1rem; padding: 0.5rem 1rem; background: #dc2626; color: white; border: none; border-radius: 0.5rem;">
                Coba Lagi
            </button>
        `;
            document.body.prepend(errorDiv);
        },

        sendWhatsApp: function() {
            const message = encodeURIComponent(
                `Hi, saya tertarik untuk mendaftar beasiswa ${this.selectedScholarship} di ${this.selectedUniversity}. Mohon informasi lebih lanjut.`
            );
            window.open(`https://wa.me/6281514693736?text=${message}`, '_blank');
        }
    };

instance2.init(); <
/script>

<
script >
    function openNav() {
        document.getElementById("mySidenav").style.width = "100%";
    }

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function toggleSubmenu(element) {
    var submenu = element.nextElementSibling;
    var icon = element.querySelector("i");
    if (submenu.style.display === "block") {
        submenu.style.display = "none";
        icon.classList.remove("fa-angle-up");
        icon.classList.add("fa-angle-down");
    } else {
        submenu.style.display = "block";
        icon.classList.remove("fa-angle-down");
        icon.classList.add("fa-angle-up");
    }
}

function toggleSubSubmenu(element) {
    var submenu = element.nextElementSibling;
    var icon = element.querySelector("i");
    if (submenu.style.display === "block") {
        submenu.style.display = "none";
        icon.classList.remove("fa-angle-up");
        icon.classList.add("fa-angle-down");
    } else {
        submenu.style.display = "block";
        icon.classList.remove("fa-angle-down");
        icon.classList.add("fa-angle-up");
    }
} <
/script> 

<
script >
    let currentSlide = 0;
const slides = document.querySelectorAll('.university-profile-slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

setInterval(nextSlide, 3000);
showSlide(currentSlide); <
/script>
