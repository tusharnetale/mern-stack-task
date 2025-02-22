"use client";
import { basicSchema } from "@/schemas/product";
import { getCategories } from "@/actions/categoryActions";
import { getBrands } from "@/actions/brandActions";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { occasionOptions } from "../../../../constant";
import Select from "react-select";


function AddProduct() {
  const [brandsOption, setBrandsOption] = useState([]);
  const [categoriesOption, setCategoriesOption] = useState([]);
  const [occasionOption, setOccasionOption] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();
  const {
    values: product,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    resetForm,
  }: any = useFormik({
    initialValues: {
      name: "",
      description: "",
      old_price: "",
      discount: "",
      rating: 0,
      colors: "",
      brands: null,
      categories: null,
      gender: "men",
      occasion: null,
      image_url: "",
    },
    validationSchema: basicSchema,

    // onSubmit: async (values, actions) => {
    //   console.log(JSON.stringify(values));
    //   try {
    //     const response = await fetch("http://localhost:3000/api/products", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(values),
    //     });

    //     const data = await response.json();

    //     if (data.success) {
    //       alert("Product added successfully!");
    //       actions.resetForm();
    //       setImagePreview(null);
    //       router.push("/products"); // Redirect to product list page
    //     } else {
    //       alert("Error: " + data.error);
    //     }
    //   } catch (error) {
    //     console.error("Failed to add product:", error);
    //     alert("An error occurred while adding the product.");
    //   }
    // },
    onSubmit: async (values, actions) => {
      console.log("Submitting Product Data:", JSON.stringify(values));
    
      try {
        // Convert selected options to arrays of IDs
        // const formattedValues = {
        //   ...values,
        //   old_price: parseFloat(values.old_price),
        //   discount: parseFloat(values.discount),
        //   rating: parseFloat(values.rating),
        //   brands: values.brands ? values.brands.map((b) => b.value) : [],
        //   categories: values.categories ? values.categories.map((c) => c.value) : [],
        //   occasion: values.occasion ? values.occasion.map((o) => o.value) : [],
        // };
    
        // Handle file upload (if needed)
        // if (values.image_url instanceof File) {
        //   const formData = new FormData();
        //   formData.append("file", values.image_url);
    
        //   const uploadResponse = await fetch("/api/upload", {
        //     method: "POST",
        //     body: formData,
        //   });
    
        //   const uploadData = await uploadResponse.json();
        //   if (!uploadResponse.ok) {
        //     throw new Error(uploadData.error || "Image upload failed");
        //   }
    
        //   formattedValues.image_url = uploadData.fileUrl; // Get file URL from upload API
        // }
    
        // Send product data to backend API
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
    
        const data = await response.json();
    
        if (data.success) {
          alert("✅ Product added successfully!");
          actions.resetForm();
          router.push("/products"); // Redirect to product list
        } else {
          alert("⚠️ Error: " + data.error);
        }
      } catch (error) {
        console.error("Failed to add product:", error);
        alert("❌ An error occurred while adding the product.");
      }
    }
    
  });

  useEffect(() => {
    setLoading(true);
    (async function () {
      const brands = await getBrands();
      const brandsOption = brands.map((brand) => ({
        value: brand.id,
        label: brand.name,
      }));

      const categories = await getCategories();
      const categoriesOption = categories.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      const occasionOption = occasionOptions.map((item) => {
        return {
          value: item,
          label: item,
        };
      });

      setBrandsOption(brandsOption as any);
      setCategoriesOption(categoriesOption as any);
      setOccasionOption(occasionOption as any);
      setLoading(false);
    })();
  }, [setValues]);

  function handleChangeSelect(selectedOptions) {
    if (selectedOptions.length === 0) {
      setValues({
        ...product,
        brands: null,
      });
      return;
    }
    setValues({
      ...product,
      brands: selectedOptions,
    });
  }
  function handleOccasion(selectedOptions) {
    if (selectedOptions.length === 0) {
      setValues({
        ...product,
        occasion: null,
      });
      return;
    }
    setValues({
      ...product,
      occasion: selectedOptions,
    });
  }
  function handleCategories(selectedOptions) {
    if (selectedOptions.length === 0) {
      setValues({
        ...product,
        categories: null,
      });
      return;
    }
    setValues({
      ...product,
      categories: selectedOptions,
    });
  }

  function handleFileInput(e) {
    const file = e.target.files[0];
    setValues({
      ...product,
      image_url: `/images/${file.name}`,
    });
  }

  function handleColorPicker(e) {
    setValues({
      ...product,
      colors: product.colors
        ? `${product.colors},${e.target.value}`
        : e.target.value,
    });
  }

  if (loading) return <h2 className="text-lg">Loading...</h2>;

  return (
    <div className="w-1/3 text-white">
      <h1 className="mb-8 text-xl">Add Product details</h1>
      {isSubmitting && <p className="text-lg text-yellow-200">Submitting...</p>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name: </label>
          <input
            type="text"
            name="name"
            id="name"
            value={product.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            placeholder="Enter name"
          />
          {errors.name && touched.name && (
            <p className="error">{errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="description">Product description: </label>
          <textarea
            className="text-black"
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={5}
            cols={30}
            disabled={isSubmitting}
            placeholder="Enter description"
          />
          {errors.description && touched.description && (
            <p className="error">{errors.description}</p>
          )}
        </div>
        <div>
          <label htmlFor="description" id="price">
            Product old price:{" "}
          </label>
          <input
            type="number"
            name="old_price"
            placeholder="Enter old price"
            value={product.old_price}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            step={0.1}
          />
          {errors.old_price && touched.old_price && (
            <p className="error">{errors.old_price}</p>
          )}
        </div>
        <div>
          <label htmlFor="discount">Product Discount: </label>
          <input
            type="number"
            name="discount"
            id="discount"
            value={product.discount}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            step={0.1}
            placeholder="Enter product discount"
          />
          {errors.discount && touched.discount && (
            <p className="error">{errors.discount}</p>
          )}
        </div>
        <div></div>
        <div>
          <div className="flex gap-4">
            <label htmlFor="colors">Product colors: </label>
            <input
              type="text"
              name="colors"
              id="colors"
              placeholder="Enter product colors"
              onChange={handleChange}
              disabled={isSubmitting}
              onBlur={handleBlur}
              value={product.colors}
            />
            <input type="color" id="colors" onBlur={handleColorPicker} />
          </div>
          {errors.colors && touched.colors && (
            <p className="error">{errors.colors}</p>
          )}
        </div>
        <div>
          <label htmlFor="rating">Product Rating: </label>
          <input
            type="number"
            className="text-black"
            name="rating"
            id="rating"
            min={0}
            max={5}
            value={product.rating}
            disabled={isSubmitting}
            onBlur={handleBlur}
            onChange={handleChange}
          ></input>
          {errors.rating && touched.rating && (
            <p className="error">{errors.rating}</p>
          )}
        </div>
        <div>
          <label htmlFor="gender">Product Gender: </label>
          <select
            className="text-black"
            name="gender"
            id="gender"
            value={product.gender}
            disabled={isSubmitting}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            {["men", "boy", "women", "girl"].map((gender, i) => {
              return (
                <option key={i} value={gender}>
                  {gender}
                </option>
              );
            })}
          </select>
          {errors.gender && touched.gender && (
            <p className="error">{errors.gender}</p>
          )}
        </div>

        <div>
          <label htmlFor="brands">Brands</label>
          <Select
            className="flex-1 text-black"
            options={brandsOption}
            isMulti
            name="brands"
            onChange={handleChangeSelect}
            onBlur={handleBlur}
            value={product.brands}
            isDisabled={isSubmitting}
          />
          {errors.brands && touched.brands && (
            <p className="error">{String(errors.brands)}</p>
          )}
        </div>

        <div className=" flex  items-center gap-4 mb-4">
          <span>Occasion</span>
          <Select
            className="flex-1 text-black"
            options={occasionOption}
            isMulti
            name="occasion"
            onChange={handleOccasion}
            onBlur={handleBlur}
            isDisabled={isSubmitting}
            value={product.occasion}
          />
          {errors.occasion && touched.occasion && (
            <p className="error">{String(errors.occasion)}</p>
          )}
        </div>
        <div className=" flex items-center gap-4 mb-4">
          <span>Choose Categories</span>
          <Select
            className="flex-1 text-black"
            options={categoriesOption}
            isMulti
            name="categories"
            onChange={handleCategories}
            onBlur={handleBlur}
            isDisabled={isSubmitting}
            value={product.categories}
          />
          {errors.categories && touched.categories && (
            <p className="error">{String(errors.categories)}</p>
          )}
        </div>
        <div className=" flex  items-center gap-4 mb-4">
          <label htmlFor="image_url">Upload an image</label>
          <input
            className="text-white"
            type="file"
            name="image_url"
            id="image_url"
            onChange={handleFileInput}
            onBlur={handleBlur}
            disabled={isSubmitting}
            accept="image/*"
          />
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className="w-1/2 p-4 bg-white text-black"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
