import { gql } from "@apollo/client";

export const GET_TEACHER_PROFILE = gql`
  query GetTeacherProfile($id: String!) {
    getTeacherProfileDetails(id: $id) {
      success
      message
      data {
        personalInfoId
        generatedId
        fullName
        email
        phone
        gender
        ethnicity
        dateOfBirthAD
        bloodGroup
        allergies
        medicalConditions
        currentMedications
        experienceYear
        joiningDate
        qualification
        teacherSubject
        teacherBio
        temporaryStreetAddress
        temporaryCity
        temporaryState
        temporaryPincode
        permanentStreetAddress
        permanentCity
        permanentState
        permanentPincode
        alternatePhone
        hasLeftSchool
        emergencyContactName
        emergencyRelationship
        emergencyContactPhone
        teacherPreviousSchoolExperience {
          previousSchoolExperienceId
          schoolName
          position
          fromyear
          toyear
          subjectTaught
        }
      }
    }
  }
`;

export const GET_SUBJECTS_QUERY = gql`
  query GetSubjects {
    subjects {
      id
      subjectId
      subjectName
      subjectVisible
    }
  }
`;

export const GET_CLASSROOMS_QUERY = gql`
  query GetClassrooms {
    classrooms {
      id
      classId
      className
      classVisible
      sectionIds
      groupIds
      subjectIds
      createdAt
      updatedAt
    }
  }
`;

// export const GET_SECTIONS_QUERY = gql`
//   query GetSections {
//     sections {
//       id
//       sectionId
//       sectionName
//       sectionVisible
//     }
//   }
// `;

export const GET_SECTIONS_QUERY = gql`
  query sections {
    sections {
      id
      sectionId
      sectionName
      sectionVisible
    }
  }
`;

export const CREATE_HOMEWORK_MUTATION = gql`
  mutation CreateHomework($input: CreateHomeworkInput!) {
    createHomework(createHomeworkInput: $input) {
      success
      message
    }
  }
`;

export const UPDATE_HOMEWORK_MUTATION = gql`
  mutation UpdateHomework($input: UpdateHomeworkInput!) {
    updateHomework(updateHomeworkInput: $input) {
      success
      message
    }
  }
`;

export const DELETE_HOMEWORK_MUTATION = gql`
  mutation DeleteHomework($id: String!) {
    removeHomework(id: $id) {
      success
      message
      error
    }
  }
`;

export const GET_HOMEWORKS_BY_TEACHER = gql`
  query GetHomeworksByTeacher(
    $filters: HomeworkFiltersInput
    $pagination: PaginationInputHomeworks
  ) {
    getHomeworksByTeacher(filters: $filters, pagination: $pagination) {
      homeworks {
        homeworkId
        title
        description
        classId
        subjectId
        sectionIds
        dueDate
        points
        isActive
        homeworkFiles {
          fileId
          fileUrl
          fileName
          filePath
        }
      }
      total
    }
  }
`;

// vaccation-homework
export const GET_VACATION_HOMEWORKS_BY_TEACHER = gql`
  query GetVacationHomeworksByTeacher(
    $filters: VaccationHomeworkFiltersInput
    $pagination: PaginationInputVaccationHomeworks
  ) {
    getVacationHomeworksByTeacher(filters: $filters, pagination: $pagination) {
      homeworks {
        vacationId
        title
        description
        classId
        subjectId
        sectionIds
        vacationType
        startDate
        endDate
        points
        vacationFiles {
          fileId
          fileName
          fileUrl
          filePath
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
            fileUrl
            fileName
            filePath
          }
        }
      }
      total
      totalPages
    }
  }
`;

// create vacation homework
export const CREATE_VACATION_HOMEWORK_MUTATION = gql`
  mutation CreateVaccationHomework($input: CreateVaccationHomeworkInput!) {
    createVaccationHomework(createVaccationHomeworkInput: $input) {
      success
      message
    }
  }
`;

// delete vacation homework
export const DELETE_VACATION_HOMEWORK_MUTATION = gql`
  mutation DeleteVacationHomework($id: String!) {
    removeVaccationHomework(id: $id) {
      success
      message
    }
  }
`;

// update vacation homework
export const UPDATE_VACATION_HOMEWORK_MUTATION = gql`
  mutation UpdateVacationHomework($input: UpdateVaccationHomeworkInput!) {
    updateVaccationHomework(updateVaccationHomeworkInput: $input) {
      success
      message
    }
  }
`;

