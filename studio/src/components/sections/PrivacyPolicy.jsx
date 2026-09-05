"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { getPrivacyStyles } from "@/utils/themeSwatch";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const PrivacyPolicy = ({ isMobile = false, styles = {} }) => {
  const { theme } = useTheme();
  const themeStyles = getPrivacyStyles;

  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`w-full transition-colors duration-500 text-justify ${currentTheme.bg} ${styles.section || ""} ${isMobile ? "" : "p-10 px-6"}`}>
      <div className="max-w-8xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={isMobile ? "mb-5" : "mb-5"}>
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase leading-none tracking-[-0.15em] transition-colors duration-500 ${currentTheme.textPrimary}`}>
            Privacy Policy
          </h1>

          <p
            className={`text-xs uppercase tracking-normal mt-3 transition-colors duration-500 ${styles.textMuted || currentTheme.textSubtle}`}>
            Legal & Data Governance • Last updated: August 24, 2026
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`text-md md:text-md font-light leading-relaxed border-t pt-4 transition-colors duration-500 ${styles.textSecondary || currentTheme.textSecondary} ${styles.dividerSoft || currentTheme.borderSoft}`}>
          This Privacy Policy explains what information this portfolio website collects, why it is collected, how it is
          stored, the services that may process that information, and the choices available to you when using the
          website.
        </motion.p>

        <div
          className={`mt-6 space-y-12 text-sm leading-relaxed font-sans transition-colors duration-500 ${currentTheme.textSecondary}`}>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}>
            <h2
              className={`mb-6 text-sm font-bold uppercase tracking-wide border-b pb-2 flex justify-between items-baseline w-full transition-colors duration-500 ${styles.dividerHeavy || `${currentTheme.borderHeavy} ${currentTheme.textPrimary}`}`}>
              <span>01. Definitions</span>
              <span className={`text-[10px] font-normal tracking-normal capitalize ${currentTheme.textSubtle}`}>
                Key Terms
              </span>
            </h2>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 pt-2">
              <li className={`border-b pb-2 transition-colors duration-500 ${currentTheme.borderSoft}`}>
                <strong
                  className={`text-sm uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Website Owner
                </strong>
                <span
                  className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  Refers to the individual who operates and maintains this portfolio website (&quot;We&quot;,
                  &quot;Us&quot;, or &quot;Our&quot;).
                </span>
              </li>

              <li className={`border-b pb-2 transition-colors duration-500 ${currentTheme.borderSoft}`}>
                <strong
                  className={`text-sm uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Browser Storage
                </strong>
                <span
                  className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  Includes localStorage and sessionStorage used by your browser to retain preferences, rendering state,
                  and temporary application data.
                </span>
              </li>

              <li className={`border-b pb-2 transition-colors duration-500 ${currentTheme.borderSoft}`}>
                <strong
                  className={`text-sm uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Personal Data
                </strong>
                <span
                  className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  Information relating to an identified or identifiable individual, including information voluntarily
                  submitted through contact or project inquiry forms.
                </span>
              </li>

              <li className={`border-b pb-2 transition-colors duration-500 ${currentTheme.borderSoft}`}>
                <strong
                  className={`text-sm uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Location Data
                </strong>
                <span
                  className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  Geographic information used only to determine weather and visual scene settings when you choose a
                  location-based experience.
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}>
            <h2
              className={`mb-6 text-sm font-bold uppercase tracking-wide border-b pb-2 flex justify-between items-baseline w-full transition-colors duration-500 ${styles.dividerHeavy || `${currentTheme.borderHeavy} ${currentTheme.textPrimary}`}`}>
              <span>02. Data Collection & Usage</span>
            </h2>

            <div className="space-y-8">
              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Contact & Project Information
                </h3>
                <p className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  When you submit a contact form, the website may collect the information you voluntarily provide in
                  order to respond to your inquiry. A simple &quot;Say Hi&quot; submission may include your name, email
                  address, and message. A &quot;Build a Project&quot; submission may additionally include your
                  organization, role, requested development service model, project budget, project deadline, and project
                  details.
                </p>
                <p
                  className={`text-sm mt-3 transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  Submitted information is transmitted to our backend services and stored in our database so that the
                  inquiry can be reviewed and responded to.
                </p>
              </div>

              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  System Performance & Rendering Tier
                </h3>
                <p
                  className={`text-sm mb-3 transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  When the application initially loads, it evaluates performance characteristics of your device and
                  browser, including rendering performance and frame rate where applicable. These measurements are used
                  to provide a smoother visual experience for devices with different capabilities.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                    <span
                      className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                      Performance Tiers
                    </span>
                    <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                      The application uses the resulting performance score to classify the device into a local rendering
                      tier. Scores below 50 are categorized as{" "}
                      <code className={`text-[11px] font-mono ${currentTheme.codeText}`}>tier_2</code> and higher scores
                      are categorized as{" "}
                      <code className={`text-[11px] font-mono ${currentTheme.codeText}`}>tier_1</code>. This
                      classification is used to select an appropriate rendering quality and is stored locally in your
                      browser.
                    </p>
                  </div>

                  <div
                    className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                    <span
                      className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                      Local Performance Data
                    </span>
                    <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                      Performance measurements and the resulting rendering tier are intended for local performance
                      decisions and are not submitted to our backend database as personal profile information.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Location & Weather Data
                </h3>
                <p
                  className={`text-sm mb-3 transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  After the initial performance check, you may be asked how you want location-based weather information
                  to be handled. You can choose Accurate Location, Fast Location, or Deny.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                    <span
                      className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                      Accurate Location
                    </span>
                    <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                      If you grant browser location permission, the website may receive your latitude and longitude.
                      These coordinates are used to request weather information and determine the visual environment
                      shown in the hero scene.
                    </p>
                  </div>

                  <div
                    className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                    <span
                      className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                      Fast Location
                    </span>
                    <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                      If you choose Fast Location, the website may use{" "}
                      <code className={`text-[11px] font-mono ${currentTheme.codeText}`}>ipapi.co</code> to estimate
                      your approximate location from your IP address. This information is then used to determine weather
                      and the corresponding visual scene.
                    </p>
                  </div>

                  <div
                    className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                    <span
                      className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                      Deny
                    </span>
                    <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                      If you deny both location options, no location-based scene is selected and the website uses its
                      default visual environment instead.
                    </p>
                  </div>
                </div>

                <p
                  className={`text-sm mt-4 transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  Weather information is obtained from Open-Meteo using the selected location information. Location data
                  is used for this visual/weather functionality and is not intentionally stored in our backend database
                  as a contact profile.
                </p>
              </div>

              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Browser Storage & Preferences
                </h3>
                <p
                  className={`text-sm mb-4 transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  The website uses browser storage to preserve local preferences, improve performance, reduce repeated
                  network requests, and maintain the state of certain visual features.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                    <span
                      className={`text-sm font-bold uppercase tracking-wider block mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                      localStorage
                    </span>
                    <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                      Depending on the features you use, localStorage may contain the selected rendering tier, selected
                      location preference, weather/scene background information, cloud configuration, site theme, intro
                      completion state, performance-related banner state, and cached GitHub GraphQL data used by the
                      Work section.
                    </p>
                  </div>

                  <div
                    className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                    <span
                      className={`text-sm font-bold uppercase tracking-wider block mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                      sessionStorage
                    </span>
                    <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                      sessionStorage may temporarily cache portfolio data retrieved from our backend or related APIs,
                      including achievements, education, trail data, work data, experience data, and project-related
                      data. This data is intended to remain available for the current browser session and is not
                      intended as a permanent user profile.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Portfolio & External API Data
                </h3>
                <p className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  The portfolio periodically requests application content such as achievements, education, trail data,
                  work data, experience data, project data, and related portfolio information from backend or external
                  services. This information is used to render the website and is cached in browser storage where
                  applicable to reduce repeated requests.
                </p>
                <p
                  className={`text-sm mt-3 transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  The Work section may also request information from the GitHub GraphQL API. Certain returned
                  GitHub-related data may be cached in localStorage to improve page performance.
                </p>
              </div>

              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Interface & Visual Preferences
                </h3>
                <p className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  The website may store local interface state, including whether the introductory scene has already
                  completed, whether a performance-related notice has already been shown, your selected visual theme,
                  and your selected weather/scene preference. These values are stored in your browser to avoid
                  repeatedly showing or recalculating the same interface state.
                </p>
              </div>

              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Analytics & Tag Management
                </h3>
                <p className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  The website may use Google Analytics and Google Tag Manager to understand website usage, such as page
                  interactions, traffic patterns, device or browser information, and general performance metrics. Where
                  consent controls are provided, analytics and non-essential tracking technologies will be handled
                  according to your selected privacy preferences.
                </p>
                <p
                  className={`text-sm mt-3 transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  Analytics and tag-management services may process information according to their own privacy policies
                  and terms. These services are separate from the portfolio&apos;s own backend database.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}>
            <h2
              className={`mb-6 text-sm font-bold uppercase tracking-wide border-b pb-2 flex justify-between items-baseline w-full transition-colors duration-500 ${styles.dividerHeavy || `${currentTheme.borderHeavy} ${currentTheme.textPrimary}`}`}>
              <span>03. Processing, Notifications & Retention</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Backend Processing
                </h3>
                <p className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  Contact and project inquiry submissions are sent to our backend API for processing and storage. The
                  information is used to review and respond to inquiries and potential project requests.
                </p>
              </div>

              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Discord Notifications
                </h3>
                <p className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  When a contact or project inquiry is successfully submitted, our backend may trigger a Discord webhook
                  to notify the website owner that a new inquiry has been received. Discord is used for notification
                  purposes and is separate from the website&apos;s primary backend database.
                </p>
              </div>

              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Data Retention
                </h3>
                <p className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  Contact and project inquiry information is intended to be retained for approximately 90 days so that
                  inquiries can be reviewed and responded to. The data is then intended to be deleted through the
                  website&apos;s retention process, which may include scheduled deletion or manual removal depending on
                  the implemented backend workflow.
                </p>
              </div>

              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Use & Disclosure
                </h3>
                <p className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  Information submitted through the website is used for portfolio functionality, responding to
                  inquiries, communicating about potential projects, maintaining website performance, and operating the
                  services described in this policy. Personal information is not intentionally sold or rented to third
                  parties for advertising purposes.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}>
            <h2
              className={`mb-6 text-sm font-bold uppercase tracking-wide border-b pb-2 flex justify-between items-baseline w-full transition-colors duration-500 ${styles.dividerHeavy || `${currentTheme.borderHeavy} ${currentTheme.textPrimary}`}`}>
              <span>04. Your Privacy Choices</span>
            </h2>

            <p className={`text-sm mb-4 transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
              Depending on where you are located and the laws that apply to your use of the website, you may have rights
              or choices concerning your personal information.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                <span
                  className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Access
                </span>
                <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                  You may request information about personal data submitted through the contact or project inquiry
                  forms.
                </p>
              </div>

              <div
                className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                <span
                  className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Deletion
                </span>
                <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                  You may request deletion of personal information submitted through the website before the normal
                  retention period ends, subject to applicable requirements.
                </p>
              </div>

              <div
                className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                <span
                  className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Location Choice
                </span>
                <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                  You can choose Accurate Location, Fast Location, or Deny when the website asks how location-based
                  weather information should be handled.
                </p>
              </div>

              <div
                className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                <span
                  className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Browser Storage
                </span>
                <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                  You can clear locally stored preferences and cached data by using your browser&apos;s storage or
                  site-data controls.
                </p>
              </div>
            </div>

            <p className={`text-sm mt-4 transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
              Where analytics or optional tracking consent is supported by the website, you may also change your consent
              choice using the available privacy controls.
            </p>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}>
            <h2
              className={`mb-6 text-sm font-bold uppercase tracking-wide border-b pb-2 flex justify-between items-baseline w-full transition-colors duration-500 ${styles.dividerHeavy || `${currentTheme.borderHeavy} ${currentTheme.textPrimary}`}`}>
              <span>05. Security & Data Handling</span>
            </h2>

            <div className="space-y-6">
              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Security
                </h3>
                <p className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  Reasonable technical measures are used to transmit and process contact submissions and maintain the
                  website&apos;s backend services. However, no internet transmission, application, or storage mechanism
                  can be guaranteed to be completely secure.
                </p>
              </div>

              <div>
                <h3
                  className={`text-sm uppercase tracking-wider font-bold mb-2 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Limited Purpose
                </h3>
                <p className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
                  Location information is used for weather and visual scene selection. Performance information is used
                  to select a suitable rendering tier. Portfolio API data is used to render portfolio content. Contact
                  and project information is used to respond to inquiries and potential collaborations.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}>
            <h2
              className={`mb-6 text-sm font-bold uppercase tracking-wide border-b pb-2 flex justify-between items-baseline w-full transition-colors duration-500 ${styles.dividerHeavy || `${currentTheme.borderHeavy} ${currentTheme.textPrimary}`}`}>
              <span>06. Third-Party Services</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                <span
                  className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Open-Meteo
                </span>
                <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                  Used to obtain weather information based on the selected location coordinates.
                </p>
              </div>

              <div
                className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                <span
                  className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  ipapi.co
                </span>
                <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                  Used for approximate IP-based location when the Fast Location option is selected.
                </p>
              </div>

              <div
                className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                <span
                  className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  GitHub
                </span>
                <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                  The Work section may retrieve portfolio-related GitHub data through the GitHub GraphQL API.
                </p>
              </div>

              <div
                className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                <span
                  className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Google Analytics
                </span>
                <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                  May be used to understand website usage, traffic, and interaction patterns.
                </p>
              </div>

              <div
                className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                <span
                  className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Google Tag Manager
                </span>
                <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                  May be used to manage website tags and measurement integrations.
                </p>
              </div>

              <div
                className={`border p-4 transition-all duration-500 ${currentTheme.borderCard} ${currentTheme.cardBg}`}>
                <span
                  className={`text-sm font-bold uppercase tracking-wider block mb-1 transition-colors duration-500 ${currentTheme.textPrimary}`}>
                  Discord Webhook
                </span>
                <p className={`text-sm transition-colors duration-500 ${currentTheme.textMuted}`}>
                  Used by the backend to send notifications when contact or project inquiry submissions are received.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}>
            <h2
              className={`mb-6 text-sm font-bold uppercase tracking-wide border-b pb-2 flex justify-between items-baseline w-full transition-colors duration-500 ${styles.dividerHeavy || `${currentTheme.borderHeavy} ${currentTheme.textPrimary}`}`}>
              <span>07. Children & Unsolicited Data</span>
            </h2>

            <p className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
              This website is a professional portfolio and project inquiry website. Visitors should avoid submitting
              sensitive information that is not necessary to process an inquiry, including passwords, financial account
              credentials, government identification numbers, or other highly sensitive information.
            </p>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}>
            <h2
              className={`mb-6 text-sm font-bold uppercase tracking-wide border-b pb-2 flex justify-between items-baseline w-full transition-colors duration-500 ${styles.dividerHeavy || `${currentTheme.borderHeavy} ${currentTheme.textPrimary}`}`}>
              <span>08. Policy Updates</span>
            </h2>

            <p className={`text-sm transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
              This Privacy Policy may be updated when the website&apos;s data practices, storage mechanisms, third-party
              services, or legal requirements change. The &quot;Last updated&quot; date at the top of this page
              indicates when the policy was most recently revised.
            </p>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}>
            <h2
              className={`mb-6 text-sm font-bold uppercase tracking-wide border-b pb-2 flex justify-between items-baseline w-full transition-colors duration-500 ${styles.dividerHeavy || `${currentTheme.borderHeavy} ${currentTheme.textPrimary}`}`}>
              <span>09. Contact & Data Requests</span>
            </h2>

            <p className={`text-sm mb-4 transition-colors duration-500 ${styles.textMuted || currentTheme.textMuted}`}>
              For privacy questions, requests to inspect or delete submitted information, questions about location or
              analytics preferences, or other data-related concerns, please contact the website owner using the email
              address below.
            </p>

            <a
              href="mailto:akhilshettym2003@gmail.com"
              className={`inline-block border px-6 py-3 text-sm font-bold tracking-wide transition-all duration-300 ${currentTheme.btn}`}>
              Email: akhilshettym2003@gmail.com
            </a>
          </motion.div>
        </div>

        <p
          className={`border-b mt-12 transition-colors duration-500 ${styles.dividerHeavy || currentTheme.borderSoft}`}
        />
      </div>
    </motion.section>
  );
};

export default PrivacyPolicy;
