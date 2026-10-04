import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // =========================
  // INTRO ANIMATION
  // =========================

  if (showIntro) {
    return (
      <div className="intro-screen">
        <div className="intro-content">

          <div className="logo-wrapper">
            <div className="logo-glow"></div>

            <div className="logo-ring"></div>

            <div className="logo-icon">
              ₹
            </div>
          </div>

          <div className="brand">
            <h1>FinTrack</h1>
            <p>Track. Save. Grow.</p>
          </div>

        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="dashboard">

      {/* =========================
          SIDEBAR
          ========================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="small-logo">₹</div>
          <span>FinTrack</span>
        </div>

        <nav>

          <button
            className={`nav-item ${
              activePage === "Dashboard" ? "active" : ""
            }`}
            onClick={() => setActivePage("Dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={`nav-item ${
              activePage === "Transactions" ? "active" : ""
            }`}
            onClick={() => setActivePage("Transactions")}
          >
            <span>↔</span>
            Transactions
          </button>

          <button
            className={`nav-item ${
              activePage === "Budgets" ? "active" : ""
            }`}
            onClick={() => setActivePage("Budgets")}
          >
            <span>◫</span>
            Budgets
          </button>

          <button
            className={`nav-item ${
              activePage === "Analytics" ? "active" : ""
            }`}
            onClick={() => setActivePage("Analytics")}
          >
            <span>◒</span>
            Analytics
          </button>

          <button
            className={`nav-item ${
              activePage === "Settings" ? "active" : ""
            }`}
            onClick={() => setActivePage("Settings")}
          >
            <span>⚙</span>
            Settings
          </button>

        </nav>

      </aside>


      {/* =========================
          MAIN CONTENT
          ========================= */}

      <main className="main-content">

        <header className="topbar">

          <div>
            <p className="welcome">
              
            </p>

            <h1>
              {activePage}
            </h1>
          </div>

          <div className="profile">

            <div className="profile-avatar">
              P
            </div>

            <span>
              Pratik
            </span>

          </div>

        </header>


        {/* =========================
            DASHBOARD CONTENT
            ========================= */}

        {activePage === "Dashboard" && (
          <>
            {/* Summary Cards */}

            <section className="summary-cards">

              <div className="card">
                <p>Total Balance</p>

                <h2>₹84,250</h2>

                <span className="positive">
                  +8.2%
                </span>
              </div>


              <div className="card">
                <p>Total Income</p>

                <h2>₹65,000</h2>

                <span className="positive">
                  +12.5%
                </span>
              </div>


              <div className="card">
                <p>Total Expenses</p>

                <h2>₹32,450</h2>

                <span className="negative">
                  +4.8%
                </span>
              </div>


              <div className="card">
                <p>Savings</p>

                <h2>₹32,550</h2>

                <span className="positive">
                  +15.3%
                </span>
              </div>

            </section>


            {/* Spending + Budgets */}

            <section className="content-grid">

              {/* Spending */}

              <div className="panel spending-panel">

                <div className="panel-header">

                  <h2>
                    Spending Overview
                  </h2>

                  <select>
                    <option>
                      This Month
                    </option>

                    <option>
                      Last Month
                    </option>

                    <option>
                      This Year
                    </option>
                  </select>

                </div>


                <div className="chart-placeholder">

                  <div className="bar bar1"></div>
                  <div className="bar bar2"></div>
                  <div className="bar bar3"></div>
                  <div className="bar bar4"></div>
                  <div className="bar bar5"></div>
                  <div className="bar bar6"></div>
                  <div className="bar bar7"></div>

                </div>

              </div>


              {/* Budgets */}

              <div className="panel">

                <div className="panel-header">

                  <h2>
                    Budgets
                  </h2>

                  <span>
                    View all
                  </span>

                </div>


                <div className="budget">

                  <div>
                    <span>
                      Food
                    </span>

                    <strong>
                      ₹3,500 / ₹5,000
                    </strong>
                  </div>

                  <div className="progress">
                    <div className="progress-fill food"></div>
                  </div>

                </div>


                <div className="budget">

                  <div>
                    <span>
                      Travel
                    </span>

                    <strong>
                      ₹2,000 / ₹5,000
                    </strong>
                  </div>

                  <div className="progress">
                    <div className="progress-fill travel"></div>
                  </div>

                </div>


                <div className="budget">

                  <div>
                    <span>
                      Shopping
                    </span>

                    <strong>
                      ₹4,000 / ₹6,000
                    </strong>
                  </div>

                  <div className="progress">
                    <div className="progress-fill shopping"></div>
                  </div>

                </div>

              </div>

            </section>


            {/* Recent Transactions */}

            <section className="panel transactions">

              <div className="panel-header">

                <h2>
                  Recent Transactions
                </h2>

                <span>
                  View all
                </span>

              </div>


              <div className="transaction">

                <div className="transaction-icon">
                  🍔
                </div>

                <div>
                  <strong>
                    Food & Dining
                  </strong>

                  <p>
                    Today • 1:30 PM
                  </p>
                </div>

                <strong className="negative">
                  -₹500
                </strong>

              </div>


              <div className="transaction">

                <div className="transaction-icon">
                  💼
                </div>

                <div>
                  <strong>
                    Salary
                  </strong>

                  <p>
                    Yesterday
                  </p>
                </div>

                <strong className="positive">
                  +₹50,000
                </strong>

              </div>


              <div className="transaction">

                <div className="transaction-icon">
                  🛍️
                </div>

                <div>
                  <strong>
                    Shopping
                  </strong>

                  <p>
                    Sep 28 • 5:20 PM
                  </p>
                </div>

                <strong className="negative">
                  -₹2,400
                </strong>

              </div>

            </section>
          </>
        )}


        {/* =========================
            OTHER PAGES
            ========================= */}

        {activePage !== "Dashboard" && (
          <section className="panel page-placeholder">

            <h2>
              {activePage}
            </h2>

            <p>
              This section will be built next.
            </p>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;