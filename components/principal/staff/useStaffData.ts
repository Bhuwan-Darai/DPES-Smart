import { useEffect, useState } from "react";
import { useQuery, DocumentNode } from "@apollo/client";
import useDebounce from "@/lib/debounce";
import { GET_ALL_STAFFS } from "@/lib/hooks/graphql/PrincipalQueries";

interface StaffFilters {
  department: string;
  status: string;
}

interface Staff {
  staffId: string;
  customId: string;
  fullName: string;
  email: string;
  phone: string;
  department: {
    departmentId: string | null;
    departmentName: string | null;
  } | null;
  status: string;
  photo: string | null;
  roleOrPosition: {
    designationId: string;
    designationName: string;
  } | null;
  yearOfExperience: string | null;
  joiningDate: string;
}

const useStaffData = (
  filter: StaffFilters,
  debouncedSearchQuery: string,
  itemsPerPage: number
) => {
console.log("filter", filter);
console.log("debouncedSearchQuery", debouncedSearchQuery);
console.log("itemsPerPage", itemsPerPage);
  // State variables
  const [staffsData, setStaffsData] = useState<Staff[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const {
    data: staffs,
    loading: staffLoading,
    fetchMore,
    refetch: refetchStaffs,
    error,
  } = useQuery(GET_ALL_STAFFS, {
    variables: {
      currentPage: 1,
      pageSize: itemsPerPage,
      searchQuery: debouncedSearchQuery.trim(),
      filters: {
        department: filter.department || "",
        status: filter.status || "",
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  console.log("staffs in hook", staffs);
  console.log("error in hook", error);

  // Update state when new data is received
  useEffect(() => {
    if (staffs?.getAllStaffs?.staffList) {
      setStaffsData(staffs.getAllStaffs.staffList || []);
      setTotalCount(staffs.getAllStaffs.totalStaffs || 0);
    }
  }, [staffs]);

  // Refetch data when filters or search query change
  useEffect(() => {
    setCurrentPage(1);
    refetchStaffs({
      currentPage: 1,
      pageSize: itemsPerPage,
      searchQuery: debouncedSearchQuery.trim(),
      filters: {
        department: filter.department || "",
        status: filter.status || "",
      },
    });
  }, [filter.department, filter.status, debouncedSearchQuery, refetchStaffs, itemsPerPage]);

  const handleLoadMore = async () => {
    if (isFetchingMore || staffLoading || staffsData.length >= totalCount) {
      return;
    }

    setIsFetchingMore(true);
    const nextPage = currentPage + 1;

    try {
      const { data: newData } = await fetchMore({
        variables: {
          currentPage: nextPage,
          pageSize: itemsPerPage,
          searchQuery: debouncedSearchQuery.trim(),
          filters: {
            department: filter.department || "",
            status: filter.status || "",
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            getAllStaffs: {
              ...fetchMoreResult.getAllStaffs,
              staffList: [
                ...prev.getAllStaffs.staffList,
                ...fetchMoreResult.getAllStaffs.staffList.filter(
                  (newStaff: Staff) =>
                    !prev.getAllStaffs.staffList.some(
                      (existing: Staff) => existing.staffId === newStaff.staffId
                    )
                ),
              ],
            },
          };
        },
      });

      if (newData?.getAllStaffs?.staffList) {
        setStaffsData((prev) => [
          ...prev,
          ...newData.getAllStaffs.staffList.filter(
            (newStaff: Staff) =>
              !prev.some((existing) => existing.staffId === newStaff.staffId)
          ),
        ]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Error fetching more staff:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  return {
    staffs: staffsData,
    totalCount,
    isFetchingMore,
    staffLoading,
    handleLoadMore,
    refetch: refetchStaffs,
  };
};

export default useStaffData;