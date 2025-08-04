import { gql } from "@apollo/client";

export const GET_PARENT_DETAILS_BY_AUTH_ID = gql`
  query GetParentDetailsByAuthId($authId: String!) {
    getParentDetailsByAuthId(authId: $authId) {
      data {
        guardianId
        guardianName
        guardianPhone
        guardianEmail
        guardianRelation
        guardianStatus
        students {
          studentId
          studentGeneratedId
          studentName
          className
          sectionName
          groupNames
        }
      }
      message
      success
    }
  }
`;

export const GET_STUDENT_DETAILS_BY_PARENT = gql`
  query GetStudentDetailsByParent {
    getStudentDetailsByParent {
      success
      message
      data {
        studentId
        studentGeneratedId
        studentName
        studentClass
        studentSection
        studentRollNumber
        studentPhotoUrl
        studentPhotoPath
      }
    }
  }
`;

export const GET_STUDENT_ATTENDANCE_FOR_PARENTS = gql`
  query GetStudentAttendanceForParents(
    $studentId: String!
    $page: Int
    $limit: Int
    $date: String
  ) {
    getAttendanceDetailsStudentWiseForParents(
      studentId: $studentId
      page: $page
      limit: $limit
      date: $date
    ) {
      success
      message
      data {
        studentId
        attendance {
          attendanceId
          status
          date
        }
        averageAttendance
        totalClassAttended
        totalClassMissed
        academicYear
      }
    }
  }
`;

// assignment queries
export const GET_ASSIGNMENTS_FOR_PARENT = gql`
  query GetAssignmentsForParent($studentId: String!) {
    getAssignmentsForParent(studentId: $studentId) {
      assignmentId
      title
      description
      instructions
      dueDate
      passMarks
      isActive
      fullMarks
      assignmentFiles {
        fileId
        assignmentId
        fileName
        fileUrl
      }
      submissions {
        submissionId
        assignmentId
        studentId
        submissionDate
        marks
        remarks
        status
        files {
          fileId
          submissionId
          fileUrl
        }
      }
    }
  }
`;

// examination of student for parent
export const GET_STUDENT_EXAMINATIONS_FOR_PARENT = gql`
  query GetStudentExaminationsForParent($studentId: String!) {
    getStudentExaminationsForParent(studentId: $studentId) {
      examinationId
      examinationName
      examinationType
      examinationStatus
      examinationStartDate
      examinationEndDate
      examinationYear
    }
  }
`;

// get daily homework by parent
export const GET_DAILY_HOMEWORK_BY_PARENT = gql`
  query GetDailyHomeworkByParent($date: String!, $studentId: String!) {
    getDailyHomeworkByParent(date: $date, studentId: $studentId) {
      success
      message
      homeworks {
        homeworkId
        title
        description
        dueDate
        subjectName
        points
        isActive
        createdAt
        updatedAt
        homeworkFiles {
          fileId
          fileName
          fileUrl
        }
        submissions {
          submissionId
          submissionDate
          marks
          remarks
          status
          files {
            fileId
            fileName
            fileUrl
          }
        }
      }
    }
  }
`;

// get the class routine by parent
export const GET_CLASS_ROUTINE_BY_PARENT = gql`
  query GetClassRoutineByParent($studentId: String!) {
    getClassRoutineByParent(studentId: $studentId) {
      routineId
      routineName
      breakTime {
        breakTimeId
        breakName
        startTime
        endTime
        breakTime
      }
      periods {
        periodId
        periodName
        startTime
        endTime
        subjects {
          subjectId
          subjectName
          teacherId
          teacherName
          classId
          sectionId
        }
      }
    }
  }
`;

// get student vacation homework for parent
export const GET_STUDENT_VACATION_HOMEWORK_FOR_PARENT = gql`
  query GetStudentVacationHomeworkForParent($studentId: String!) {
    getStudentVacationHomeworkForParent(studentId: $studentId) {
      status
      message
      data {
        vacationId
        title
        description
        subjectName
        startDate
        endDate
        points
        files {
          fileId
          fileName
          fileUrl
        }
        submissions {
          submissionId
          studentId
          submissionDate
          marks
          remarks
          status
          files {
            fileId
            fileName
            fileUrl
          }
        }
      }
    }
  }
`;

// create leave note by parent
export const CREATE_LEAVE_NOTE_BY_PARENT = gql`
  mutation createLeaveNote($leaveNote: CreateLeaveNoteInput!) {
    createLeaveNote(leaveNote: $leaveNote) {
      success
      message
    }
  }
`;

// get leave notes by parent
export const GET_LEAVE_NOTES_BY_PARENT = gql`
  query GetLeaveNotesByParent($page: Float, $limit: Float) {
    leaveNoteByParent(page: $page, limit: $limit) {
      success
      message
      data {
        leaveNotesId
        studentId
        fromDate
        toDate
        leaveType
        reason
        emergencyContact
        status
        createdAt
        updatedAt
      }
      total
    }
  }
`;

// delete leave note by parent
export const DELETE_LEAVE_NOTE = gql`
  mutation deleteLeaveNote($leaveNotesId: String!) {
    deleteLeaveNote(leaveNotesId: $leaveNotesId) {
      success
      message
    }
  }
`;

export const UPDATE_LEAVE_NOTE = gql`
  mutation UpdateLeaveNote($updateLeaveNoteInput: UpdateLeaveNoteInput!) {
    updateLeaveNote(updateLeaveNoteInput: $updateLeaveNoteInput) {
      success
      message
    }
  }
`;

// GET EXAMS BY YEAR
export const GET_EXAMS_BY_YEAR = gql`
  query GetExamsByYear($year: String!) {
    findExamsByYear(year: $year) {
      message
      success
      exams {
        examId
        examName
      }
    }
  }
`;

// result ledger
export const RESULT_LEDGER_PARENT = gql`
  query ResultLedgerParent($examId: String!, $page: Float!, $limit: Float!) {
    resultLedgerParent(examId: $examId, page: $page, limit: $limit) {
      message
      success
      total
      totalPages
      ledger {
        studentId
        studentGeneratedId
        studentName
        rollNumber
        subjects {
          subjectId
          subjectName
          theoryObtainMark
          theoryGrade
          theoryGradePoint
          practicalObtainMark
          practicalGrade
          practicalGradePoint
          totalMark
          totalGrade
          totalGradePoint
        }
        totalMarks
        totalGrade
        totalGradePoint
        percentage
        rank
      }
    }
  }
`;
