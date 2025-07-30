import React, { useEffect, useState } from "react";
import { useHooks } from "hooks";

const CoutStudents: React.FC = () => {
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useHooks();

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_ROOT_API}/statistics/students`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setStudentCount(data.data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setStudentCount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCount();
  }, []);

  return (
    <div className="flex flex-row gap-2">
      <h1 className="text-xl font-bold mb-2">{t("Student Count")}:</h1>
      {loading && <p>{t("Loading")}...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && studentCount !== null && (
        <p className="text-lg">{t("Total Students")}: {studentCount}</p>
      )}
    </div>
  );
};

export default CoutStudents;