// get school examination by academic year
export const GET_SCHOOL_EXAMINATION_BY_ACADEMIC_YEAR = gql`
  query GetSchoolExaminationByAcademicYear($academicYearId: String!) {
    getSchoolExaminationByAcademicYear(academicYearId: $academicYearId) {
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

// get school classroom
export const SCHOOL_CLASSROOM_QUERY = gql`
  query GetSchoolClassroom {
    classrooms {
      classId
      className
      classVisible
    }
  }
`;

// get exam routine
export const GET_EXAM_ROUTINE = gql`
  query GetSubjectsByClassId($classId: String!, $examId: String!) {
    getExamRoutine(classId: $classId, examId: $examId) {
      message
      success
      data {
        examRoutineId
        examType
        noticeDescription
        holidayCount
        startDate
        endDate
        schedules {
          subjectId
          subjectName
          theoryFullMark
          theoryPassMark
          startTime
          endTime
          isHoliday
          holidayName
          examDate
        }
      }
    }
  }
`;

// get students attendance class teacher wise
export const GET_STUDENTS_ATTENDANCE_CLASS_TEACHER_WISE = gql`
  query GetStudentsAttendanceClassTeacherWise($date: String!) {
    getStudentsAttendanceClassTeacherWise(date: $date) {
      success
      message
      data {
        studentId
        studentFirstName
        studentLastName
        studentRollNumber
        studentClassId
        studentSectionId
        studentGroupId
        studentGeneratedId
        attendance {
          attendanceId
          studentId
          attendanceDate
          status
        }
      }
    }
  }
`;

// create bulk attendance
export const CREATE_BULK_ATTENDANCE = gql`
  mutation CreateBulkAttendance($input: String!) {
    createBulkAttendance(input: $input) {
      successCount
      failedCount
      errors {
        studentId
        date
        status
        error
      }
      message
    }
  }
`;

// update student attendance
export const UPDATE_STUDENT_ATTENDANCE = gql`
  mutation UpdateStudentAttendance($input: String!) {
    updateStudentAttendance(input: $input) {
      success
      message
    }
  }
`;

// get my attendance => role teacher
export const GET_TEACHER_ATTENDANCE = gql`
  query GetTeacherAttendance($date: String!, $page: Float!, $limit: Float!) {
    getTeacherAttendance(date: $date, page: $page, limit: $limit) {
      avaerageAttendance
      totalDays
      presentDays
      absentDays
      teacherId
      attendanceDate {
        attendanceDate
        status
        attendanceId
      }
    }
  }
`;

// get the assigned  teacher class , section and subject details
export const GET_TEACHER_CLASSROOM_QUERY = gql`
  query GetTeacherClassroomSubject {
    getTeacherClassSubjects {
      message
      success
      data {
        classId
        className
        sections {
          sectionId
          sectionName
          subjects {
            subjectId
            subjectName
          }
        }
        subjects {
          subjectId
          subjectName
        }
      }
    }
  }
`;

// get school curriculum lesson plan for teacher
export const GET_SCHOOL_CURRICULUM_LESSON_PLAN_FOR_TEACHER = gql`
  query GetSchoolCurriculumLessonPlanForTeacher(
    $classId: String!
    $subjectId: String!
  ) {
    getSchoolCurriculumLessonPlanForTeacher(
      classId: $classId
      subjectId: $subjectId
    ) {
      headerId
      header
      parentCurriculum {
        curriculumId
        name
        parentId
        level
        visible
        createdAt
        lessonPlan {
          lessonPlanId
          learningObjective
          duration
          activities
          teachingStartDate
          teachingEndDate
          teachingMethod
          assessment
          homework
          createdAt
          materials {
            materialId
            title
            content
            type
          }
        }
      }
      childCurriculum {
        curriculumId
        name
        parentId
        level
        visible
        lessonPlan {
          lessonPlanId
          curriculumId
          learningObjective
          duration
          activities
          teachingStartDate
          teachingEndDate
          teachingMethod
          assessment
          homework
          createdAt
          materials {
            materialId
            title
            content
            type
          }
        }
      }
      lessonPlan {
        lessonPlanId
        learningObjective
        duration
        activities
        teachingStartDate
        teachingEndDate
        teachingMethod
        assessment
        homework
        createdAt
        materials {
          materialId
          title
          content
          type
        }
      }
    }
  }
