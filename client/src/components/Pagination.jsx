import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComp = ({ page, limit, setPage, setLimit, total }) => {
  return (
    <div className="w-full flex flex-col-reverse sm:flex-row  sm:space-y-0    items-center justify-center sm:space-x-20">
      <div className="flex  space-x-4 items-center h-full my-10 sm:my-0  p-2 ">
        <label htmlFor="limit" className="text-xl font-semibold text-white">
          Show :{" "}
        </label>
        <div>
          <select
            name="limit"
            id="limit"
            className=" px-6 py-2 rounded-lg  bg-gradient-to-tr from-black via-gray-700 to-gray-600 text-white"
            onChange={(e) => setLimit(e.target.value)}
            defaultValue={limit}
          >
            <option
              value={5}
              className="bg-white/80 text-black cursor-pointer "
            >
              5
            </option>
            <option
              value={10}
              className="bg-white/80 text-black cursor-pointer "
            >
              10
            </option>
            <option
              value={15}
              className="bg-white/80 text-black cursor-pointer "
            >
              15
            </option>
            <option
              value={20}
              className="bg-white/80 text-black cursor-pointer "
            >
              20
            </option>
            <option
              value={30}
              className="bg-white/80 text-black cursor-pointer "
            >
              30
            </option>
            <option
              value={40}
              className="bg-white/80 text-black cursor-pointer "
            >
              40
            </option>
          </select>
        </div>
      </div>
      <div>
        <Pagination className={``}>
          <PaginationContent className={`bg-white py-1.5 px-3 rounded-xl`}>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              />
            </PaginationItem>
            {page > 2 && (
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    setPage(+e.target.textContent);
                  }}
                >
                  {page - 2}
                </PaginationLink>
              </PaginationItem>
            )}
            {page != 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    setPage(+e.target.textContent);
                  }}
                >
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                className={`font-bold outline-1 shadow-2xl`}
                onClick={(e) => {
                  setPage(+e.target.textContent);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
            {total - page >= 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    setPage(+e.target.textContent);
                  }}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {total - page >= 2 && (
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    setPage(+e.target.textContent);
                  }}
                >
                  {page + 2}
                </PaginationLink>
              </PaginationItem>
            )}
            {total - page >= 3 && (
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    setPage(+e.target.textContent);
                  }}
                >
                  {page + 2}
                </PaginationLink>
              </PaginationItem>
            )}
            {total - page >= 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(page + 1)}
                disabled={total - page === 0}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationComp;
