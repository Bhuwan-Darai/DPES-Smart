// Grade calculation functions
export const calculateGrade = (
  obtainedMarks: number,
  fullMarks: number
): string => {
  if (fullMarks === 0) return "";

  const percentage = (obtainedMarks / fullMarks) * 100;

  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C+";
  if (percentage >= 40) return "C";
  if (percentage >= 30) return "D";
  return "NG"; // Not Graded/Failed
};

export const calculateGradePoint = (
  obtainedMarks: number,
  fullMarks: number
): number => {
  if (fullMarks === 0) return 0;

  const percentage = (obtainedMarks / fullMarks) * 100;

  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.6;
  if (percentage >= 70) return 3.2;
  if (percentage >= 60) return 2.8;
  if (percentage >= 50) return 2.4;
  if (percentage >= 40) return 2.0;
  if (percentage >= 30) return 1.0;
  return 0; // Failed
};
