// Router
function loadPage(page) {
  fetch(`views/${page}.html`)
    .then(response => response.text())
    .then(html => {
      document.getElementById('content').innerHTML = html;
      if (page === 'timeclock') initTimeClock();
      if (page === 'leave') initLeaveManagement();
    });
}

// Login functionality
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const employeeId = document.getElementById('employeeId').value;
  const password = document.getElementById('password').value;
  
  try {
    // Replace with actual API call
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('employee', JSON.stringify(data));
      renderDashboard();
    } else {
      alert('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
});

// Dashboard rendering
function renderDashboard() {
  const employee = JSON.parse(localStorage.getItem('employee'));
  document.getElementById('app').innerHTML = document.getElementById('dashboard-template').innerHTML;
  document.getElementById('employeeName').textContent = employee.name;
  loadPage('timeclock');
  
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadPage(btn.dataset.page);
    });
  });
  
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('employee');
    location.reload();
  });
}

// Time Clock
function initTimeClock() {
  document.getElementById('content').innerHTML = `
    <div class="time-clock">
      <h2>Time Clock</h2>
      <div class="status" id="clockStatus">You are currently clocked out</div>
      <button id="clockBtn">Clock In</button>
      <div class="history">
        <h3>Today's Activity</h3>
        <ul id="activityList"></ul>
      </div>
    </div>
  `;
  
  // Clock in/out logic
  document.getElementById('clockBtn').addEventListener('click', async () => {
    const employee = JSON.parse(localStorage.getItem('employee'));
    const isClockedIn = document.getElementById('clockBtn').textContent === 'Clock Out';
    
    try {
      const response = await fetch('/api/timeclock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          employeeId: employee.id,
          action: isClockedIn ? 'clock-out' : 'clock-in' 
        })
      });
      
      if (response.ok) {
        document.getElementById('clockBtn').textContent = isClockedIn ? 'Clock In' : 'Clock Out';
        document.getElementById('clockStatus').textContent = 
          `You are currently clocked ${isClockedIn ? 'out' : 'in'}`;
        loadActivity();
      }
    } catch (error) {
      console.error('Time clock error:', error);
    }
  });
  
  function loadActivity() {
    // Load activity history
  }
}

// Leave Management
function initLeaveManagement() {
  document.getElementById('content').innerHTML = `
    <div class="leave-management">
      <h2>Leave Management</h2>
      <div class="balance">
        <h3>Your Balances</h3>
        <div>Vacation: <span id="vacationBalance">10</span> days</div>
        <div>Sick Leave: <span id="sickBalance">5</span> days</div>
      </div>
      
      <form id="leaveRequestForm">
        <h3>Request Leave</h3>
        <div class="form-group">
          <label for="leaveType">Leave Type</label>
          <select id="leaveType" required>
            <option value="vacation">Vacation</option>
            <option value="sick">Sick Leave</option>
          </select>
        </div>
        <div class="form-group">
          <label for="startDate">Start Date</label>
          <input type="date" id="startDate" required>
        </div>
        <div class="form-group">
          <label for="endDate">End Date</label>
          <input type="date" id="endDate" required>
        </div>
        <button type="submit">Submit Request</button>
      </form>
      
      <div class="requests">
        <h3>Your Requests</h3>
        <table id="requestsTable">
          <thead>
            <tr>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;
  
  document.getElementById('leaveRequestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const employee = JSON.parse(localStorage.getItem('employee'));
    const formData = {
      employeeId: employee.id,
      type: document.getElementById('leaveType').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value
    };
    
    try {
      const response = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Leave request submitted');
        loadLeaveRequests();
      }
    } catch (error) {
      console.error('Leave request error:', error);
    }
  });
  
  function loadLeaveRequests() {
    // Load leave requests
  }
}

// Initial load
if (localStorage.getItem('employee')) {
  renderDashboard();
} else {
  document.getElementById('app').innerHTML = document.getElementById('login-template').innerHTML;
}