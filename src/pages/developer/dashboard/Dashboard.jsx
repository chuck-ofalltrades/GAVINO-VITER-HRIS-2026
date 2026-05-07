import React from "react";
import Layout from "../Layout";
import { StoreContext } from "../../../store/StoreContext";
import { apiVersion } from "../../../functions/functions-general";
import useQueryData from "../../../functions/custom-hooks/useQueryData";
import {
  BsCalendarX,
  BsMegaphone,
  BsGift,
  BsBuilding,
  BsPeople,
} from "react-icons/bs";

// Requirement: Replace images with rounded primary color of initials
const AvatarInitials = ({ firstName, lastName }) => {
  const initials =
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-xs shrink-0">
      {initials}
    </div>
  );
};

const Dashboard = () => {
  const { store } = React.useContext(StoreContext);

  // Requirement: Read the employee list module
  const { data: employeesData, isLoading: isLoadingEmployees } = useQueryData(
    `${apiVersion}/controllers/developers/employees/employees.php`,
    "get",
    "employees",
  );

  // Requirement: Read the announcement module
  const { data: memosData, isLoading: isLoadingMemos } = useQueryData(
    `${apiVersion}/controllers/developers/memo/memo.php`,
    "get",
    "memo",
  );

  const employees = employeesData?.data || [];
  const memos = memosData?.data || [];

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Logic: Birthday or work anniversary for this month
  const celebrations = employees.filter((emp) => {
    if (!emp.employee_birthday && !emp.employee_start_work_date) return false;
    const bday = new Date(emp.employee_birthday);
    const anniv = new Date(emp.employee_start_work_date);
    return (
      bday.getMonth() === currentMonth || anniv.getMonth() === currentMonth
    );
  });

  // Logic: New employees starting work for this month
  const newEmployees = employees.filter((emp) => {
    if (!emp.employee_start_work_date) return false;
    const startDate = new Date(emp.employee_start_work_date);
    return (
      startDate.getMonth() === currentMonth &&
      startDate.getFullYear() === currentYear
    );
  });

  // Logic: Read all employees and grouped it as per department
  const teamByDepartment = employees.reduce((acc, emp) => {
    const dept = emp.department_name || "General";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(emp);
    return acc;
  }, {});

  return (
    <Layout menu="dashboard">
      <div className="p-4 bg-gray-50">
        <h1 className="text-lg font-bold mb-6 text-gray-700">
          Welcome Manalo, Emmanuel!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-6">
            {/* WHO'S OUT: Static as requested by instructor */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4">
              <h2 className="flex items-center gap-2 text-primary font-bold text-sm mb-4 border-b pb-2">
                <BsCalendarX /> Who's Out
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">
                    Today
                  </p>
                  <div className="flex items-center gap-3 mb-3">
                    <AvatarInitials firstName="Maribel" lastName="Basinas" />
                    <div>
                      <p className="text-xs font-bold text-gray-700">
                        Basinas, Maribel
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Maternity Leave (Day 74)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AvatarInitials firstName="Thea" lastName="Cansignado" />
                    <div>
                      <p className="text-xs font-bold text-gray-700">
                        Cansignado, Theo Lyzette
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Vacation Leave (Day 1)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase border-t pt-2">
                    Tomorrow
                  </p>
                  <div className="flex items-center gap-3">
                    <AvatarInitials firstName="Maribel" lastName="Basinas" />
                    <div>
                      <p className="text-xs font-bold text-gray-700">
                        Basinas, Maribel
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Maternity Leave
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CELEBRATIONS */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4">
              <h2 className="flex items-center gap-2 text-primary font-bold text-sm mb-4 border-b pb-2">
                <BsGift /> Celebrations
              </h2>
              <div className="space-y-4">
                {celebrations.length > 0 ? (
                  celebrations.map((emp, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <AvatarInitials
                        firstName={emp.employee_first_name}
                        lastName={emp.employee_last_name}
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-700">
                          {emp.employee_last_name}, {emp.employee_first_name}
                        </p>
                        <p className="text-[10px] text-primary">
                          Celebration this month
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">
                    No celebrations this month.
                  </p>
                )}
              </div>
            </div>

            {/* NEW EMPLOYEES */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4">
              <h2 className="flex items-center gap-2 text-primary font-bold text-sm mb-4 border-b pb-2">
                <BsBuilding /> New Employees
              </h2>
              <div className="space-y-4">
                {newEmployees.length > 0 ? (
                  newEmployees.map((emp, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <AvatarInitials
                        firstName={emp.employee_first_name}
                        lastName={emp.employee_last_name}
                      />
                      <p className="text-xs font-bold text-gray-700">
                        {emp.employee_last_name}, {emp.employee_first_name}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">
                    No new employee yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            {/* ANNOUNCEMENT */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4 min-h-[300px]">
              <h2 className="flex items-center gap-2 text-primary font-bold text-sm mb-4 border-b pb-2">
                <BsMegaphone /> Announcement
              </h2>
              <div className="space-y-6">
                {!isLoadingMemos && memos.length > 0 ? (
                  memos.map((memo, i) => (
                    <div key={i} className="flex gap-4">
                      <BsMegaphone className="text-gray-400 mt-1 shrink-0" />
                      <div>
                        {/* FIX: Using memo_category and memo_from for the title */}
                        <h3 className="text-xs font-bold text-gray-800">
                          {memo.memo_category}: {memo.memo_from}
                        </h3>
                        <p className="text-[10px] text-gray-400 mb-2">
                          Date: {memo.memo_date}
                        </p>
                        {/* FIX: Using memo_text to match your database structure */}
                        <div
                          className="text-xs text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html: memo.memo_text,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-10">
                    No announcements found.
                  </p>
                )}
              </div>
            </div>

            {/* MY TEAM */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4">
              <h2 className="flex items-center gap-2 text-primary font-bold text-sm mb-4 border-b pb-2">
                <BsPeople /> My Team
              </h2>
              <div className="space-y-6">
                {!isLoadingEmployees &&
                Object.keys(teamByDepartment).length > 0 ? (
                  Object.keys(teamByDepartment).map((dept, i) => (
                    <div key={i}>
                      <p className="text-[10px] font-bold text-gray-400 mb-3 uppercase">
                        {dept}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teamByDepartment[dept].map((emp, j) => (
                          <div key={j} className="flex items-center gap-3">
                            <AvatarInitials
                              firstName={emp.employee_first_name}
                              lastName={emp.employee_last_name}
                            />
                            <div>
                              <p className="text-xs font-bold text-gray-700">
                                {emp.employee_last_name},{" "}
                                {emp.employee_first_name}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                {dept}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">
                    No team data available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
