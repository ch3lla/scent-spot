import React, { useState, useEffect } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";

import {
  BestProductSix ,
  BestProductTwo,
  BestProductTen,
  BestProductFour,
} from "../../../assets/myImages/index";

const SpecialOffers = () => {
  const [specialOffers, setSpecialOffers] = useState([]);

  useEffect(() => {
    // Fetch new products data from an API or any other data source
    // Example:
    // fetchspecialOffers().then((data) => setspecialOffers(data));
    const data = [
      {
        _id: "100001",
        image: BestProductSix,
        productName: "Catelina Hermona",
        price: "44.00",
        color: "Gold",
        badge: true,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        _id: "65d78dcf8d90eb34605cd027",
        image: BestProductTwo,
        productName: "Dolce & Gabanna",
        price: "80.00",
        color: "Black",
        badge: true,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        _id: "100001",
        image: BestProductTen,
        productName: "Jimmy Choo",
        price: "100.00",
        color: "Pink",
        badge: true,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        _id: "65d89c088d90eb34605cd048",
        image: BestProductFour,
        productName: "Signoria",
        price: "80.00",
        color: "Black",
        badge: true,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
    ];
    setSpecialOffers(data);
  }, []);
  return (
    <div className="w-full pb-20">
      <Heading heading="Special Offers" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
      {specialOffers.map((product) => (
          <div key={product._id} className="px-2">
            <Product product={product}
              _id={product._id}
              image={product.image}
              productName={product.productName}
              price={product.price}
              color={product.color}
              badge={product.badge}
              description={product.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialOffers;
