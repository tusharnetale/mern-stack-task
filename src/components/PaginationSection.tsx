// "use client";

// import { useRouter, useSearchParams } from "next/navigation";

// function PaginationSection({
//   lastPage,
//   pageNo,
//   pageSize,
// }: {
//   lastPage: number;
//   pageNo: number;
//   pageSize: number;
// }) {
//   const router = useRouter();

//   const query = useSearchParams();
//   const searchParams = new URLSearchParams(query);

//   function handlePrev() {
//     alert("Please update the code.");
//   }

//   function handleNext() {
//     alert("Please update the code.");
//   }

//   return (
//     <div className="mt-12 p-4 bg-gray-800 flex justify-center gap-4 items-center mb-8">
//       <select
//         value={pageSize}
//         name="page-size"
//         className="text-black"
//         onChange={(e) => {
//           alert("Please update the code.");
//         }}
//       >
//         {["10", "25", "50"].map((val) => {
//           return (
//             <option key={val} value={val}>
//               {val}
//             </option>
//           );
//         })}
//       </select>
//       <button
//         className="p-3 bg-slate-300 text-black disabled:cursor-not-allowed"
//         disabled={pageNo === 1}
//         onClick={handlePrev}
//       >
//         &larr;Prev
//       </button>
//       <p>
//         Page {pageNo} of {lastPage}{" "}
//       </p>
//       <button
//         className="p-3 bg-slate-300 text-black disabled:cursor-not-allowed"
//         disabled={pageNo === lastPage}
//         onClick={handleNext}
//       >
//         Next&rarr;
//       </button>
//     </div>
//   );
// }

// export default PaginationSection;
"use client";

import { useRouter, useSearchParams } from "next/navigation";

function PaginationSection({
  lastPage,
  pageNo,
  pageSize,
}: {
  lastPage: number;
  pageNo: number;
  pageSize: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const params = new URLSearchParams(searchParams.toString()); // ✅ Make mutable copy

  function handlePrev() {
    if (pageNo > 1) {
      params.set("page", String(pageNo - 1));
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }

  function handleNext() {
    if (pageNo < lastPage) {
      params.set("page", String(pageNo + 1));
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }

  function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    params.set("pageSize", e.target.value);
    params.set("page", "1"); // ✅ Reset to first page
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mt-12 p-4 bg-gray-800 flex justify-center gap-4 items-center mb-8">
      <select
        value={pageSize}
        name="page-size"
        className="text-black"
        onChange={handlePageSizeChange}
      >
        {["10", "25", "50"].map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
      <button
        className="p-3 bg-slate-300 text-black disabled:cursor-not-allowed"
        disabled={pageNo === 1}
        onClick={handlePrev}
      >
        &larr; Prev
      </button>
      <p>
        Page {pageNo} of {lastPage}
      </p>
      <button
        className="p-3 bg-slate-300 text-black disabled:cursor-not-allowed"
        disabled={pageNo === lastPage}
        onClick={handleNext}
      >
        Next &rarr;
      </button>
    </div>
  );
}

export default PaginationSection;
