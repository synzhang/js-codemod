import formatMessage from "util/formatMessage";
import { FC, useMemo } from "react";
import { Descriptions } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  PayCircleOutlined,
} from "@ant-design/icons";
import { TruckOutlined, RulerOutlined, WeightOutlined } from "component/Icon";
import { CURRENCY_CODE_CNY } from "util/constants";
import formatDate from "util/formatDate";
import formatPrice from "util/formatPrice";
import getCurrencySymbol from "util/getCurrencySymbol";
import Image from "component/Image";
import { useProductsData } from "../Context";
import { ParcelInterface } from "../types";
import "./index.less";

interface PropsInterface {
  data: ParcelInterface;
}

const TransactionRecordThumbnail: FC<PropsInterface> = (props) => {
  const { data } = props;
  const {
    buyerNick,
    deliveryTime = 0,
    signTime = 0,
    countryName,
    channelName,
    weight,
    length,
    width,
    height,
    freight: _freight,
    goodsList = [],
  } = data || {};
  const {
    currency: defaultCurrency,
    exchangeRate,
    whetherConvertPriceToDefaultCurrency,
  } = useProductsData();
  const willConvertPriceToDefaultCurrency =
    whetherConvertPriceToDefaultCurrency &&
    typeof defaultCurrency !== "undefined";
  const currency = willConvertPriceToDefaultCurrency
    ? defaultCurrency
    : CURRENCY_CODE_CNY;
  const freight =
    typeof _freight === "number"
      ? willConvertPriceToDefaultCurrency && typeof exchangeRate === "number"
        ? formatPrice(_freight, { exchangeRate })
        : _freight
      : "-";
  const pcsCount = goodsList.reduce(
    (total, product) => total + product.quantity,
    0
  );
  const images = useMemo(
    () => goodsList.map(({ img }) => img).slice(0, 3),
    [goodsList]
  );
  const moreImagesLength = goodsList.length - images.length;
  const durationOfDays = Math.ceil(
    (signTime - deliveryTime) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="transaction-record">
      <header className="flex-center-vertical p-20">
        <div className="flex-center-vertical">
          <Image
            className="mr-8"
            src={require("assets/img/avatar.svg")}
            height={32}
            width={32}
          />
          <span className="d-inline-block text-gray mr-16">{buyerNick}</span>
          <span>
            {formatMessage(
              {
                id: "purchased__0__pcs",
              },
              {
                0: pcsCount,
              }
            )}
          </span>
        </div>
        <div className="ml-auto">
          {typeof deliveryTime === "number" && (
            <time className="ml-auto text-right">
              {formatDate(deliveryTime)}
            </time>
          )}
        </div>
      </header>
      <div className="transaction-record-images bg-gray-dark">
        {images.map((image, index) => (
          <div key={index} className="transaction-record-image">
            <Image src={image} lazyload />
            {moreImagesLength > 0 && images.length - 1 === index && (
              <div className="transaction-record-images-more">
                +{moreImagesLength}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-20">
        <Descriptions layout="vertical">
          <Descriptions.Item
            label={
              <>
                <EnvironmentOutlined className="mr-5" />
                <span className="text-bold">
                  {formatMessage({
                    id: "destination",
                  })}
                </span>
              </>
            }
          >
            <span className="text-gray" style={{ marginLeft: 21 }}>
              {countryName}
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <WeightOutlined className="mr-5" />
                <span className="text-bold">
                  {formatMessage({
                    id: "weight",
                  })}
                </span>
              </>
            }
          >
            <span className="text-gray" style={{ marginLeft: 21 }}>
              {weight}g
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <RulerOutlined className="mr-5" />
                <span className="text-bold">
                  {formatMessage({
                    id: "size",
                  })}
                  (cm)
                </span>
              </>
            }
          >
            <span className="text-gray" style={{ marginLeft: 21 }}>
              {`${length} * ${width} * ${height}`}
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <TruckOutlined className="mr-5" />
                <span className="text-bold">
                  {formatMessage({
                    id: "logistic",
                  })}
                </span>
              </>
            }
            span={3}
          >
            <span className="text-gray truncate" style={{ marginLeft: 21 }}>
              {channelName}
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <PayCircleOutlined className="mr-5" />
                <span className="text-bold">
                  {formatMessage({
                    id: "logistics_cost",
                  })}
                </span>
              </>
            }
          >
            <span className="text-gray" style={{ marginLeft: 21 }}>
              <span>{`${getCurrencySymbol(currency)} ${freight}`}</span>
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <ClockCircleOutlined className="mr-5" />
                <span className="text-bold">
                  {formatMessage({
                    id: "delivery_time",
                  })}
                </span>
              </>
            }
          >
            <span className="text-gray" style={{ marginLeft: 21 }}>
              <span>{durationOfDays}</span>
              <span>
                {formatMessage({
                  id: "days",
                })}
              </span>
            </span>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};

export default TransactionRecordThumbnail;
