document.addEventListener('DOMContentLoaded', function () {
    window.jsPDF = window.jspdf.jsPDF;

    // Set current year
    const yearInput = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    yearInput.value = currentYear;

    // The toggle state
    const assignmentRadio = document.getElementById('assignment');
    assignmentRadio.checked = true;
    toggleLabReportNo();

    // Add event listeners to the toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-container input[type="radio"]');
    toggleButtons.forEach(button => {
        button.addEventListener('change', toggleLabReportNo);
    });
});

function toggleLabReportNo() {
    const labReportNoContainer = document.getElementById('labReportNoContainer');
    const labDateContainer = document.getElementById('labDateContainer');
    const topicLabel = document.getElementById('topicLabel');
    const topicInput = document.getElementById('topic');
    const assignmentChecked = document.getElementById('assignment').checked;

    labReportNoContainer.style.display = assignmentChecked ? 'none' : 'block';
    labDateContainer.style.display = assignmentChecked ? 'none' : 'block';
    topicLabel.textContent = assignmentChecked ? 'Topic:' : 'Lab Experiment Name:';
    topicInput.placeholder = assignmentChecked ? 'Enter Topic' : 'Enter Lab Experiment Name';
}

function resetForm() {
    document.getElementById('pdf-form').reset();
    toggleLabReportNo(); 
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
    const assignmentType = document.getElementById('assignment').checked ? 'Assignment' : 'Lab Report';
    const labReportNo = document.getElementById('labReportNo').value;
    const name = document.getElementById('name').value;
    const id = document.getElementById('id').value;
    const labDate = document.getElementById('labDate').value;
    const date = document.getElementById('date').value;
    const teacher = document.getElementById('teacher').value;

    // Convert the image to a base64 string
    const imgData = getBase64Image(logo);

   
    const imgWidth = 40; 
    const imgHeight = 40; 
    const imgX = (pageWidth - imgWidth) / 2; 

    doc.addImage(imgData, 'PNG', imgX, 10, imgWidth, imgHeight);

  
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0); 
    doc.text("Green University of Bangladesh", pageWidth / 2, 60, null, null, "center");
    doc.text("Department of Computer Science and Engineering (CSE)", pageWidth / 2, 70, null, null, "center");

 
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0); 
    doc.text("Faculty of Sciences and Engineering", pageWidth / 2, 80, null, null, "center");
    doc.text(`Semester: ${semester}, Year: ${year}, B.Sc. in CSE (Day)`, pageWidth / 2, 90, null, null, "center");

    const assignmentLabel = assignmentType === 'Lab Report' ? `Lab Report No: ${labReportNo}` : 'Assignment';
    doc.text(assignmentLabel, pageWidth / 2, 110, null, null, "center");
    doc.text(`Course Title: ${courseTitle}`, pageWidth / 2, 120, null, null, "center");
    doc.text(`Course Code: ${courseCode}, Section: ${section}`, pageWidth / 2, 130, null, null, "center");

    doc.text(`${assignmentType === 'Lab Report' ? 'Lab Experiment Name:' : 'Topic:'} ${topic}`, 20, 150);

    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0); 
    doc.text("Submitted Student Details", pageWidth / 2, 160, null, null, "center");
    doc.setLineWidth(0.5);
    doc.setDrawColor(0); 
    doc.line(60, 162, pageWidth - 60, 162); 

   
    doc.setFont('helvetica', 'normal');

    doc.autoTable({
        startY: 170,
        head: [['Name', 'ID']],
        body: [[name, id]],
        theme: 'grid',
        tableWidth: 'wrap',  
        styles: { halign: 'center', cellPadding: 4, textColor: [0], fontSize: 12 }, 
        headStyles: { fillColor: [0], textColor: [255], fontStyle: 'bold' }, 
        columnStyles: {
            0: { cellWidth: 70 }, 
            1: { cellWidth: 70 }   
        },
        margin: { left: 40, right: 40 }, 
    });

    // Add submission details
    const finalY = doc.lastAutoTable.finalY;
    if (assignmentType === 'Lab Report') {
        doc.text(`Lab Date: ${labDate}`, 20, finalY + 20);  
        doc.text(`Submission Date: ${date}`, 20, finalY + 30);  
        doc.text(`Course Teacher's Name: ${teacher}`, 20, finalY + 40);  
    } else {
        doc.text(`Submission Date: ${date}`, 20, finalY + 20);  
        doc.text(`Course Teacher's Name: ${teacher}`, 20, finalY + 30); 
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
        styles: { halign: 'left', cellPadding: 4, textColor: [0], fontSize: 12 }, 
        headStyles: { fillColor: [0], textColor: [255], fontStyle: 'bold' }, 
        margin: { left: 20, right: 20 },
        tableWidth: pageWidth - 40
    });
  
    if (labDateContainer.style.display !== 'none') {
        doc.save('Lab-Report.pdf');
    } else {
        doc.save('assignment.pdf');
    }
    
 

}

function getBase64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
}
