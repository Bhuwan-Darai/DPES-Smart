import { gql } from "@apollo/client";

// GET STUDENT BY ID
export const GET_STUDENT_BY_ID = gql`
  query GetStudentPersonalDetails($studentId: String!) {
    getStudentPersonalDetails(studentId: $studentId) {
      id
      studentId
      studentGeneratedId
      firstName
      lastName
      email
      phone
      dateOfBirthAD
      gender
      studentAdmissionNumber
      studentEthnicity
      studentBloodGroup
      studentHealthIssues
      studentAllergies
      studentMedications
      studentRollNumber
      studentTemporaryAddress
      studentPermanentAddress
      postalCode
      sectionName
      groupName
      studentStatus
      class
    }
  }
`;
