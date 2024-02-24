import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/cartSlice";

const Product = ({ product }) => {
const dispatch = useDispatch();
  const navigate = useNavigate();
  const _id = product._id;
  const idString = (_id) => {
    return String(_id).toLowerCase().split(" ").join("");
  };
  const rootId = idString(_id);

  const handleProductDetails = (product) => {
    navigate(`/product/${rootId}`, {
      state: {
        item: product,
      },
    });
  };

  return (
    <div className="w-full relative group">
      <div className="max-w-80 max-h-80 relative overflow-y-hidden">
        <div>
          <Image className="w-full h-full" imgSrc={product.image}/>
        </div>
        <div className="absolute top-6 left-8">
          {product.badge && <Badge text="New" />}
        </div>
        <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
            <li
              onClick={() =>
                dispatch(
                  addToCart({
                    _id: product._id,
                    name: product.productName,
                    quantity: 1,
                    image: product.image,
                    badge: product.badge,
                    price: product.price,
                    colors: product.color,
                  })
                )
              }
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              Add to Cart
              <span>
                <FaShoppingCart />
              </span>
            </li>
            <li
              onClick={handleProductDetails}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              View Details
              <span className="text-lg">
                <MdOutlineLabelImportant />
              </span>
            </li>
          </ul>
        </div>
        <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
          <div className="flex items-center justify-between font-titleFont">
            <h2 className="text-lg text-primeColor font-bold">
              {product.productName}
            </h2>
            <p className="text-[#767676] text-[14px]">${product.price}</p>
          </div>
          <div>
            <p className="text-[#767676] text-[14px]">{product.color}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
