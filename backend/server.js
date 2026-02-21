const express = require("express");
const cors = require("cors");
const mailjet = require("node-mailjet");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 YAHAN APNI MAILJET KEYS DAAL
const mailjetClient = mailjet.apiConnect(
  "7d24bcfc0e245708fdd9bfc5d22e65a7",
  "1a5d13e4e1b4763d79a774e842b9d51f"
);

app.post("/send-confirmation", async (req, res) => {
  console.log("Request received:", req.body);

  const data = req.body;

  try {

    // 🟢 Team Members HTML build
    let teamHTML = "";

    if (data.team_cool_name) {
      teamHTML += `<p><b>Team Name:</b> ${data.team_cool_name}</p><br/>`;
    }

    if (data.members && data.members.length > 0) {
      teamHTML += `<h3>Team Members Details:</h3>`;
      data.members.forEach((member, index) => {
        teamHTML += `
          <p>
          <b>Member ${index + 1}</b><br/>
          Name: ${member.name || ""}<br/>
          Email: ${member.email || ""}<br/>
          Mobile: ${member.mobile || ""}
          </p><br/>
        `;
      });
    }

    await mailjetClient
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: "mukandutsav@gmail.com", // Active sender
              Name: "Mukand Utsav"
            },
            To: [
              {
                Email: data.email,
                Name: data.fullname
              }
            ],
            Subject: "Registration Confirmed - Mukand Utsav 2026 🎉",
            HTMLPart: `
              <h2>Registration Confirmed! 🎉</h2>

              <p>
              Thank you for successfully registering for <b>Mukand Utsav 2026</b>.
              We are thrilled to have you join this grand celebration of talent,
              creativity, innovation, and enthusiasm.
              </p>

              <p>
              Your participation means a lot to us, and we look forward to
              witnessing your energy and competitive spirit at the event.
              Please review your registration details below and keep this
              email for future reference.
              </p>

              <hr/>

              <h3>Your Registration Details:</h3>

              <p><b>Registration Token:</b> ${data.token}</p>
              <p><b>Event:</b> ${data.event}</p>
              <p><b>Full Name:</b> ${data.fullname}</p>
              <p><b>Email:</b> ${data.email}</p>
              <p><b>Mobile:</b> ${data.mobile}</p>
              <p><b>College:</b> ${data.college}</p>
              <p><b>Course:</b> ${data.course || ""}</p>
              <p><b>Year:</b> ${data.year || ""}</p>
              <p><b>Roll Number:</b> ${data.rollno || ""}</p>

              <br/>
              ${teamHTML}

              <hr/>

              <p>
              If you have any questions or need further assistance,
              feel free to reach out to the organizing team.
              </p>

              <p>
              We can't wait to welcome you and make this event
              an unforgettable experience for everyone involved!
              </p>

              <h3 style="color: #d35400;">
                See you on 28th Feb 2026! 🎊
              </h3>

              <p>Warm Regards,<br/>Team Mukand Utsav</p>
            `
          }
        ]
      });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});