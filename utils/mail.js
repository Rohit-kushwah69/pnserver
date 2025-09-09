const nodemailer = require("nodemailer");

// Transporter setup (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rohitkushwah6109744@gmail.com",  // apna email
    pass: "dasn htxr cqlb pfhd",     // Gmail App Password
  },
});

// Tailwind-styled acceptance email
const sendAcceptanceEmail = async (to, name, domain) => {
  const htmlContent = `
  <html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-100 font-sans">
    <div class="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h1 class="text-2xl font-bold text-green-600 mb-4">Congratulations, ${name}!</h1>
      <p class="text-gray-700 mb-4">You have been <span class="font-semibold">selected</span> for the <span class="font-semibold">${domain}</span> internship at our company.</p>
      <p class="text-gray-700 mb-4">We are excited to have you onboard. Further details regarding your start date and joining formalities will follow shortly.</p>
      <a href="#" class="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Visit Our Portal</a>
      <p class="text-gray-500 mt-6 text-sm">Best regards,<br/>PN INFOSYS Team</p>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: '"PN INFOSYS" <rohitkushwah6109744@gmail.com>',
    to,
    subject: "Internship Selection - PN INFOSYS",
    html: htmlContent,
  });
};

// Tailwind-styled rejection email
const sendRejectionEmail = async (to, name, domain) => {
  const htmlContent = `
  <html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-100 font-sans">
    <div class="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h1 class="text-2xl font-bold text-red-600 mb-4">Hello, ${name}</h1>
      <p class="text-gray-700 mb-4">We appreciate your interest in the <span class="font-semibold">${domain}</span> internship at our company.</p>
      <p class="text-gray-700 mb-4">Unfortunately, we will not be moving forward with your application at this time. We encourage you to apply for future opportunities.</p>
      <p class="text-gray-500 mt-6 text-sm">Best regards,<br/>PN INFOSYS Team</p>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: '"PN INFOSYS" <rohitkushwah6109744@gmail.com>',
    to,
    subject: "Internship Application Update - PN INFOSYS",
    html: htmlContent,
  });
};

module.exports = { sendAcceptanceEmail, sendRejectionEmail };
