import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface StudentExportData {
  name: string;
  className: string;
  email: string;
  overallScore: number;
  knowledgeScore: number;
  decisionScore: number;
  responseTimeScore: number;
  drillScore: number;
  completedModulesCount: number;
  weakAreas: string[];
  status: string;
}

interface ReportExportParams {
  teacherName: string;
  className: string;
  avgScore: number;
  totalStudents: number;
  onTrackCount: number;
  needsPracticeCount: number;
  students: StudentExportData[];
}

export function generateTeacherReadinessPDF(params: ReportExportParams) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor: [number, number, number] = [74, 132, 90]; // #4A845A (Almond Green)
  const secondaryColor: [number, number, number] = [2, 132, 199]; // #0284C7 (Sky Blue)
  const darkTextColor: [number, number, number] = [30, 41, 59]; // Slate 800

  // ── Header Banner ──
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SURAKSHA-OS | DISASTER READINESS REPORT', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Institutional School Safety & Disaster Preparedness Assessment', 14, 18);

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(`Generated: ${dateStr}`, 196, 15, { align: 'right' });

  // ── Metadata & Summary Section ──
  doc.setTextColor(...darkTextColor);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`Class: ${params.className}`, 14, 34);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Supervising Teacher: ${params.teacherName} | Total Roster: ${params.totalStudents} Students`, 14, 40);

  // ── Summary KPI Boxes ──
  doc.setFillColor(241, 248, 243);
  doc.roundedRect(14, 45, 42, 18, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(74, 132, 90);
  doc.text('CLASS AVERAGE IDRI', 17, 51);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`${params.avgScore}%`, 17, 59);

  doc.setFillColor(240, 249, 255);
  doc.roundedRect(60, 45, 42, 18, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(2, 132, 199);
  doc.text('STUDENTS ON TRACK', 63, 51);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`${params.onTrackCount}`, 63, 59);

  doc.setFillColor(254, 242, 242);
  doc.roundedRect(106, 45, 42, 18, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(225, 29, 72);
  doc.text('NEEDS PRACTICE', 109, 51);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`${params.needsPracticeCount}`, 109, 59);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(152, 45, 44, 18, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('COMPLIANCE LEVEL', 155, 51);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(params.avgScore >= 80 ? 74 : 217, params.avgScore >= 80 ? 132 : 119, params.avgScore >= 80 ? 90 : 6);
  doc.text(params.avgScore >= 80 ? 'Certified Safe' : 'Intervention Needed', 155, 59);

  // ── Student Table ──
  const tableData = params.students.map(s => [
    s.name,
    s.className,
    `${s.overallScore}%`,
    `${s.knowledgeScore}%`,
    `${s.decisionScore}%`,
    `${s.responseTimeScore}%`,
    `${s.completedModulesCount}/3`,
    s.weakAreas.length > 0 ? s.weakAreas.map(w => w.replace(/_/g, ' ')).join(', ') : 'None (Mastered)',
    s.status,
  ]);

  autoTable(doc, {
    startY: 69,
    head: [['Student Name', 'Class', 'IDRI Score', 'Knowledge', 'Decisions', 'Reaction', 'Modules', 'Weakness Flags', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `SurakshaOS School Safety Management • Page ${data.pageNumber} • Confidential Institutional Document`,
        105,
        290,
        { align: 'center' }
      );
    },
  });

  const sanitizedClassName = params.className.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`SurakshaOS_Readiness_Report_${sanitizedClassName}_${Date.now()}.pdf`);
}
