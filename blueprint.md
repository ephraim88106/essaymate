# **EssayMate Project Blueprint**

## **Overview**
EssayMate is a high-quality, AI-powered essay generation tool designed to help students and researchers create structured drafts for academic and English essays. It features a modern, responsive UI and focuses on providing a professional user experience.

## **Current Features & Design**
- **Modern UI:** Responsive design with fluid animations, blurred backgrounds (blobs), and a clean, card-based layout.
- **Multi-step Process:** A landing page followed by a structured input form and a real-time generation result page.
- **Customizable Options:** Supports academic/English essay types, Korean/English languages, target lengths, and additional fields like citation style and academic field.
- **Real-time Generation:** Integrated with Claude API (placeholder logic in script) for streaming text output.
- **Export Options:** Copy to clipboard, download as TXT, and print functionality.
- **Mobile Responsive:** Uses `clamp()` for typography and flexible grids for layout.

## **AdSense Optimization & Quality Improvements Plan**
To ensure Google AdSense approval and provide a "high-quality site" experience, the following updates will be implemented:

### **1. Original Content & Value Addition**
- **Essay Writing Guides:** Add a new "Guides" section with original articles on:
  - "How to Structure an Academic Essay"
  - "Common Pitfalls in English Essay Writing"
  - "The Role of AI in Academic Research (Ethical Use)"
- **Detailed FAQ:** Add an FAQ section addressing common user concerns and providing tips for better results.

### **2. Mandatory Legal & Information Pages**
Create separate pages for:
- **About Us:** Explaining the mission of EssayMate and the team behind it.
- **Contact Us:** A simple contact form or information for user support.
- **Privacy Policy:** Standard AdSense-required disclosure.
- **Terms of Service:** Guidelines for using the AI-generated content.

### **3. Enhanced Navigation & Footer**
- **Robust Footer:** A multi-column footer with links to all new pages, social icons, and service information.
- **Sticky Navigation:** Improve the header to include links to "Guides" and "About".

### **4. Technical Refactoring**
- **Externalize Assets:** Move the massive `<style>` and `<script>` blocks from `index.html` to `style.css` and `main.js` to improve page load speed and maintainability.
- **SEO Optimization:** Add proper meta tags (description, keywords, OG tags) and structured data (JSON-LD) for better search engine visibility.

### **5. Refined Aesthetics**
- **Typography:** Ensure font weights and sizes emphasize key information.
- **Texture & Effects:** Maintain the subtle noise texture and deep shadows for a premium feel.
- **Accessibility:** Verify color contrast and ARIA labels for all interactive elements.

### **6. Monetization with Coupa Partners**
- **Coupa Partners Banner:** Add a vertical banner (120x240) to the landing page, generator page, and result page.
- **Disclosure Statement:** Include the mandatory disclosure: "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."

## **Execution Steps**
1. **Refactor:** Move CSS/JS to external files and update `index.html` links.
2. **Expansion:** Create `about.html`, `contact.html`, `privacy.html`, and `terms.html`.
3. **Content Update:** Add the "Guides" and "FAQ" sections to the landing page or a new page.
4. **Footer/Header Update:** Update navigation links across all pages.
5. **SEO & Validation:** Add meta tags and perform a final check for errors.
6. **Monetization:** Integrate Coupa Partners banner and disclosure across all main pages.
