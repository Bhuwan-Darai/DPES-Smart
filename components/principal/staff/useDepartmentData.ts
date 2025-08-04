import { useEffect, useState } from "react";
import { useQuery, DocumentNode } from "@apollo/client";
import { GET_DEPARTMENT } from "@/lib/hooks/graphql/PrincipalQueries";

interface DepartmentData {
  departmentId: string;
  name: string;
  designations: { designationId: string; name: string }[];
}

const useDepartmentData = () => {
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);

  const {
    data: departments,
    loading: isDepartmentLoading,
    error: departmentError,
  } = useQuery(GET_DEPARTMENT);

  useEffect(() => {
    if (departments?.getDepartment) {
      setDepartmentData(departments.getDepartment || []);
    }
  }, [departments]);

  return {
    departmentData,
    isDepartmentLoading,
    departmentError,
  };
};

export default useDepartmentData;