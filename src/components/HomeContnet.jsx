import React from "react";
import "./homestyles.css";

const HomeContnet = () => {
  return (
    <>
      <div>
        <section className="hero">
          <div className="hero-content">
            <h1>
              Next Generation <br />
              <span>AI Chat Experience</span>
            </h1>
            <p>
              Discover the power of advanced AI models in one place. Chat,
              create, and collaborate with PopGPT's cutting-edge artificial
              intelligence.
            </p>
            <div className="hero-buttons">
              <a href="chat.html" className="primary-button">
                Try For Free
              </a>
              <a href="#models" className="secondary-button">
                Explore Models
              </a>
            </div>
          </div>
          <div className="hero-image">
            <svg
              width={500}
              height={500}
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx={250}
                cy={250}
                r={200}
                fill="url(#gradient)"
                opacity="0.8"
              />
              <path
                d="M180 180L320 320M180 320L320 180"
                stroke="#FFFFFF"
                strokeWidth={15}
                strokeLinecap="round"
              />
              <circle
                cx={250}
                cy={250}
                r={70}
                stroke="#FFFFFF"
                strokeWidth={15}
                fill="transparent"
              />
              <circle
                cx={250}
                cy={250}
                r={120}
                stroke="#FFFFFF"
                strokeWidth={10}
                strokeDasharray="20 20"
                fill="transparent"
              />
              <defs>
                <radialGradient
                  id="gradient"
                  cx={0}
                  cy={0}
                  r={1}
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(250 250) rotate(90) scale(200)"
                >
                  <stop offset="0%" stopColor="#FFA97A" />
                  <stop offset="100%" stopColor="#111A21" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </section>
        <section className="features" id="features">
          <h2>
            Why Choose <span>PopGPT</span>
          </h2>
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">
                <svg
                  width={40}
                  height={40}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1={12} y1={22} x2={12} y2={12} />
                </svg>
              </div>
              <h3>Multiple AI Models</h3>
              <p>
                Access a wide range of advanced AI models including GPT-4,
                GPT-3.5, and more specialized versions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg
                  width={40}
                  height={40}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 10h-4V6" />
                  <path d="M22 10h-4" />
                  <path d="M6 6h4v4H6z" />
                  <path d="M2 10h4" />
                  <path d="M6 18h4v-4H6z" />
                  <path d="M2 14h4" />
                  <path d="M18 18h-4v-4" />
                  <path d="M22 14h-4" />
                </svg>
              </div>
              <h3>Context Retention</h3>
              <p>
                Our AI remembers your conversation history, providing more
                coherent and contextually relevant responses.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg
                  width={40}
                  height={40}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <polyline points="23 20 23 14 17 14" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
              </div>
              <h3>Conversation History</h3>
              <p>
                Easily access, manage, and revisit your past conversations with
                our intuitive history management.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg
                  width={40}
                  height={40}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x={2} y={7} width={20} height={14} rx={2} ry={2} />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3>File Sharing</h3>
              <p>
                Share images and PDFs directly in your conversations for more
                interactive and productive AI assistance.
              </p>
            </div>
          </div>
        </section>
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to experience the future of AI?</h2>
            <p>
              Join thousands of users already enhancing their productivity with
              PopGPT.
            </p>
            <a href="chat.html" className="cta-button">
              Get Started - It's Free
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomeContnet;