`;

// update lesson plan
export const UPDATE_LESSON_PLAN = gql`
  mutation UpdateLessonPlan($input: UpdateLessonPlanInput!) {
    updateLessonPlan(input: $input) {
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

// GET SEAT PLAN BY EXAM ID
export const GET_SEAT_PLAN_BY_EXAM_ID = gql`
  query GetSeatPlanByExamId($examId: String!) {
    getSeatPlanByExamId(examId: $examId) {
      success
      message
      seatPlan {
        seatPlanId
        year
        examId
        updatedAt
        rooms {
          roomId
          name
          capacity
          students {
            studentId
            name
            rollNumber
            class
            section
          }
          remainingCapacity
        }
      }
    }
  }
`;

// view assigned students
export const VIEW_ASSIGNED_STUDENTS = gql`
  query ViewAssignedStudents($input: ViewAssignedStudentsInput!) {
    viewAssignedStudents(input: $input) {
      students {
        studentId
        name
        rollNumber
        class
        section
      }
    }
  }
`;

export const MARK_TEACHER_ATTENDANCE_MUTATION = gql`
  mutation MarkTeacherAttendance($input: UpdateAttendanceInputTeacher!) {
    markAttendanceByTeacher(input: $input) {
      success
      message
    }
  }
`;

export const GET_SCHOOL_LOCATION = gql`
  query GetSchoolLocation {
    getSchoolLocation {
      success
      message
      schoolLocation
    }
  }
`;

export const GET_TEACHER_SCHEDULE_QUERY = gql`
  query GetTeacherSchedule {
    getTeacherSchedule {
      scheduleId
      personalInfoId
      teacherName
      startDate
      endDate
      days
      comingTime
      leavingTime
    }
  }
`;

// get student list for class section wise
export const GET_STUDENT_LIST_FOR_CLASS_SECTION_WISE = gql`
  query GetStudentListForClassSectionWise(
    $searchQuery: String
    $filters: StudentFiltersInput
  ) {
    GetStudentListForClassSectionWise(
      searchQuery: $searchQuery
      filters: $filters
    ) {
      students {
        studentId
        firstName
        lastName
        studentClass {
          className
        }
        studentSection {
          sectionName
        }
        rollNumber
      }
      total
    }
  }
`;

// GET ASSIGNED CLASSES TO AN EXAM
export const GET_ASSIGNED_CLASSES = gql`
  query GetAssignedClasses($examId: String!) {
    getAssignedClasses(examId: $examId) {
      message
      success
      classes {
        classId
        className
      }
    }
  }
`;

export const GET_SECTION_LIST = gql`
  query GetSectionList($classId: String!) {
    sectionsByClassId(classId: $classId) {
      sectionId
      sectionName
    }
  }
`;

// get full marks for a subject
export const GET_FULL_MARKS_FOR_A_SUBJECT = gql`
  query GetFullMarksForASubject(
    $examId: String!
    $classId: String!
    $subjectId: String!
  ) {
    getFullMarksForASubject(
      examId: $examId
      classId: $classId
      subjectId: $subjectId
    ) {
      message
      success
      marks {
        subjectId
        theoryFullMark
        theoryPassMark
        practicalFullMark
        practicalPassMark
      }
    }
  }
`;

// GET ASSIGNED SUBJECTS TO AN EXAM
export const GET_ASSIGNED_SUBJECTS = gql`
  query GetAssignedSubjects($examId: String!, $classId: String!) {
    getAssignedSubjects(examId: $examId, classId: $classId) {
      message
      success
      subjects {
        examSubjectId
        subjectId
        subjectName
      }
    }
  }
`;

// create or update result
export const CREATE_OR_UPDATE_RESULT = gql`
  mutation CreateOrUpdateResult($input: CreateResultInput!) {
    createOrUpdateResult(input: $input) {
      message
      success
    }
  }
`;

// find result
export const FIND_RESULT = gql`
  query FindResult($input: FindResultInput!) {
    findResult(input: $input) {
      message
      success
      results {
        studentId
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
    }
  }
`;

// GET SUBJECT MARKS
export const GET_SUBJECT_MARKS_BY_TEACHER = gql`
  query GetSubjectMarksByTeacher(
    $examId: String!
    $classId: String!
    $subjectId: String!
  ) {
    getSubjectMarksByTeacher(
      examId: $examId
      classId: $classId
      subjectId: $subjectId
    ) {
      message
      success
      marks {
        subjectMarksId
        subjectId
        subjectName
        theoryCreditHour
        practicalCreditHour
        theoryFullMark
        theoryPassMark
        practicalFullMark
        practicalPassMark
      }
    }
  }
`;

// result ledger
export const RESULT_LEDGER_TEACHER = gql`
  query ResultLedgerTeacher($examId: String!, $page: Float!, $limit: Float!) {
    resultLedgerTeacher(examId: $examId, page: $page, limit: $limit) {
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
