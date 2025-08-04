import { gql } from "@apollo/client";

export const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      title
      instructor {
        name
      }
      progress
      description
      materials {
        id
        title
        type
        url
      }
    }
  }
`;

export const GET_MATERIALS = gql`
  query GetMaterials {
    materials {
      id
      title
      type
      description
      url
      courseId
      createdAt
    }
  }
`;

export const GET_MATERIAL_DETAILS = gql`
  query GetMaterialDetails($id: ID!) {
    material(id: $id) {
      id
      title
      type
      description
      url
      courseId
      createdAt
      content
      attachments {
        id
        name
        url
      }
    }
  }
`;

export const GET_ALL_NEWSFEED_CATEGORIES = gql`
  query GetAllNewsfeedCategories {
    getAllCategories {
      categoryId
      name
    }
  }
`;

export const GET_ROOT_TYPENAME = gql`
  query {
    __typename
  }
`;

export const GET_ALL_STUDENTS_WITH_DIVISION = gql`
  query GetAllStudentsWithDivision($divisionId: String!) {
    getAllStudentsAccToDivisionWithSubcategory(divisionId: $divisionId) {
      studentId
      studentFirstName
      studentLastName
      studentRollNumber
      studentClass
      studentSection
      divisionId
      divisionName
      subdivisionId
      subdivisionName
    }
  }
`;

export const GET_ALL_NEWSFEED = gql`
  query getPaginatedNewsFeedMobile($page: Int!, $limit: Int!) {
    getPaginatedNewsFeedMobile(page: $page, limit: $limit) {
      newsfeeds {
        newsFeedId
        newsTitle
        newsContent
        newsDate
        scheduleDate
        scheduleTime
        priority
        isVisible
        linkUrls
        isLiked
        selectedOption
        comments
        likes
        shares
        newsFeedCategoryId
        imageFiles {
          imageUrl
          file
        }
        question {
          questionId
          questionText
          questionSolution
          questionImage {
            imageId
            imageUrl
            altText
            file
          }
          options {
            optionId
            optionText
            isCorrect
          }
        }
        authorName
      }
      total
      page
      limit
    }
  }
`;

export const GET_NEWSFEED_COMMENTS = gql`
  query GetNewsFeedComments($postId: String!) {
    getNewsFeedComments(postId: $postId) {
      success
      data {
        parentComments {
          commentId
          content
          authorId
          authorName
          authorImage
          parentId
          createdAt
          likes
          updatedAt
        }
        childComments {
          commentId
          content
          authorId
          authorName
          authorImage
          parentId
          createdAt
          likes
          updatedAt
        }
      }
    }
  }
`;

export const CREATE_NEWSFEED_COMMENT = gql`
  mutation CreateNewsfeedComment($input: String!) {
    createNewsfeedComment(input: $input) {
      success
      message
    }
  }
`;

export const LIKE_NEWSFEED = gql`
  mutation LikeNewsfeed($input: String!) {
    likeNewsfeed(input: $input) {
      success
      message
    }
  }
`;

export const CREATE_QUESTION_RESPONSE = gql`
  mutation CreateQuestionResponse($input: String!) {
    createQuestionResponse(input: $input) {
      success
      message
    }
  }
`;

export const GET_STUDENT_ATTENDANCE = gql`
  query GetStudentAttendance {
    getAttendanceDetailsStudentWise {
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

export const GET_EXAM_ROUTINE_FOR_STUDENT_CLASS = gql`
  query GetExamRoutineForStudentClass($examId: String!) {
    getExamRoutineForStudentClass(examId: $examId) {
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
        practicalFullMark
        practicalPassMark
        startTime
        endTime
        isHoliday
        holidayName
        examDate
      }
    }
  }
`;

// assignment queries
export const GET_ASSIGNMENTS_FOR_STUDENT = gql`
  query GetAssignmentsForStudent {
    getAssignmentsForStudent {
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

// get all assignments for a student
export const GET_COMPLETED_ASSIGNMENTS_FOR_STUDENT = gql`
  query GetCompletedAssignmentsForStudent {
    getCompletedAssignmentsForStudent {
      assignmentId
      title
      description
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

export const SUBMIT_ASSIGNMENT = gql`
  mutation SubmitAssignment($input: SubmitAssignmentInput!) {
    submitAssignment(input: $input) {
      success
      message
    }
  }
`;

// tabs / study

export const GET_SUBJECTS_QUERY = gql`
  query GetSubjects {
    getStudentSubjects {
      message
      success
      subjects {
        id
        subjectId
        subjectName
        subjectCode
        subjectType
        subjectVisible
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_SCHOOL_CURRICULUM_LESSON_PLAN = gql`
  query GetSchoolCurriculumLessonPlan($subjectId: String!) {
    getSchoolCurriculumLessonPlan(subjectId: $subjectId) {
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

// examination of student
export const GET_STUDENT_EXAMINATIONS = gql`
  query GetStudentExaminations {
    getStudentExaminations {
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

// get the class routine
export const GET_CLASS_ROUTINE = gql`
  query GetClassRoutine {
    getClassRoutine {
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

// vaccation homework
export const GET_STUDENT_VACATION_HOMEWORK = gql`
  query GetStudentVacationHomework {
    getStudentVacationHomework {
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

export const SUBMIT_VACATION_HOMEWORK = gql`
  mutation SubmitVacationHomework($input: SubmitVaccationHomeworkInput!) {
    submitVacationHomework(input: $input) {
      success
      message
    }
  }
`;

export const GET_DAILY_HOMEWORK = gql`
  query GetDailyHomework($date: String!) {
    getDailyHomework(date: $date) {
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

export const SUBMIT_DAILY_HOMEWORK = gql`
  mutation SubmitDailyHomework($input: SubmitHomeworkInput!) {
    submitDailyHomework(input: $input) {
      success
      message
    }
  }
`;
