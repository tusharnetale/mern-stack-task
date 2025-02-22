  "use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { MultiSelect } from "react-multi-select-component";
import "rc-slider/assets/index.css";
import { occasionOptions } from "../../constant";
import dynamic from "next/dynamic";
import { useQueryParams } from "@/hooks/useQueryParams";
const Select = dynamic(() => import("react-select"), { ssr: false });

const discountOptions = [
  { value: "", label: "None" },
  { value: "0-5", label: "From 0% to 5%" },
  { value: "6-10", label: "From 6% to 10%" },
  { value: "11-15", label: "From 11% to 15%" },
];

function Filter({ categories, brands }) {
  const searchParams = useQueryParams();
  const router = useRouter();

  const brandsOption = useMemo(
    () =>
      brands.map((brand) => ({
        value: brand.id,
        label: brand.name,
      })),
    [brands]
  );

  const categoriesOption = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories]
  );

  const occasionOption = useMemo(
    () =>
      occasionOptions.map((item) => ({
        value: item,
        label: item,
      })),
    []
  );

  const [categoriesSelected, setCategoriesSelected] = useState(() => {
    const categoryIds = searchParams.get("categoryId")?.split(",") || [];
    return categoryIds
      .map((id) => ({
        value: +id,
        label: categoriesOption.find((opt) => opt.value === +id)?.label || "",
      }))
      .filter((item) => item.label);
  });

  const [selectedGender, setSelectedGender] = useState(
    searchParams.get("gender") || ""
  );
  const [sliderValue, setSliderValue] = useState(
    searchParams.get("priceRangeTo") || 2000
  );

  const [sliderChanged, setSliderChanged] = useState(false);

  const initialDiscountOptions = useMemo(() => {
    const value = searchParams.get("discount") || "";
    const [from, to] = value.split("-");
    return value ? { value, label: `From ${from}% to ${to}%` } : discountOptions[0];
  }, []);

  const initialBrandOptions = useMemo(() => {
    const brandIds = searchParams.get("brandId")?.split(",") || [];
    return brandIds
      .map((id) => ({
        value: +id,
        label: brandsOption.find((opt) => opt.value === +id)?.label || "",
      }))
      .filter((item) => item.label);
  }, [brandsOption]);

  const initialOccasionOptions = useMemo(() => {
    const occasionValues = searchParams.get("occasions")?.split(",") || [];
    return occasionValues.map((value) => ({ value, label: value }));
  }, []);

  useEffect(() => {
    if (sliderChanged) {
      const handler = setTimeout(() => {
        searchParams.set("priceRangeTo", `${sliderValue}`);
        router.push(`/products?${searchParams.toString()}`, { scroll: false });
      }, 300);

      return () => clearTimeout(handler);
    }
  }, [sliderValue]);

  function updateQueryParams(key, value) {
    searchParams.set(key, value);
    searchParams.delete("page");
    searchParams.delete("pageSize");
    router.push(`/products?${searchParams.toString()}`, { scroll: false });
  }

  const handleBrandsSelect = (selected) => {
    setCategoriesSelected(selected);
    const brandIds = selected.map((item) => item.value).join(",");
    updateQueryParams("brandId", brandIds);
  };

  const handleCategoriesSelected = (selected) => {
    setCategoriesSelected(selected);
    const categoryIds = selected.map((item) => item.value).join(",");
    updateQueryParams("categoryId", categoryIds);
  };

  const handleSlider = (e) => {
    setSliderValue(e.target.value);
    setSliderChanged(true);
  };

  const handleSliderApply = () => {
    updateQueryParams("priceRangeTo", sliderValue);
  };

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
    updateQueryParams("gender", e.target.value);
  };

  const handleOccasions = (selected) => {
    const occasions = selected.map((item) => item.value).join(",");
    updateQueryParams("occasions", occasions);
  };

  const handleDiscount = (selected) => {
    updateQueryParams("discount", selected.value);
  };

  const handleClearAll = () => {
    ["categoryId", "brandId", "priceRangeTo", "gender", "occasions", "discount"].forEach((param) =>
      searchParams.delete(param)
    );
    router.push(`/products?${searchParams.toString()}`);
  };

  return (
    <div className="w-full">
      <button className="bg-white p-2 my-4 text-black" onClick={handleClearAll}>
        Clear All
      </button>
      <p className="text-lg">Filter By</p>

      <div className="w-1/4 flex items-center gap-4 mb-4">
        <span>Brands</span>
        <Select
          className="flex-1 text-black"
          options={brandsOption}
          isMulti
          name="brands"
          onChange={handleBrandsSelect}
          defaultValue={initialBrandOptions}
        />
      </div>

      <div className="w-1/3 flex items-center gap-4 mb-4">
        <span>Categories</span>
        <MultiSelect
          className="text-black flex-1"
          options={categoriesOption}
          value={categoriesSelected}
          labelledBy="categories select"
          hasSelectAll={false}
          onChange={handleCategoriesSelected}
        />
      </div>

      <div>
        <span>Select products from Range 1 to 2000</span>
        <br />
        <span>Current Value {sliderValue}</span> <br />
        <input
          type="range"
          step="50"
          min="100"
          max="2000"
          value={sliderValue}
          onChange={handleSlider}
        />
        <button className="bg-white p-2 my-2 text-black" onClick={handleSliderApply}>
          Apply Range
        </button>
      </div>

      <div>
        <span>Select Gender:</span>
        <br />
        {["", "men", "women", "boy", "girl"].map((gender) => (
          <label key={gender}>
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={selectedGender === gender}
              onChange={handleGenderChange}
            />
            {gender || "None"}
            <br />
          </label>
        ))}
      </div>

      <div className="w-1/4 flex items-center gap-4 mb-4">
        <span>Occasion</span>
        <Select
          className="flex-1 text-black"
          options={occasionOption}
          isMulti
          name="occasion"
          onChange={handleOccasions}
          defaultValue={initialOccasionOptions}
        />
      </div>

      <div className="w-1/4 flex items-center gap-4 mb-4">
        <span>Filter By Discount</span>
        <Select
          className="flex-1 text-black"
          options={discountOptions}
          name="discount"
          defaultValue={initialDiscountOptions}
          onChange={handleDiscount}
        />
      </div>
    </div>
  );
}

export default Filter;
