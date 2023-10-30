import { Label } from "../form/form.style";
import {
  WrapContents,
  ProductTitle,
  ProductName,
  ProductPrice,
  ProductLocation,
  ProductImage,
  ProductBtn,
  ProductTag,
  WrapSpan,
  WrapProductTag,
  ProductContainer,
} from "./campsiteFeed.style";
import React from "react";

export default function Feed({ data, setProductId, setOpModal }) {
  return (
    <>
      <ProductContainer>
        <ProductTitle>{`${data.author.username}님의 캠핑장`}</ProductTitle>
        <WrapContents>
          <ProductBtn
            onClick={() => {
              setProductId(data.id);
              setOpModal(true);
            }}
          >
            <ProductImage src={data.itemImage} />
          </ProductBtn>

          <WrapSpan>
            <ProductName>{JSON.parse(data.itemName).name}</ProductName>
            <ProductPrice>{data.price.toLocaleString()}원 ~</ProductPrice>
            <ProductLocation>
              {JSON.parse(data.itemName).location}
            </ProductLocation>
            <WrapProductTag>
              {JSON.parse(data.itemName).labels.map(item => (
                <ProductTag key={item}>{item}</ProductTag>
              ))}
            </WrapProductTag>
          </WrapSpan>
        </WrapContents>
      </ProductContainer>
    </>
  );
}
