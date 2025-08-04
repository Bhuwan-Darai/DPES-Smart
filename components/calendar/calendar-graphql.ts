import { gql } from "@apollo/client";

export const GET_CALENDAR_EVENTS = gql`
  query GetCalendarEvents(
    $currentPage: Float!
    $pageSize: Float!
    $searchQuery: String!
  ) {
    calanderEvents(
      currentPage: $currentPage
      pageSize: $pageSize
      searchQuery: $searchQuery
    ) {
      message
      success
      calanderEvent {
        eventId
        title
        eventTypeId
        eventTypeName
        eventTypeColorCode
        eventCategoryId
        eventCategoryName
        academicYearId
        academicYear
        startDate
        endDate
        location
        status
        description
      }
      totalCountCalanderEvent
    }
  }
`;

export const GET_ACADEMIC_YEARS = gql`
  query getAcademicYears {
    getAcademicYears {
      success
      message
      error
      data {
        academicYearId
        academicYear
        startDateAD
      }
    }
  }
`;
