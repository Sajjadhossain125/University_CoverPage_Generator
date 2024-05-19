document.addEventListener('DOMContentLoaded', function () {
    window.jsPDF = window.jspdf.jsPDF;

    // Set current year
    const yearInput = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    yearInput.value = currentYear;
});

function toggleLabReportNo() {
    const labReportNoContainer = document.getElementById('labReportNoContainer');
    const labDateContainer = document.getElementById('labDateContainer');
    const topicLabel = document.getElementById('topicLabel');
    const topicInput = document.getElementById('topic');
    const labReport = document.getElementById('labReport').checked;

    labReportNoContainer.style.display = labReport ? 'block' : 'none';
    labDateContainer.style.display = labReport ? 'block' : 'none';
    topicLabel.textContent = labReport ? 'Lab Experiment Name:' : 'Topic:';
    topicInput.placeholder = labReport ? 'Enter Lab Experiment Name' : 'Enter Topic';
}

function generatePDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const logo = document.getElementById('logo');
    const semester = document.getElementById('semester').value;
    const year = document.getElementById('year').value;
    const section = document.getElementById('section').value;
    const topic = document.getElementById('topic').value;
    const courseTitle = document.getElementById('courseTitle').value;
    const courseCode = document.getElementById('courseCode').value;
    const assignmentType = document.querySelector('input[name="assignmentType"]:checked').value;
    const labReportNo = document.getElementById('labReportNo').value;
    const name = document.getElementById('name').value;
    const id = document.getElementById('id').value;
    const labDate = document.getElementById('labDate').value;
    const date = document.getElementById('date').value;
    const teacher = document.getElementById('teacher').value;

    // Convert the image to a base64 string
    const imgData = getBase64Image(logo);

    // Calculate the center position for the image
    const imgWidth = 40; // Increased width of the image in the PDF
    const imgHeight = 40; // Increased height of the image in the PDF
    const imgX = (pageWidth - imgWidth) / 2; // Center X position

    doc.addImage(imgData, 'PNG', imgX, 10, imgWidth, imgHeight);

    // Add text with specific font size and style
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0); // Set text color to black
    doc.text("Green University of Bangladesh", pageWidth / 2, 60, null, null, "center");
    doc.text("Department of Computer Science and Engineering (CSE)", pageWidth / 2, 70, null, null, "center");

    // Reset font size and style for the remaining text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0); // Set text color to black
    doc.text("Faculty of Sciences and Engineering", pageWidth / 2, 80, null, null, "center");
    doc.text(`Semester: ${semester}, Year: ${year}, B.Sc. in CSE (Day)`, pageWidth / 2, 90, null, null, "center");

    const assignmentLabel = assignmentType === 'Lab Report' ? `Lab Report No: ${labReportNo}` : 'Assignment';
    doc.text(assignmentLabel, pageWidth / 2, 110, null, null, "center");
    doc.text(`Course Title: ${courseTitle}`, pageWidth / 2, 120, null, null, "center");
    doc.text(`Course Code: ${courseCode}, Section: ${section}`, pageWidth / 2, 130, null, null, "center");

    doc.text(`${assignmentType === 'Lab Report' ? 'Lab Experiment Name:' : 'Topic:'} ${topic}`, 20, 150);

    // Bold and underline "Submitted Student Details" and center it
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0); // Set text color to black
    doc.text("Submitted Student Details", pageWidth / 2, 160, null, null, "center");
    doc.setLineWidth(0.5);
    doc.setDrawColor(0); // Set draw color to black
    doc.line(60, 162, pageWidth - 60, 162); // Underline

    // Reset font
    doc.setFont('helvetica', 'normal');

    // Create a table for Name and ID
    doc.autoTable({
        startY: 170,
        head: [['Name', 'ID']],
        body: [[name, id]],
        theme: 'grid',
        tableWidth: 'wrap',  // Adjust the table width to content
        styles: { halign: 'center', cellPadding: 4, textColor: [0], fontSize: 12 }, // Set text color to black and larger font size
        headStyles: { fillColor: [0], textColor: [255], fontStyle:'bold' }, // Set header background color and text color
        columnStyles: {
            0: { cellWidth: 70 },  // Set specific width for the first column
            1: { cellWidth: 70 }   // Set specific width for the second column
        },
        margin: { left: 40, right: 40 }, // Center the table on the page
    });

    // Add submission details
    const finalY = doc.lastAutoTable.finalY;
    if (assignmentType === 'Lab Report') {
        doc.text(`Lab Date: ${labDate}`, 20, finalY + 20);  // Add Lab Date before Submission Date
        doc.text(`Submission Date: ${date}`, 20, finalY + 30);  // Adjust position for Submission Date
        doc.text(`Course Teacher's Name: ${teacher}`, 20, finalY + 40);  // Adjust position for Teacher's Name
    } else {
        doc.text(`Submission Date: ${date}`, 20, finalY + 20);  // Adjust position for Submission Date
        doc.text(`Course Teacher's Name: ${teacher}`, 20, finalY + 30);  // Adjust position for Teacher's Name
    }

    // Add "For Teachers use only" section
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 255);  // Set text color to blue
    doc.text("For Teachers use only: Don’t Write Anything inside this box", pageWidth / 2, finalY + 50, null, null, "center");

    // Draw the assignment status table
    doc.autoTable({
        startY: finalY + 60,
        body: [
            ['Marks: ..................................................  Signature: ....................................'],
            ['Comments: ...............................................  Date: ..............................................']
        ],
        theme: 'grid',
        styles: { halign: 'left', cellPadding: 4, textColor: [0], fontSize: 12 }, // Set text color to black and larger font size
        headStyles: { fillColor: [0], textColor: [255], fontStyle: 'bold' }, // Set header background color, text color, and font style
        margin: { left: 20, right: 20 },
        tableWidth: pageWidth - 40
    });

    doc.save('assignment.pdf');
}

function getBase64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
}
