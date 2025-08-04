import { gql } from "@apollo/client";

// GET PRINCIPAL PROFILE
export const GET_PRINCIPAL_PROFILE = gql`
  query GetPrincipalProfile($id: String!) {
    getPrincipalProfileDetails(id: $id) {
      success
      message
      data {
        principalId
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
        principalSubject
        principalBio
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
        principalPreviousExperience {
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

// GET SUBJECTS
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

// GET TEACHERS
export const GET_TEACHERS_QUERY = gql`
  query GetTeachers(
    $page: Float
    $limit: Float
    $status: String
    $subject: String
    $searchQuery: String
  ) {
    getAllTeachers(
      page: $page
      limit: $limit
      status: $status
      subject: $subject
      searchQuery: $searchQuery
    ) {
      teachers {
        personalInfoId
        fullName
        email
        phone
        gender
        ethnicity
        generatedId
        profilePicture
        department
        joiningDate
        experienceYear
        teacherStatus
        teacherStreetAddress
        teacherCity
        teacherState
        teacherPinCode
        teacherCountry
        teacherAlternatePhone
        allergies
        medicalConditions
        currentMedications
        qualification
        teacherEmergencyContactName
        teacherEmergencyRelationship
        teacherEmergencyContactPhone
        teacherBio
        bloodGroup
        teacherClassAssignment {
          ClassAssignId
          class
          classId
          section
          sectionId
          subject
          subjectId
        }
        teacherPreviousExperience {
          PerviousExperienceId
          schoolName
          position
          fromyear
          toyear
          subjectTaught
        }
      }
      totalCount
    }
  }
`;

// GET CLASS LIST FOR FILTERS
export const GET_CLASS_LIST = gql`
  query GetClassList {
    classrooms {
      classId
      className
    }
  }
`;

// GET SECTION LIST FOR FILTERS
export const GET_SECTION_LIST = gql`
  query GetSectionList($classId: String!) {
    sectionsByClassId(classId: $classId) {
      sectionId
      sectionName
    }
  }
`;

// GET GROUP LIST FOR FILTERS
export const GET_GROUP_LIST = gql`
  query GetGroupList($classId: String!) {
    groupsByClassId(classId: $classId) {
      groupId
      groupName
      groupType
    }
  }
`;

// GET STUDENTS IN TABLE WITH PAGINATION
export const GET_STUDENTS = gql`
  query GetStudents(
    $page: Float!
    $limit: Float!
    $searchQuery: String!
    $filters: StudentFiltersInput
  ) {
    GetStudents(
      page: $page
      limit: $limit
      searchQuery: $searchQuery
      filters: $filters
    ) {
      students {
        studentId
        studentGeneratedId
        firstName
        lastName
        email
        dateOfBirthAD
        gender
        phone
        temporaryAddress {
          street
        }
        studentClass {
          className
          classId
        }
        studentSection {
          sectionName
          sectionId
        }
        studentGroup {
          groupName
          groupId
        }
        rollNumber
        status
      }
      total
      totalActiveStudents
      classCount
      sectionCount
    }
  }
`;

// GET ALL STAFFS
export const GET_ALL_STAFFS = gql`
  query GetAllStaffs(
    $currentPage: Float!
    $pageSize: Float!
    $searchQuery: String
    $filters: StaffFiltersInput
  ) {
    getAllStaffs(
      currentPage: $currentPage
      pageSize: $pageSize
      searchQuery: $searchQuery
      filters: $filters
    ) {
      success
      message
      totalStaffs
      totalPages
      staffList {
        staffId
        customId
        fullName
        email
        phone
        department {
          departmentId
          departmentName
        }
        status
        photo
        roleOrPosition {
          designationId
          designationName
        }
        yearOfExperience
        joiningDate
      }
    }
  }
`;

// GET DEPARTMENT
export const GET_DEPARTMENT = gql`
  query GetDepartment {
    getDepartment {
      departmentId
      name
      designations {
        designationId
        name
      }
    }
  }
`;

// get paginated teacher attendance for principal
export const GET_PAGINATED_TEACHER_ATTENDANCE = gql`
  query GetPaginatedTeacherAttendance(
    $date: String!
    $page: Float!
    $limit: Float!
    $search: String
  ) {
    getAllTeacherAttendanceForPrincipal(
      date: $date
      page: $page
      limit: $limit
      search: $search
    ) {
      teacherId
      fullName
      photo
      customId
      attendance {
        status
        attendanceDate
        attendanceId
      }
    }
  }
`;

// GET ALL NEWSFEED CATEGORIES
export const GET_ALL_NEWSFEED_CATEGORIES = gql`
  query GetAllNewsfeedCategories {
    getAllCategories {
      categoryId
      name
    }
  }
`;

// CREATE NEWSFEED
export const CREATE_NEWSFEED = gql`
  mutation CreateNewsfeed($input: String!) {
    createNewsfeed(input: $input) {
      success
      message
    }
  }
`;

// DELETE NEWSFEED
export const DELETE_NEWSFEED = gql`
  mutation DeleteNewsfeed($newsFeedId: String!) {
    deleteNewsfeed(newsFeedId: $newsFeedId) {
      success
      message
    }
  }
`;
