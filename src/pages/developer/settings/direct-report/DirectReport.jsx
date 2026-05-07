import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { queryDataInfinite } from "../../../../functions/custom-hooks/queryDataInfinite";
import { apiVersion } from "../../../../functions/functions-general";
import Loadmore from "../../../../partials/Loadmore";
import ModalDelete from "../../../../partials/modals/ModalDelete";
import NoData from "../../../../partials/NoData";
import SearchBar from "../../../../partials/SearchBar";
import ServerError from "../../../../partials/ServerError";
import FetchingSpinner from "../../../../partials/spinners/FetchingSpinner";
import Status from "../../../../partials/Status";
import TableLoading from "../../../../partials/TableLoading";
import { setIsAdd, setIsDelete } from "../../../../store/StoreAction";
import { StoreContext } from "../../../../store/StoreContext";
import ModalAddDirectReport from "./ModalAddDirectReport";
import Layout from "../../Layout";

const DirectReport = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  const [page, setPage] = React.useState(1);
  const [filterData, setFilterData] = React.useState("");
  const [onSearch, setOnSearch] = React.useState(false);
  const search = React.useRef({ value: "" });
  const { ref, inView } = useInView();
  let counter = 1;

  const {
    data: result,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [
      "direct-report",
      search.current.value,
      store.isSearch,
      filterData,
    ],
    queryFn: async ({ pageParam = 1 }) =>
      await queryDataInfinite(
        "",
        `${apiVersion}/controllers/developers/settings/direct-report/page.php?start=${pageParam}`,
        false,
        {
          filterData,
          searchValue: search?.current?.value,
        },
        "post",
      ),
    getNextPageParam: (lastPage, allPages) => {
      const loadedItems = allPages.flatMap((p) => p.data).length;
      if (loadedItems < lastPage.total) {
        return loadedItems + 1;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
  });

  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };

  const handleEdit = (item) => {
    dispatch(setIsAdd(true));
    setItemEdit(item);
  };

  const handleDelete = (item) => {
    dispatch(setIsDelete(true));
    setItemEdit(item);
  };

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      setPage((prev) => prev + 1);
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Layout menu="settings">
      <div className="p-4">
        {/* Header matching your standard layout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Direct Report</h1>
          <button
            className="text-primary font-bold flex items-center gap-1"
            onClick={handleAdd}
          >
            + Add
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative">
            <label htmlFor="">Status</label>
            <select
              onChange={(e) => setFilterData(e.target.value)}
              value={filterData}
            >
              <option value="">All</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          <SearchBar
            search={search}
            dispatch={dispatch}
            store={store}
            result={result?.pages}
            isFetching={isFetching}
            setOnSearch={setOnSearch}
            onSearch={onSearch}
          />
        </div>

        <div className="relative pt-4 rounded-md">
          {status !== "pending" && isFetching && <FetchingSpinner />}

          {/* Standard table without manual tailwind classes */}
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Status</th>
                <th>Name</th>
                <th>Department</th>
                <th>Supervisor</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {!error &&
                (status === "pending" || result?.pages[0]?.count === 0) && (
                  <tr>
                    <td colSpan="100%" className="p-10">
                      {status === "pending" ? (
                        <TableLoading cols={2} count={20} />
                      ) : (
                        <NoData />
                      )}
                    </td>
                  </tr>
                )}

              {error && (
                <tr>
                  <td colSpan="100%" className="p-10">
                    <ServerError />
                  </td>
                </tr>
              )}

              {result?.pages?.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page?.data?.map((item, itemIndex) => {
                    return (
                      <tr key={`${item.direct_report_aid}-${itemIndex}`}>
                        <td>{counter++}</td>
                        <td>
                          <Status
                            text={`${
                              item.direct_report_is_active == 1
                                ? "active"
                                : "inactive"
                            }`}
                          />
                        </td>
                        <td>
                          {item.sub_lname}, {item.sub_fname}
                        </td>
                        <td>{item.department_name || "N/A"}</td>
                        <td>
                          {item.sup_lname}, {item.sup_fname}
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="tooltip-action-table"
                              data-tooltip="Edit"
                              onClick={() => handleEdit(item)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              className="tooltip-action-table"
                              data-tooltip="Delete"
                              onClick={() => handleDelete(item)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <div className="loadmore flex justify-center flex-col items-center pb-10">
            <Loadmore
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              result={result?.pages[0]}
              setPage={setPage}
              page={page}
              refView={ref}
              isSearchOrFilter={store.isSearch || store?.isFilter}
            />
          </div>
        </div>
      </div>

      {store.isAdd && <ModalAddDirectReport itemEdit={itemEdit} />}

      {store.isDelete && itemEdit && (
        <ModalDelete
          mysqlApiDelete={`${apiVersion}/controllers/developers/settings/direct-report/direct-report.php?id=${itemEdit.direct_report_aid}`}
          msg="Are you sure you want to delete this record?"
          successMsg="Successfully deleted."
          item={`${itemEdit.sub_lname}, ${itemEdit.sub_fname}`}
          dataItem={itemEdit}
          queryKey="direct-report"
        />
      )}
    </Layout>
  );
};

export default DirectReport;
