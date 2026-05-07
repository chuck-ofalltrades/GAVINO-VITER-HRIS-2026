import React from "react";
import { StoreContext } from "../../../../store/StoreContext";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiVersion } from "../../../../functions/functions-general";
import {
  setError,
  setIsAdd,
  setMessage,
  setSuccess,
} from "../../../../store/StoreAction";
import { queryData } from "../../../../functions/custom-hooks/queryData";
import useQueryData from "../../../../functions/custom-hooks/useQueryData";
import ModalWrapperSide from "../../../../partials/modals/ModalWrapperSide";
import { FaTimes } from "react-icons/fa";
import { ErrorMessage, Field, Form, Formik } from "formik";
import ButtonSpinner from "../../../../partials/spinners/ButtonSpinner";
import MessageError from "../../../../partials/MessageError";

const ModalAddDirectReport = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const queryClient = useQueryClient();

  // Fetch employees to populate the Select Dropdowns
  const { data: employeesData } = useQueryData(
    `${apiVersion}/controllers/developers/employees/employees.php`,
    "get",
    "employees-active",
  );

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/controllers/developers/settings/direct-report/direct-report.php?id=${itemEdit.direct_report_aid}`
          : `${apiVersion}/controllers/developers/settings/direct-report/direct-report.php`,
        itemEdit ? "put" : "post",
        values,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["direct-report"] });
      // Also invalidate employees since their data is updated by this action!
      queryClient.invalidateQueries({ queryKey: ["employees"] });

      if (data.success) {
        dispatch(setSuccess(true));
        dispatch(setMessage(`Successfully ${itemEdit ? "updated" : "added"}`));
        dispatch(setIsAdd(false));
      }
      if (data.success == false) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

  const initVal = {
    ...itemEdit,
    direct_report_subordinate_id: itemEdit
      ? itemEdit.direct_report_subordinate_id
      : "",
    direct_report_supervisor_id: itemEdit
      ? itemEdit.direct_report_supervisor_id
      : "",
  };

  const yupSchema = Yup.object({
    direct_report_subordinate_id: Yup.string().required("Required"),
    direct_report_supervisor_id: Yup.string()
      .required("Required")
      // BONUS VALIDATION: Prevent selecting the same person
      .notOneOf(
        [Yup.ref("direct_report_subordinate_id")],
        "Supervisor cannot be the same as the Subordinate.",
      ),
  });

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  return (
    <>
      <ModalWrapperSide
        handleClose={handleClose}
        className="transition-all ease-in-out transform duration-200"
      >
        <div className="modal-header relative mb-4">
          <h3 className="text-dark text-sm">
            {itemEdit ? "Update" : "Add"} Direct Report
          </h3>
          <button
            type="button"
            className="absolute top-0 right-4 text-gray-400 hover:text-primary"
            onClick={handleClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <Formik
            initialValues={initVal}
            enableReinitialize={true}
            validationSchema={yupSchema}
            onSubmit={async (values) => {
              dispatch(setError(false));
              mutation.mutate(values);
            }}
          >
            {(props) => {
              return (
                <Form className="h-full flex flex-col">
                  <div className="modal-form-container flex-grow">
                    <div className="modal-container space-y-6">
                      {/* SUBORDINATE SELECT */}
                      <div className="relative">
                        <label className="block mb-2 text-xs font-bold text-gray-700">
                          *Subordinate
                        </label>
                        <Field
                          as="select"
                          name="direct_report_subordinate_id"
                          className="input-main w-full p-2 border border-gray-300 rounded-md outline-none focus:border-primary"
                          disabled={mutation.isPending}
                        >
                          <option value="">Select subordinate</option>
                          {employeesData?.data?.map((emp) => (
                            <option
                              key={emp.employee_aid}
                              value={emp.employee_aid}
                            >
                              {emp.employee_last_name},{" "}
                              {emp.employee_first_name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="direct_report_subordinate_id"
                          component="div"
                          className="text-alert text-xs mt-1 text-red-500"
                        />
                      </div>

                      {/* SUPERVISOR SELECT */}
                      <div className="relative">
                        <label className="block mb-2 text-xs font-bold text-gray-700">
                          *Supervisor
                        </label>
                        <Field
                          as="select"
                          name="direct_report_supervisor_id"
                          className="input-main w-full p-2 border border-gray-300 rounded-md outline-none focus:border-primary"
                          disabled={mutation.isPending}
                        >
                          <option value="">Select supervisor</option>
                          {employeesData?.data?.map((emp) => (
                            <option
                              key={emp.employee_aid}
                              value={emp.employee_aid}
                            >
                              {emp.employee_last_name},{" "}
                              {emp.employee_first_name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="direct_report_supervisor_id"
                          component="div"
                          className="text-alert text-xs mt-1 text-red-500"
                        />
                      </div>

                      {store.error && <MessageError />}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="modal-action flex justify-end gap-2 mt-6 pt-4 border-t">
                    <button
                      type="button"
                      className="btn-modal-cancel px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                      onClick={handleClose}
                      disabled={mutation.isPending}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={mutation.isPending || !props.dirty}
                      className="btn-modal-submit px-4 py-2 bg-[#d87093] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {mutation.isPending ? (
                        <ButtonSpinner />
                      ) : itemEdit ? (
                        "Save"
                      ) : (
                        "Add"
                      )}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </ModalWrapperSide>
    </>
  );
};

export default ModalAddDirectReport;
