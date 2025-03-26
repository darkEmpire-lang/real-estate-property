import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaEdit } from "react-icons/fa"; // Import Edit Icon
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import "jspdf-autotable"; // Import jsPDF autotable plugin for table formatting

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    productId: "",
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    bestseller: false,
    sizes: [],
  });

  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Fetch Product List
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching product list.");
    }
  };

  // Remove Product
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { Authorization: `Bearer ${token}` } } // Ensure proper authentication
      );

      if (response.data.success) {
        toast.success("Product removed successfully!");
        fetchList(); // Refresh the list after deletion
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error removing product.");
    }
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setCurrentProduct({
      productId: product._id, // Ensure ID is passed
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory,
      bestseller: product.bestseller,
      sizes: product.sizes.join(","), // Convert array to string for input field
    });
    setEditModal(true);
  };

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        backendUrl + "/api/product/update/" + currentProduct.productId,
        {
          ...currentProduct,
          sizes: JSON.stringify(currentProduct.sizes.split(",")), // Convert back to array
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is sent
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Product updated successfully!");
        fetchList(); // Refresh list
        setEditModal(false); // Close modal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating product.");
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
  };

  // Fetch List on Component Mount
  useEffect(() => {
    fetchList();
  }, []);

  // Search Filter
  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Product List Report", 14, 20);

    // Logo (Optional)
    const logo = new Image();
    logo.src = "ag.png"; // Path to the logo image
    logo.onload = function() {
      doc.addImage(logo, "PNG", 14, 10, 50, 20); // Add logo image to PDF

      // Table data
      const tableData = filteredList.map((item) => [
        item.category,
        item.subcategory,
        `${currency}${item.price}`,
      ]);

      // Create table
      doc.autoTable({
        head: [["Category", "Subcategory", "Price"]],
        body: tableData,
        startY: 40, // Position of table
        styles: { fontSize: 10, cellPadding: 2, tableWidth: "auto" },
      });

      doc.save("product_report.pdf"); // Save the PDF with the name
    };
  };

  return (
    <>
      <ToastContainer />
      <div className="p-4">
        <p className="mb-4 text-lg font-bold">All Products List</p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products"
          className="border p-2 rounded-md mb-4 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm font-medium">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        <div className="flex flex-col gap-4">
          {filteredList.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border rounded-md"
            >
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <p className="font-medium">{item.name}</p>
              <p>{item.category}</p>
              <p>
                {currency}
                {item.price}
              </p>
              <div className="flex justify-center gap-4">
                <FaEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => openEditModal(item)}
                />
                <p
                  onClick={() => removeProduct(item._id)}
                  className="text-red-500 cursor-pointer hover:underline text-center"
                >
                  X
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={generatePDF}
          className="bg-green-500 text-white py-2 px-4 rounded-md mt-4"
        >
          Generate PDF Report
        </button>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                value={currentProduct.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="border p-2 rounded-md w-full"
                required
              />
              <textarea
                name="description"
                value={currentProduct.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-2 rounded-md w-full"
                rows="3"
                required
              />
              <input
                type="number"
                name="price"
                value={currentProduct.price}
                onChange={handleChange}
                placeholder="Price"
                className="border p-2 rounded-md w-full"
                required
              />
              <input
                type="text"
                name="category"
                value={currentProduct.category}
                onChange={handleChange}
                placeholder="Category"
                className="border p-2 rounded-md w-full"
                required
              />
              <input
                type="text"
                name="subcategory"
                value={currentProduct.subcategory}
                onChange={handleChange}
                placeholder="Sub Category"
                className="border p-2 rounded-md w-full"
                required
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="bestseller"
                  checked={currentProduct.bestseller}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      bestseller: e.target.checked,
                    })
                  }
                />
                Best Seller
              </label>
              <input
                type="text"
                name="sizes"
                value={currentProduct.sizes}
                onChange={handleChange}
                placeholder="Sizes (comma separated)"
                className="border p-2 rounded-md w-full"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
